export const useActionSheet = () => {
  return {
    show: () => {},
  }
}

export const usePicker = () => {
  return {
    show: () => {},
  }
}

export const useDatePicker = () => {
  return {
    show: () => {},
  }
}

export const useToast = () => {
  const success = (title: string) => {
    uni.showToast({
      title,
      icon: 'success',
      duration: 2000,
    })
  }

  const error = (title: string) => {
    uni.showToast({
      title,
      icon: 'error',
      duration: 2000,
    })
  }

  const loading = (title: string) => {
    uni.showToast({
      title,
      icon: 'loading',
      duration: 0,
    })
  }

  const info = (title: string) => {
    uni.showToast({
      title,
      icon: 'none',
      duration: 2000,
    })
  }

  const hide = () => {
    uni.hideToast()
  }

  return {
    success,
    error,
    loading,
    info,
    hide,
  }
}

export const useDialog = () => {
  const confirm = (options: { title?: string; content: string; confirmText?: string; cancelText?: string; confirmColor?: string; showCancel?: boolean; success?: (result: { confirm: boolean }) => void }) => {
    uni.showModal({
      title: options.title || '',
      content: options.content,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      confirmColor: options.confirmColor || '#71585C',
      showCancel: options.showCancel !== false,
      success: (res) => {
        options.success?.({ confirm: res.confirm })
      },
    })
  }

  const alert = (options: string | { title?: string; content: string; confirmText?: string; confirmColor?: string; success?: (result: { confirm: boolean }) => void }) => {
    if (typeof options === 'string') {
      uni.showModal({
        content: options,
        showCancel: false,
      })
    } else {
      uni.showModal({
        title: options.title || '',
        content: options.content,
        confirmText: options.confirmText || '知道了',
        confirmColor: options.confirmColor || '#71585C',
        showCancel: false,
        success: (res) => {
          options.success?.({ confirm: res.confirm })
        },
      })
    }
  }

  return {
    confirm,
    alert,
  }
}

export const useComponents = () => {
  return {
    picker: usePicker(),
    datePicker: useDatePicker(),
    actionSheet: useActionSheet(),
    toast: useToast(),
    dialog: useDialog(),
  }
}
