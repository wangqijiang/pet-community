import type { UniApp } from "@dcloudio/types";

const getBaseURL = () => {
  const envBaseURL = import.meta.env.VITE_API_BASE_URL;
  if (envBaseURL) {
    return envBaseURL;
  }

  const localIP = "192.168.0.11";
  const port = "3000";

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `http://${localIP}:${port}/api`;
    }
    return `http://${hostname}:${port}/api`;
  }

  return `http://${localIP}:${port}/api`;
};

const baseURL = getBaseURL();

interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, unknown>;
  header?: Record<string, string>;
  filePath?: string;
  name?: string;
}

interface ResponseData<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  code?: number;
  timestamp?: number;
}

export async function request<T = unknown>(
  options: RequestOptions,
): Promise<ResponseData<T>> {
  const token = uni.getStorageSync("token");

  const header: Record<string, string> = {
    ...options.header,
  };

  if (token) {
    header["Authorization"] = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    if (options.filePath) {
      uni.uploadFile({
        url: `${baseURL}${options.url}`,
        filePath: options.filePath,
        name: options.name || "file",
        header,
        formData: options.data as Record<string, string>,
        success: (res) => {
          try {
            const data = JSON.parse(res.data) as ResponseData<T>;
            if (data.success) {
              resolve(data);
            } else {
              reject(new Error(data.message));
            }
          } catch {
            reject(new Error("解析响应失败"));
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || "文件上传失败"));
        },
      });
    } else {
      uni.request({
        url: `${baseURL}${options.url}`,
        method: options.method || "GET",
        data: options.data,
        header: {
          "Content-Type": "application/json",
          ...header,
        },
        timeout: 10000,
        success: (res: UniApp.RequestSuccessCallbackResult) => {
          const data = res.data as ResponseData<T>;
          if (data.success) {
            resolve(data);
          } else {
            reject(new Error(data.message));
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || "网络请求失败"));
        },
      });
    }
  });
}

export function get<T = unknown>(url: string, data?: Record<string, unknown>) {
  return request<T>({ url, method: "GET", data });
}

export function post<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  options?: Omit<RequestOptions, "url" | "method" | "data">,
) {
  return request<T>({ url, method: "POST", data, ...options });
}

export function put<T = unknown>(url: string, data?: Record<string, unknown>) {
  return request<T>({ url, method: "PUT", data });
}

export function del<T = unknown>(url: string, data?: Record<string, unknown>) {
  return request<T>({ url, method: "DELETE", data });
}
