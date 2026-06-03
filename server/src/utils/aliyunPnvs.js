const Dypnsapi20170525 = require("@alicloud/dypnsapi20170525").default;
const {
  SendSmsVerifyCodeRequest,
  CheckSmsVerifyCodeRequest,
} = require("@alicloud/dypnsapi20170525");
const { Config } = require("@alicloud/openapi-client");
const { PnvsUserError, toPnvsUserError } = require("./pnvsErrors");

let cachedClient = null;

function isPnvsEnabled() {
  return (
    process.env.PNVS_ENABLED === "1" &&
    !!process.env.ALIYUN_ACCESS_KEY_ID &&
    !!process.env.ALIYUN_ACCESS_KEY_SECRET &&
    !!process.env.PNVS_SIGN_NAME
  );
}

function getClient() {
  if (cachedClient) return cachedClient;
  const config = new Config({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    endpoint: process.env.PNVS_ENDPOINT || "dypnsapi.aliyuncs.com",
  });
  cachedClient = new Dypnsapi20170525(config);
  return cachedClient;
}

function getTemplateCode(scene) {
  if (scene === "bind") {
    return process.env.PNVS_TEMPLATE_CODE_BIND || "100004";
  }
  return process.env.PNVS_TEMPLATE_CODE_LOGIN || "100001";
}

function assertSmsResponse(body, scene) {
  if (!body) {
    throw toPnvsUserError(new Error("empty response"), scene);
  }
  if (body.success === true || body.code === "OK") {
    return;
  }
  throw toPnvsUserError(
    new Error(body.message || body.code || "sms api error"),
    scene,
  );
}

/**
 * 发送短信验证码（阿里云 PNVS）
 * @param {string} phone 11 位手机号
 * @param {'login'|'bind'} scene
 */
async function sendSmsVerifyCode(phone, scene = "login") {
  try {
    const client = getClient();
    const templateCode = getTemplateCode(scene);
    const templateParam =
      process.env.PNVS_TEMPLATE_PARAM ||
      JSON.stringify({ code: "##code##", min: "5" });

    const request = new SendSmsVerifyCodeRequest({
      phoneNumber: phone,
      signName: process.env.PNVS_SIGN_NAME,
      templateCode,
      templateParam,
      codeLength: Number(process.env.PNVS_CODE_LENGTH || 4),
      validTime: Number(process.env.PNVS_VALID_TIME || 300),
      codeType: 1,
      duplicatePolicy: 1,
      interval: Number(process.env.PNVS_SEND_INTERVAL || 60),
      countryCode: "86",
    });
    const response = await client.sendSmsVerifyCode(request);
    assertSmsResponse(response?.body, "send");
    return response.body;
  } catch (err) {
    if (err instanceof PnvsUserError) throw err;
    throw toPnvsUserError(err, "send");
  }
}

/**
 * 校验短信验证码（阿里云 PNVS）
 * @throws {PnvsUserError}
 */
async function checkSmsVerifyCode(phone, code) {
  try {
    const client = getClient();
    const request = new CheckSmsVerifyCodeRequest({
      phoneNumber: phone,
      verifyCode: code,
      countryCode: "86",
    });
    const response = await client.checkSmsVerifyCode(request);
    const body = response?.body;

    assertSmsResponse(body, "verify");

    const verifyResult = body?.model?.verifyResult;
    if (verifyResult === "PASS") {
      return true;
    }
    throw new PnvsUserError("验证码错误或已过期", 400);
  } catch (err) {
    if (err instanceof PnvsUserError) throw err;
    throw toPnvsUserError(err, "verify");
  }
}

module.exports = {
  isPnvsEnabled,
  sendSmsVerifyCode,
  checkSmsVerifyCode,
};
