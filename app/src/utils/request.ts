import type { UniApp } from "@dcloudio/types";
import { getApiOrigin } from "./media";
import {
  ensureNetworkWarmup,
  invalidateNetworkWarmup,
} from "./networkWarmup";
import { runWithRequestSlot } from "./requestQueue";
import {
  AuthRequiredError,
  UNAUTHORIZED_MESSAGE,
  handleUnauthorized,
  handleWriteUnauthorized,
  isAuthRequiredResponse,
} from "./authRedirect";

const baseURL = `${getApiOrigin()}/api`;

const GET_MAX_ATTEMPTS = 3;
const WRITE_MAX_ATTEMPTS = 2;
const RETRY_BASE_DELAY_MS = 600;
const POST_WARMUP_DELAY_MS = 400;

interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, unknown>;
  header?: Record<string, string>;
  filePath?: string;
  name?: string;
}

export interface ResponseData<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  code?: number;
  timestamp?: number;
}

const NO_CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
};

function buildUrl(path: string, data?: Record<string, unknown>): string {
  const url = `${baseURL}${path}`;
  const payload = {
    ...data,
    // 避免微信开发者工具/真机把 403 HTML 缓存成 disk cache
    _nc: Date.now(),
  };
  const qs = Object.entries(payload)
    .filter(([, v]) => v !== undefined && v !== null && String(v) !== "")
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return qs ? `${url}?${qs}` : url;
}

function isNginxForbiddenHtml(raw: string): boolean {
  return raw.includes("403 Forbidden") && raw.includes("<html>");
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function rejectUnauthorized<T>(
  reject: (reason?: unknown) => void,
  method: string,
  data?: ResponseData<T>,
) {
  const err = new AuthRequiredError(UNAUTHORIZED_MESSAGE);
  if (method !== "GET") {
    handleWriteUnauthorized(UNAUTHORIZED_MESSAGE);
  }
  reject(err);
}

function parseResponseBody<T>(raw: string): ResponseData<T> | null {
  try {
    return JSON.parse(raw) as ResponseData<T>;
  } catch {
    return null;
  }
}

function isRetryableNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("fail") ||
    msg.includes("timeout") ||
    msg.includes("network") ||
    msg.includes("ssl") ||
    msg.includes("tls") ||
    msg.includes("连接") ||
    msg.includes("断开") ||
    msg.includes("403") ||
    msg.includes("被拒绝")
  );
}

function sendHttpRequest<T>(
  options: RequestOptions,
  method: string,
  header: Record<string, string>,
): Promise<ResponseData<T>> {
  const url =
    method === "GET"
      ? buildUrl(options.url, options.data)
      : buildUrl(options.url);

  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: method as UniApp.RequestOptions["method"],
      data: method === "GET" ? undefined : options.data,
      header: {
        "Content-Type": "application/json",
        ...NO_CACHE_HEADERS,
        ...header,
      },
      timeout: 15000,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        const raw =
          typeof res.data === "string"
            ? res.data
            : res.data != null
              ? JSON.stringify(res.data)
              : "";

        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        if (isNginxForbiddenHtml(raw)) {
          reject(new Error("服务被拒绝(403)，请稍后重试"));
          return;
        }

        const data = parseResponseBody<T>(raw) as ResponseData<T> | null;
        if (
          isAuthRequiredResponse({
            statusCode: res.statusCode,
            code: data?.code,
            data: data?.data,
          })
        ) {
          rejectUnauthorized(reject, method, data || undefined);
          return;
        }
        if (data && data.success) resolve(data);
        else
          reject(
            new Error(
              data?.message || `请求失败(${res.statusCode})`,
            ),
          );
      },
      fail: (err) => reject(new Error(err.errMsg || "网络请求失败")),
    });
  });
}

function sendUploadRequest<T>(
  options: RequestOptions,
  header: Record<string, string>,
): Promise<ResponseData<T>> {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: buildUrl(options.url),
      filePath: options.filePath!,
      name: options.name || "file",
      header,
      formData: options.data as Record<string, string>,
      success: (res) => {
        const data = parseResponseBody<T>(res.data as string);
        if (
          isAuthRequiredResponse({
            statusCode: res.statusCode,
            code: data?.code,
            data: data?.data,
          })
        ) {
          rejectUnauthorized(reject, "UPLOAD", data || undefined);
          return;
        }
        if (data?.success) {
          resolve(data);
          return;
        }
        reject(new Error(data?.message || "文件上传失败"));
      },
      fail: (err) => reject(new Error(err.errMsg || "文件上传失败")),
    });
  });
}

async function requestWithRetry<T>(
  options: RequestOptions,
  method: string,
  header: Record<string, string>,
): Promise<ResponseData<T>> {
  const maxAttempts = method === "GET" ? GET_MAX_ATTEMPTS : WRITE_MAX_ATTEMPTS;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      if (options.filePath) {
        return await runWithRequestSlot(() =>
          sendUploadRequest<T>(options, header),
        );
      }
      return await runWithRequestSlot(() =>
        sendHttpRequest<T>(options, method, header),
      );
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const canRetry =
        isRetryableNetworkError(lastError) && attempt < maxAttempts - 1;
      if (!canRetry) throw lastError;

      invalidateNetworkWarmup();
      await ensureNetworkWarmup();
      await delay(RETRY_BASE_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError || new Error("网络请求失败");
}

export async function request<T = unknown>(
  options: RequestOptions,
): Promise<ResponseData<T>> {
  await ensureNetworkWarmup();

  const token = uni.getStorageSync("token");
  const header: Record<string, string> = { ...options.header };
  if (token) header.Authorization = `Bearer ${token}`;

  const method = options.method || "GET";
  return requestWithRetry<T>(options, method, header);
}

export function get<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
) {
  return request<T>({ url, method: "GET", data });
}

export function post<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  options?: Omit<RequestOptions, "url" | "method" | "data">,
) {
  return request<T>({ url, method: "POST", data, ...options });
}

export function put<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
) {
  return request<T>({ url, method: "PUT", data });
}

export function del<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
) {
  return request<T>({ url, method: "DELETE", data });
}

export {
  AuthRequiredError,
  showRequestError,
  isAuthRequiredError,
  promptLogin,
} from "./authRedirect";
export { showToast, hideToast } from "./toast";
export { baseURL };
