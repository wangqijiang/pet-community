import { ref, reactive } from 'vue'

interface PickerItem {
  label: string
  value?: string | number
  alias?: string
  disabled?: boolean
  children?: PickerItem[]
}

interface PickerOptions {
  title?: string
  data: PickerItem[][]
  defaultIndex?: number[]
  cancelText?: string
  confirmText?: string
  success?: (result: { value: (string | number)[], label: string[] }) => void
  fail?: (error: any) => void
}

interface DatePickerOptions {
  title?: string
  value?: string
  startDate?: string
  endDate?: string
  cancelText?: string
  confirmText?: string
  success?: (value: string) => void
  fail?: (error: any) => void
}

interface ActionSheetOptions {
  title?: string
  actions: Array<{
    name: string
    subname?: string
    icon?: string
    iconType?: 'svg' | 'image'
    disabled?: boolean
    type?: 'default' | 'danger'
  }>
  cancelText?: string
  success?: (result: { tapIndex: number }) => void
  fail?: (error: any) => void
}

interface ToastOptions {
  title: string
  icon?: 'success' | 'error' | 'loading' | 'none'
  duration?: number
  mask?: boolean
}

interface DialogOptions {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  showCancel?: boolean
  success?: (result: { confirm: boolean }) => void
}

export const usePicker = () => {
  const visible = ref(false)
  const options = reactive<PickerOptions>({
    title: '请选择',
    data: [],
    defaultIndex: [],
    cancelText: '取消',
    confirmText: '确定',
  })

  const show = (opts: PickerOptions) => {
    Object.assign(options, opts)
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  const onConfirm = (callback: PickerOptions['success']) => {
    options.success = callback
  }

  const onCancel = (callback: () => void) => {
    options.cancelText = callback as any
  }

  return {
    visible,
    options,
    show,
    hide,
    onConfirm,
    onCancel,
  }
}

export const useDatePicker = () => {
  const visible = ref(false)
  const options = reactive<DatePickerOptions>({
    title: '选择日期',
    value: '',
    startDate: '1900-01-01',
    endDate: '2100-12-31',
    cancelText: '取消',
    confirmText: '确定',
  })

  const show = (opts: DatePickerOptions) => {
    Object.assign(options, opts)
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  return {
    visible,
    options,
    show,
    hide,
  }
}

export const useActionSheet = () => {
  const visible = ref(false)
  const options = reactive<ActionSheetOptions>({
    title: '',
    actions: [],
    cancelText: '取消',
  })

  const show = (opts: ActionSheetOptions) => {
    Object.assign(options, opts)
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  return {
    visible,
    options,
    show,
    hide,
  }
}

export const useToast = () => {
  const success = (options: string | ToastOptions) => {
    if (typeof options === 'string') {
      uni.showToast({
        title: options,
        icon: 'success',
        duration: 2000,
      })
    } else {
      uni.showToast({
        title: options.title,
        icon: options.icon || 'success',
        duration: options.duration || 2000,
        mask: options.mask || false,
      })
    }
  }

  const error = (options: string | ToastOptions) => {
    if (typeof options === 'string') {
      uni.showToast({
        title: options,
        icon: 'error',
        duration: 2000,
      })
    } else {
      uni.showToast({
        title: options.title,
        icon: 'error',
        duration: options.duration || 2000,
        mask: options.mask || false,
      })
    }
  }

  const loading = (options: string | ToastOptions) => {
    if (typeof options === 'string') {
      uni.showToast({
        title: options,
        icon: 'loading',
        duration: 2000,
      })
    } else {
      uni.showToast({
        title: options.title,
        icon: 'loading',
        duration: options.duration || 2000,
        mask: options.mask || false,
      })
    }
  }

  const info = (options: string | ToastOptions) => {
    if (typeof options === 'string') {
      uni.showToast({
        title: options,
        icon: 'none',
        duration: 2000,
      })
    } else {
      uni.showToast({
        title: options.title,
        icon: 'none',
        duration: options.duration || 2000,
        mask: options.mask || false,
      })
    }
  }

  return {
    success,
    error,
    loading,
    info,
  }
}

export const useDialog = () => {
  const confirm = (options: DialogOptions) => {
    const opts = {
      title: options.title || '',
      content: options.content,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      confirmColor: options.confirmColor || '#71585C',
      showCancel: options.showCancel !== false,
      success: options.success,
    }

    uni.showModal(opts)
  }

  const alert = (options: string | DialogOptions) => {
    if (typeof options === 'string') {
      uni.showModal({
        title: '',
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
        success: options.success,
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
