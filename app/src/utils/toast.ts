import {
  showTipToast,
  hideTipToast,
  type TipToastType,
} from "@/composables/useOverlay";

type ToastIcon = "success" | "error" | "none" | "loading";

const ICON_TYPE_MAP: Record<Exclude<ToastIcon, "loading">, TipToastType> = {
  success: "success",
  error: "error",
  none: "warning",
};

export interface ToastOptions {
  title: string;
  icon?: ToastIcon;
  duration?: number;
}

/** 全局轻提示（替代 uni.showToast） */
export function showToast(options: string | ToastOptions) {
  if (typeof options === "string") {
    showTipToast({ message: options, type: "success" });
    return;
  }

  const { title, icon = "none", duration } = options;

  if (icon === "loading") {
    uni.showToast({ title, icon: "loading", duration: 0 });
    return;
  }

  showTipToast({
    message: title,
    type: ICON_TYPE_MAP[icon],
    duration,
  });
}

export function hideToast() {
  hideTipToast();
  uni.hideToast();
}

export { showTipToast, hideTipToast, type TipToastType };
