const express = require("express");
const router = express.Router();
const { query } = require("../config/db");
const { hash, compare } = require("../utils/bcrypt");
const { sign } = require("../utils/jwt");
const { success, error } = require("../utils/response");
const { getOpenidByLoginCode } = require("../utils/wechat");
const {
  isPnvsEnabled,
  sendSmsVerifyCode,
  checkSmsVerifyCode,
} = require("../utils/aliyunPnvs");
const { auth } = require("../middleware/auth");
const { pickRandomDefaultAvatar } = require("../utils/defaultAvatar");
const { PnvsUserError, respondWithError } = require("../utils/pnvsErrors");
const {
  assertSmsSendAllowed,
  recordSmsSend,
} = require("../utils/smsRateLimit");
const { mergeUsers } = require("../utils/userMerge");
const {
  authLoginLimiter,
  sendCodeLimiter,
} = require("../middleware/rateLimit");

function formatAuthUser(user) {
  return {
    id: user.id,
    username: user.username,
    phone: user.phone || null,
    openid: user.openid || null,
    avatar: user.avatar,
    signature: user.signature,
    phoneBound: !!user.phone,
    openidBound: !!user.openid,
  };
}

async function findOrCreateUserByPhone(phone) {
  let users = await query("SELECT * FROM users WHERE phone = ?", [phone]);
  if (users.length > 0) {
    return users[0];
  }

  const username = `萌宠用户${phone.slice(-4)}`;
  const hashedPassword = await hash(`${phone}_${Date.now()}`);
  const avatar = pickRandomDefaultAvatar();
  const result = await query(
    "INSERT INTO users (username, phone, password, avatar, created_at) VALUES (?, ?, ?, ?, NOW())",
    [username, phone, hashedPassword, avatar],
  );
  users = await query("SELECT * FROM users WHERE id = ?", [result.insertId]);
  return users[0];
}

async function findOrCreateUserByOpenid(openid) {
  let users = await query("SELECT * FROM users WHERE openid = ?", [openid]);
  if (users.length > 0) {
    return users[0];
  }

  const suffix = openid.slice(-4).replace(/[^a-zA-Z0-9]/g, "0") || "0000";
  const username = `萌宠用户${suffix}`;
  const hashedPassword = await hash(`wx_${openid}_${Date.now()}`);
  const avatar = pickRandomDefaultAvatar();
  const result = await query(
    "INSERT INTO users (username, phone, openid, password, avatar, created_at) VALUES (?, NULL, ?, ?, ?, NOW())",
    [username, openid, hashedPassword, avatar],
  );
  users = await query("SELECT * FROM users WHERE id = ?", [result.insertId]);
  return users[0];
}

async function verifySmsCode(phone, code) {
  const devCode = process.env.SMS_DEV_CODE || "1234";
  const isProduction = process.env.NODE_ENV === "production";

  if (!isPnvsEnabled()) {
    if (!isProduction && code === devCode) {
      return true;
    }
    try {
      const codes = await query(
        "SELECT * FROM sms_codes WHERE phone = ? AND code = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
        [phone, code],
      );
      return codes.length > 0;
    } catch (dbErr) {
      if (dbErr.code === "ER_NO_SUCH_TABLE") {
        return !isProduction && code === devCode;
      }
      throw dbErr;
    }
  }

  if (!isProduction && code === devCode) {
    return true;
  }

  return await checkSmsVerifyCode(phone, code);
}

async function sendSmsCodeLocal(phone) {
  const code = process.env.SMS_DEV_CODE || "1234";
  await query("DELETE FROM sms_codes WHERE phone = ?", [phone]);
  await query(
    "INSERT INTO sms_codes (phone, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
    [phone, code],
  );
  return code;
}

/**
 * 用户注册
 */
router.post("/register", authLoginLimiter, async (req, res) => {
  const { username, phone, password } = req.body;

  if (!username || !phone || !password) {
    return res.status(400).json(error("请填写完整信息", 400));
  }

  if (username.length < 2 || username.length > 20) {
    return res.status(400).json(error("用户名长度应为2-20个字符", 400));
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error("手机号格式不正确", 400));
  }

  if (password.length < 6 || password.length > 20) {
    return res.status(400).json(error("密码长度应为6-20个字符", 400));
  }

  try {
    const existing = await query("SELECT id FROM users WHERE phone = ?", [
      phone,
    ]);
    if (existing.length > 0) {
      return res.status(400).json(error("该手机号已注册", 400));
    }

    const hashedPassword = await hash(password);
    const avatar = pickRandomDefaultAvatar();

    const result = await query(
      "INSERT INTO users (username, phone, password, avatar, created_at) VALUES (?, ?, ?, ?, NOW())",
      [username, phone, hashedPassword, avatar],
    );

    const token = sign({ id: result.insertId });

    res.json(
      success(
        {
          token,
          user: {
            id: result.insertId,
            username,
            phone,
            avatar,
            phoneBound: true,
          },
        },
        "注册成功",
      ),
    );
  } catch (err) {
    console.error("注册失败:", err);
    res.status(500).json(error("注册失败", 500));
  }
});

/**
 * 用户登录（密码）
 */
router.post("/login", authLoginLimiter, async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json(error("请填写手机号和密码", 400));
  }

  try {
    const users = await query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (users.length === 0) {
      return res.status(400).json(error("手机号或密码错误", 400));
    }

    const user = users[0];

    if (user.status !== 1) {
      return res.status(403).json(error("账号已被禁用", 403));
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(error("手机号或密码错误", 400));
    }

    const token = sign({ id: user.id });

    res.json(
      success(
        {
          token,
          user: formatAuthUser(user),
        },
        "登录成功",
      ),
    );
  } catch (err) {
    console.error("登录失败:", err);
    res.status(500).json(error("登录失败", 500));
  }
});

/**
 * 检查token有效性
 */
router.get("/check", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.json(success({ valid: false }, "未登录"));
  }

  try {
    const { verify } = require("../utils/jwt");
    const decoded = verify(token);

    if (!decoded) {
      return res.json(success({ valid: false }, "token无效"));
    }

    const users = await query(
      "SELECT id, username, phone, avatar FROM users WHERE id = ? AND status = 1",
      [decoded.id],
    );
    if (users.length === 0) {
      return res.json(success({ valid: false }, "用户不存在"));
    }

    const user = users[0];
    res.json(
      success(
        {
          valid: true,
          user: { ...user, phoneBound: !!user.phone },
        },
        "token有效",
      ),
    );
  } catch (err) {
    res.json(success({ valid: false }, "token验证失败"));
  }
});

/**
 * 修改密码（需登录）
 */
router.post("/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json(error("请填写完整信息", 400));
  }

  if (newPassword.length < 6 || newPassword.length > 20) {
    return res.status(400).json(error("新密码长度应为6-20个字符", 400));
  }

  try {
    const users = await query(
      "SELECT * FROM users WHERE id = ? AND status = 1",
      [req.user.id],
    );
    if (users.length === 0) {
      return res.status(404).json(error("用户不存在", 404));
    }

    const user = users[0];
    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json(error("原密码错误", 400));
    }

    const hashedPassword = await hash(newPassword);
    await query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, user.id],
    );

    res.json(success(null, "密码修改成功"));
  } catch (err) {
    console.error("修改密码失败:", err);
    res.status(500).json(error("修改失败", 500));
  }
});

/**
 * 重置密码（需短信验证码）
 */
router.post("/reset-password", authLoginLimiter, async (req, res) => {
  const { phone, code, newPassword } = req.body;

  if (!phone || !code || !newPassword) {
    return res.status(400).json(error("请填写完整信息", 400));
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error("手机号格式不正确", 400));
  }

  if (newPassword.length < 6 || newPassword.length > 20) {
    return res.status(400).json(error("密码长度应为6-20个字符", 400));
  }

  try {
    const codeValid = await verifySmsCode(phone, code);
    if (!codeValid) {
      return res.status(400).json(error("验证码错误或已过期", 400));
    }

    const users = await query(
      "SELECT id FROM users WHERE phone = ? AND status = 1",
      [phone],
    );
    if (users.length === 0) {
      return res.status(400).json(error("手机号未注册", 400));
    }

    const hashedPassword = await hash(newPassword);
    await query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, users[0].id],
    );

    res.json(success(null, "密码重置成功"));
  } catch (err) {
    if (err instanceof PnvsUserError) {
      return res.status(err.statusCode).json(error(err.message, err.statusCode));
    }
    console.error("重置密码失败:", err);
    res.status(500).json(error("重置失败", 500));
  }
});

/**
 * 发送验证码（阿里云 PNVS 或开发环境本地表）
 * body: { phone, scene?: 'login' | 'bind' }
 */
router.post("/sendCode", sendCodeLimiter, async (req, res) => {
  const { phone, scene = "login" } = req.body;
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error("手机号格式不正确", 400));
  }

  try {
    await assertSmsSendAllowed(phone);

    if (isPnvsEnabled()) {
      await sendSmsVerifyCode(phone, scene);
      await recordSmsSend(phone);
      const payload =
        process.env.NODE_ENV === "production" ? {} : { devHint: "生产环境由短信下发" };
      return res.json(success(payload, "验证码已发送"));
    }

    const code = await sendSmsCodeLocal(phone);
    await recordSmsSend(phone);
    const payload =
      process.env.NODE_ENV === "production" ? {} : { code };
    res.json(success(payload, "验证码已发送"));
  } catch (err) {
    return respondWithError(res, err, "发送失败", "发送验证码失败:");
  }
});

/**
 * 验证码登录（用户不存在则自动注册）
 */
router.post("/loginByCode", authLoginLimiter, async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json(error("请填写手机号和验证码", 400));
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error("手机号格式不正确", 400));
  }

  try {
    const codeValid = await verifySmsCode(phone, code);
    if (!codeValid) {
      return res.status(400).json(error("验证码错误或已过期", 400));
    }

    const user = await findOrCreateUserByPhone(phone);
    if (user.status !== 1) {
      return res.status(403).json(error("账号已被禁用", 403));
    }

    const token = sign({ id: user.id });
    res.json(
      success(
        {
          token,
          user: formatAuthUser(user),
        },
        "登录成功",
      ),
    );
  } catch (err) {
    if (err instanceof PnvsUserError) {
      return res.status(err.statusCode).json(error(err.message, err.statusCode));
    }
    console.error("验证码登录失败:", err);
    res.status(500).json(error("登录失败", 500));
  }
});

/**
 * 微信快捷登录（仅 openid，个人主体可用）
 */
router.post("/wechatOpenidLogin", authLoginLimiter, async (req, res) => {
  const { loginCode } = req.body;

  if (!loginCode) {
    return res.status(400).json(error("缺少微信登录凭证", 400));
  }

  try {
    const openid = await getOpenidByLoginCode(loginCode);
    const user = await findOrCreateUserByOpenid(openid);
    if (user.status !== 1) {
      return res.status(403).json(error("账号已被禁用", 403));
    }

    const token = sign({ id: user.id });
    res.json(
      success(
        {
          token,
          user: formatAuthUser(user),
        },
        "登录成功",
      ),
    );
  } catch (err) {
    console.error("微信登录失败:", err);
    res.status(500).json(error(err.message || "登录失败", 500));
  }
});

/**
 * 绑定微信 openid（需登录）
 * 用于：手机号登录后补 openid；openid 登录后补手机号。
 */
router.post("/bindOpenid", auth, async (req, res) => {
  const { loginCode } = req.body;

  if (!loginCode) {
    return res.status(400).json(error("缺少微信登录凭证", 400));
  }

  try {
    const users = await query(
      "SELECT * FROM users WHERE id = ? AND status = 1",
      [req.user.id],
    );
    if (users.length === 0) {
      return res.status(404).json(error("用户不存在", 404));
    }

    const user = users[0];
    const openid = await getOpenidByLoginCode(loginCode);
    if (!openid) {
      return res.status(400).json(error("获取 openid 失败", 400));
    }

    if (user.openid) {
      // 已绑定：如果是同一个 openid 则直接成功；否则需要走“换绑”流程（当前版本不做）
      if (user.openid === openid) {
        return res.json(success(formatAuthUser(user), "已绑定"));
      }
      return res.status(400).json(error("该微信号已绑定到其他账号", 400));
    }

    const existing = await query(
      "SELECT id FROM users WHERE openid = ? AND id != ?",
      [openid, user.id],
    );

    if (existing.length > 0) {
      // openid 已绑定到其他账号：并入到当前账号
      await mergeUsers(user.id, existing[0].id);
    }

    await query("UPDATE users SET openid = ?, updated_at = NOW() WHERE id = ?", [
      openid,
      user.id,
    ]);

    const updated = await query("SELECT * FROM users WHERE id = ?", [
      user.id,
    ]);
    res.json(success(formatAuthUser(updated[0]), "绑定成功"));
  } catch (err) {
    return respondWithError(res, err, "绑定失败", "绑定 openid 失败:");
  }
});

/**
 * 绑定手机号（需登录，微信用户补绑）
 */
router.post("/bindPhone", auth, async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json(error("请填写手机号和验证码", 400));
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json(error("手机号格式不正确", 400));
  }

  try {
    const users = await query(
      "SELECT * FROM users WHERE id = ? AND status = 1",
      [req.user.id],
    );
    if (users.length === 0) {
      return res.status(404).json(error("用户不存在", 404));
    }

    const user = users[0];
    if (user.phone) {
      return res.status(400).json(error("已绑定手机号", 400));
    }

    const codeValid = await verifySmsCode(phone, code);
    if (!codeValid) {
      return res.status(400).json(error("验证码错误或已过期", 400));
    }

    const existing = await query(
      "SELECT id FROM users WHERE phone = ? AND id != ?",
      [phone, user.id],
    );
    if (existing.length > 0) {
      // 手机号已绑定到其他账号：按产品需求做账号并入，避免“分裂成两个用户”
      await mergeUsers(user.id, existing[0].id);
    }

    await query("UPDATE users SET phone = ?, updated_at = NOW() WHERE id = ?", [
      phone,
      user.id,
    ]);

    const updated = await query("SELECT * FROM users WHERE id = ?", [
      user.id,
    ]);
    res.json(success(formatAuthUser(updated[0]), "绑定成功"));
  } catch (err) {
    return respondWithError(res, err, "绑定失败", "绑定手机号失败:");
  }
});

/**
 * @deprecated 个人主体不可用，请使用 wechatOpenidLogin
 */
router.post("/wechatLogin", async (req, res) => {
  res
    .status(410)
    .json(
      error("请使用微信快捷登录（openid），手机号请使用验证码登录", 410),
    );
});

/**
 * 退出登录
 */
router.post("/logout", async (req, res) => {
  res.json(success(null, "已退出登录"));
});

module.exports = router;
