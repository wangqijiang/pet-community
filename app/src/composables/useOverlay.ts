import { reactive } from "vue";

export type TipToastType = "success" | "warning" | "error";

export interface TipToastState {
  visible: boolean;
  type: TipToastType;
  message: string;
}

export interface DialogOverlayState {
  visible: boolean;
  title: string;
  content: string;
  type: "alert" | "confirm";
  confirmText: string;
  cancelText: string;
  showCancel: boolean;
}

export interface ActionSheetOverlayState {
  visible: boolean;
  title: string;
  items: string[];
}

const toastState = reactive<TipToastState>({
  visible: false,
  type: "success",
  message: "",
});

const dialogState = reactive<DialogOverlayState>({
  visible: false,
  title: "",
  content: "",
  type: "confirm",
  confirmText: "确定",
  cancelText: "取消",
  showCancel: true,
});

const sheetState = reactive<ActionSheetOverlayState>({
  visible: false,
  title: "请选择",
  items: [],
});

let dialogResolve: ((confirm: boolean) => void) | null = null;
let sheetResolve: ((index: number) => void) | null = null;
let sheetReject: (() => void) | null = null;
let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function useToastState() {
  return toastState;
}

export function useDialogState() {
  return dialogState;
}

export function useActionSheetState() {
  return sheetState;
}

export function showDialogOverlay(options: {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}): Promise<{ confirm: boolean }> {
  return new Promise((resolve) => {
    const showCancel = options.showCancel !== false;
    dialogState.title = options.title || "";
    dialogState.content = options.content;
    dialogState.type = showCancel ? "confirm" : "alert";
    dialogState.confirmText =
      options.confirmText || (showCancel ? "确定" : "知道了");
    dialogState.cancelText = options.cancelText || "取消";
    dialogState.showCancel = showCancel;
    dialogState.visible = true;
    dialogResolve = resolve;
  });
}

export function resolveDialogOverlay(confirm: boolean) {
  dialogState.visible = false;
  dialogResolve?.({ confirm });
  dialogResolve = null;
}

export function showActionSheetOverlay(options: {
  title?: string;
  itemList: string[];
}): Promise<{ tapIndex: number }> {
  return new Promise((resolve, reject) => {
    sheetState.title = options.title || "请选择";
    sheetState.items = options.itemList;
    sheetState.visible = true;
    sheetResolve = (index) => resolve({ tapIndex: index });
    sheetReject = () => reject(new Error("cancel"));
  });
}

export function resolveActionSheetOverlay(index: number) {
  sheetState.visible = false;
  sheetResolve?.(index);
  sheetResolve = null;
  sheetReject = null;
}

export function cancelActionSheetOverlay() {
  sheetState.visible = false;
  sheetResolve = null;
  sheetReject?.();
  sheetReject = null;
}

export function hideTipToast() {
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  toastState.visible = false;
}

export function showTipToast(options: {
  type?: TipToastType;
  message: string;
  duration?: number;
}) {
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  toastState.type = options.type || "success";
  toastState.message = options.message;
  toastState.visible = true;

  toastTimer = setTimeout(() => {
    hideTipToast();
  }, options.duration ?? 2000);
}
