import { getApiOrigin } from "./media";

const WARMUP_PATH = "/api/health";
const WARMUP_TIMEOUT_MS = 8000;
const WARMUP_MAX_ATTEMPTS = 3;
const WARMUP_TTL_MS = 60_000;
const BACKGROUND_STALE_MS = 120_000;

let warmed = false;
let warmupPromise: Promise<boolean> | null = null;
let lastSuccessAt = 0;
let hideAt = 0;

const POST_WARMUP_DELAY_MS = 400;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function pingHealth(): Promise<boolean> {
  const url = `${getApiOrigin()}${WARMUP_PATH}`;
  return new Promise((resolve) => {
    uni.request({
      url: `${url}${url.includes("?") ? "&" : "?"}_nc=${Date.now()}`,
      method: "GET",
      header: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      timeout: WARMUP_TIMEOUT_MS,
      success: (res) => {
        const raw = typeof res.data === "string" ? res.data : "";
        if (raw.includes("403 Forbidden") && raw.includes("<html>")) {
          resolve(false);
          return;
        }
        resolve(res.statusCode >= 200 && res.statusCode < 300);
      },
      fail: () => resolve(false),
    });
  });
}

async function runWarmup(): Promise<boolean> {
  for (let attempt = 0; attempt < WARMUP_MAX_ATTEMPTS; attempt += 1) {
    const ok = await pingHealth();
    if (ok) {
      lastSuccessAt = Date.now();
      return true;
    }
    if (attempt < WARMUP_MAX_ATTEMPTS - 1) {
      await delay(400 * (attempt + 1));
    }
  }
  return false;
}

/** 预热 HTTPS 连接（空心跳），提前完成 TLS 握手 */
export function warmupNetwork(force = false): Promise<boolean> {
  const now = Date.now();
  if (
    !force &&
    warmed &&
    lastSuccessAt > 0 &&
    now - lastSuccessAt < WARMUP_TTL_MS
  ) {
    return Promise.resolve(true);
  }

  if (warmupPromise) return warmupPromise;

  warmupPromise = runWarmup()
    .then((ok) => {
      warmed = true;
      if (ok) lastSuccessAt = Date.now();
      return ok;
    })
    .finally(() => {
      warmupPromise = null;
    });

  return warmupPromise;
}

/** 业务请求前等待预热完成（失败也不永久阻塞） */
export async function ensureNetworkWarmup(): Promise<void> {
  await warmupNetwork();
  await delay(POST_WARMUP_DELAY_MS);
}

/** 网络请求失败时标记会话过期，下次请求会重新预热 */
export function invalidateNetworkWarmup() {
  warmed = false;
  lastSuccessAt = 0;
}

/** 切后台：记录时间，短时不强制重握手 */
export function onAppHide() {
  hideAt = Date.now();
}

/** 回前台：后台较久才强制重新预热 */
export function onAppShow(): Promise<boolean> {
  const bgMs = hideAt > 0 ? Date.now() - hideAt : 0;
  if (bgMs > BACKGROUND_STALE_MS) {
    invalidateNetworkWarmup();
    return warmupNetwork(true);
  }
  return warmupNetwork();
}
