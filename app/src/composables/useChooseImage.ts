import { ref } from "vue";

export interface ChooseImagePickOptions {
  /** 最多可选张数，默认 1 */
  count?: number;
  /** 选图成功回调，可 async */
  onPick: (tempFilePaths: string[]) => void | Promise<void>;
}

/**
 * 统一封装 uni.chooseImage（压缩图、相册/相机）
 */
export function useChooseImage() {
  const choosing = ref(false);

  const chooseImages = (options: ChooseImagePickOptions) => {
    if (choosing.value) return;
    const count = Math.min(9, Math.max(1, options.count ?? 1));
    uni.vibrateShort({ type: "light" });
    choosing.value = true;
    uni.chooseImage({
      count,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: async (res) => {
        try {
          const paths = Array.isArray(res.tempFilePaths)
            ? res.tempFilePaths
            : [res.tempFilePaths];
          await options.onPick(paths);
        } finally {
          choosing.value = false;
        }
      },
      fail: () => {
        choosing.value = false;
      },
    });
  };

  const chooseSingle = (onPick: (path: string) => void | Promise<void>) => {
    chooseImages({
      count: 1,
      onPick: async (paths) => {
        if (paths[0]) await onPick(paths[0]);
      },
    });
  };

  return { choosing, chooseImages, chooseSingle };
}
