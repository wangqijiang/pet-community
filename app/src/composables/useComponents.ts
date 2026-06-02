import {
  showDialogOverlay,
  showActionSheetOverlay,
} from "@/composables/useOverlay";
import { showToast, hideToast } from "@/utils/toast";

export const useActionSheet = () => {
  const show = (options: {
    title?: string;
    itemList: string[];
    success?: (res: { tapIndex: number }) => void;
    fail?: () => void;
  }) => {
    showActionSheetOverlay({
      title: options.title,
      itemList: options.itemList,
    })
      .then((res) => options.success?.(res))
      .catch(() => options.fail?.());
  };

  return { show };
};

export const usePicker = () => {
  return {
    show: () => {},
  };
};

export const useDatePicker = () => {
  return {
    show: () => {},
  };
};

export const useToast = () => {
  const show = (
    message: string,
    type: "success" | "warning" | "error" = "success",
  ) => {
    showToast({ title: message, icon: type === "error" ? "error" : type === "warning" ? "none" : "success" });
  };

  const success = (message: string) => {
    showToast({ title: message, icon: "success" });
  };

  const error = (message: string) => {
    showToast({ title: message, icon: "error" });
  };

  const warning = (message: string) => {
    showToast({ title: message, icon: "none" });
  };

  const info = (message: string) => {
    showToast({ title: message, icon: "none" });
  };

  const loading = (title: string) => {
    uni.showToast({
      title,
      icon: "loading",
      duration: 0,
    });
  };

  const hide = () => {
    hideToast();
  };

  return {
    show,
    success,
    error,
    warning,
    info,
    loading,
    hide,
  };
};

export interface DialogConfirmOptions {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  showCancel?: boolean;
  success?: (result: { confirm: boolean }) => void;
}

export interface DialogAlertOptions {
  title?: string;
  content: string;
  confirmText?: string;
  confirmColor?: string;
  success?: (result: { confirm: boolean }) => void;
}

export const useDialog = () => {
  const confirm = (options: DialogConfirmOptions) => {
    showDialogOverlay({
      title: options.title,
      content: options.content,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      showCancel: options.showCancel !== false,
    }).then((res) => options.success?.(res));
  };

  const alert = (
    options: string | DialogAlertOptions,
  ) => {
    if (typeof options === "string") {
      showDialogOverlay({ content: options, showCancel: false });
      return;
    }
    showDialogOverlay({
      title: options.title,
      content: options.content,
      confirmText: options.confirmText,
      showCancel: false,
    }).then((res) => options.success?.(res));
  };

  return {
    confirm,
    alert,
  };
};

export { showToast, hideToast } from "@/utils/toast";

export const useComponents = () => {
  return {
    picker: usePicker(),
    datePicker: useDatePicker(),
    actionSheet: useActionSheet(),
    toast: useToast(),
    dialog: useDialog(),
  };
};
