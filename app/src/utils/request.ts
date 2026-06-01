import type { UniApp } from "@dcloudio/types";
import { getApiOrigin } from "./media";
import {
  AuthRequiredError,
  UNAUTHORIZED_MESSAGE,
  handleUnauthorized,
  handleWriteUnauthorized,
  isAuthRequiredResponse,
} from "./authRedirect";

const baseURL = `${getApiOrigin()}/api`;

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

function buildUrl(path: string, data?: Record<string, unknown>): string {
  const url = `${baseURL}${path}`;
  if (!data || Object.keys(data).length === 0) return url;
  const qs = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return qs ? `${url}?${qs}` : url;
}

function rejectUnauthorized<T>(
  reject: (reason?: unknown) => void,
  method: string,
  data?: ResponseData<T>,
) {
  const err = new AuthRequiredError(UNAUTHORIZED_MESSAGE);
  // 仅写操作自动引导登录；GET 等读请求静默失败，由页面自行展示空态
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

export async function request<T = unknown>(
  options: RequestOptions,
): Promise<ResponseData<T>> {
  const token = uni.getStorageSync("token");
  const header: Record<string, string> = { ...options.header };
  if (token) header.Authorization = `Bearer ${token}`;

  return new Promise((resolve, reject) => {
    if (options.filePath) {
      uni.uploadFile({
        url: buildUrl(options.url),
        filePath: options.filePath,
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
      return;
    }

    const method = options.method || "GET";
    const url =
      method === "GET"
        ? buildUrl(options.url, options.data)
        : buildUrl(options.url);

    uni.request({
      url,
      method,
      data: method === "GET" ? undefined : options.data,
      header: {
        "Content-Type": "application/json",
        ...header,
      },
      timeout: 15000,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        const data = res.data as ResponseData<T>;
        if (
          isAuthRequiredResponse({
            statusCode: res.statusCode,
            code: data?.code,
            data: data?.data,
          })
        ) {
          rejectUnauthorized(reject, method, data);
          return;
        }
        if (data && data.success) resolve(data);
        else
          reject(
            new Error(
              (data && data.message) || `请求失败(${res.statusCode})`,
            ),
          );
      },
      fail: (err) => reject(new Error(err.errMsg || "网络请求失败")),
    });
  });
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
export { baseURL };
