import {
  showDialogOverlay,
  showActionSheetOverlay,
} from "@/composables/useOverlay";

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
  const success = (title: string) => {
    uni.showToast({
      title,
      icon: "success",
      duration: 2000,
    });
  };

  const error = (title: string) => {
    uni.showToast({
      title,
      icon: "error",
      duration: 2000,
    });
  };

  const loading = (title: string) => {
    uni.showToast({
      title,
      icon: "loading",
      duration: 0,
    });
  };

  const info = (title: string) => {
    uni.showToast({
      title,
      icon: "none",
      duration: 2000,
    });
  };

  const hide = () => {
    uni.hideToast();
  };

  return {
    success,
    error,
    loading,
    info,
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

export const useComponents = () => {
  return {
    picker: usePicker(),
    datePicker: useDatePicker(),
    actionSheet: useActionSheet(),
    toast: useToast(),
    dialog: useDialog(),
  };
};
