const { error } = require("./response");

/**
 * 阿里云 PNVS / OpenAPI 错误转用户可读文案（不暴露 requestId、isv 码等）
 */
class PnvsUserError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "PnvsUserError";
    this.statusCode = statusCode;
  }
}

function extractRawMessage(err) {
  if (!err) return "";
  const parts = [
    err.message,
    err.data?.Message,
    err.data?.message,
    err.code,
    typeof err === "string" ? err : "",
  ].filter(Boolean);
  return parts.join(" ");
}

function stripTechnicalNoise(text) {
  return String(text)
    .replace(/request\s*id\s*[:：]?\s*[\w-]+/gi, "")
    .replace(/\bisv\.\w+/gi, "")
    .replace(/code\s*[:：]?\s*\d+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * @returns {PnvsUserError}
 */
function toPnvsUserError(err, scene = "verify") {
  const raw = stripTechnicalNoise(extractRawMessage(err));
  const lower = raw.toLowerCase();

  if (
    /validatefail|验证失败|verifycode|verify.*fail|验证码.*错|code.*not.*match/i.test(
      raw,
    )
  ) {
    return new PnvsUserError("验证码错误或已过期", 400);
  }

  if (
    /mobile.*illegal|invalid.*phone|手机号.*非法|号码.*不正确/i.test(raw)
  ) {
    return new PnvsUserError("手机号格式不正确", 400);
  }

  if (
    /business_limit|minute|hour|day.*limit|发送.*频繁|too many|throttl|限流|流控|interval/i.test(
      lower + raw,
    )
  ) {
    return new PnvsUserError(
      scene === "send" ? "发送过于频繁，请稍后再试" : "操作过于频繁，请稍后再试",
      429,
    );
  }

  if (/invalidsignname|签名|sign.*name/i.test(raw)) {
    return new PnvsUserError("短信服务暂不可用，请稍后再试", 503);
  }

  if (/invalidtemplate|模板|template/i.test(raw)) {
    return new PnvsUserError("短信服务暂不可用，请稍后再试", 503);
  }

  if (/amount|余额|欠费|arrear/i.test(raw)) {
    return new PnvsUserError("短信服务暂不可用，请稍后再试", 503);
  }

  if (/permission|denied|authorized|accesskey|鉴权|无权/i.test(raw)) {
    return new PnvsUserError("短信服务暂不可用，请稍后再试", 503);
  }

  if (scene === "send") {
    return new PnvsUserError("验证码发送失败，请稍后再试", 503);
  }

  return new PnvsUserError("验证码错误或已过期", 400);
}

/**
 * 路由层统一响应：业务错误 4xx，仅未知异常 500
 */
function respondWithError(res, err, fallbackMessage, logLabel) {
  console.error(logLabel, err);

  if (err instanceof PnvsUserError) {
    return res.status(err.statusCode).json(error(err.message, err.statusCode));
  }

  const pnvsLike =
    /isv\.|ValidateFail|dypnsapi|aliyun|OpenAPI|短信|verify/i.test(
      extractRawMessage(err),
    );
  if (pnvsLike) {
    const friendly = toPnvsUserError(err);
    return res
      .status(friendly.statusCode)
      .json(error(friendly.message, friendly.statusCode));
  }

  return res.status(500).json(error(fallbackMessage, 500));
}

module.exports = {
  PnvsUserError,
  toPnvsUserError,
  respondWithError,
};
