import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  unref,
  watch,
  type MaybeRef,
  type WatchSource,
} from "vue";

export interface LayoutMetrics {
  windowHeight: number;
  statusBarHeight: number;
  navContentHeight: number;
  navbarHeight: number;
  tabContentHeight: number;
  tabbarHeight: number;
  safeBottom: number;
}

let cachedMetrics: LayoutMetrics | null = null;

/** 获取并缓存系统布局尺寸（px） */
export function getLayoutMetrics(): LayoutMetrics {
  if (cachedMetrics) return cachedMetrics;

  const sys = uni.getSystemInfoSync();
  const statusBarHeight = sys.statusBarHeight || 20;
  const safeBottom =
    sys.safeAreaInsets?.bottom ??
    (sys.safeArea ? Math.max(0, sys.screenHeight - sys.safeArea.bottom) : 0);

  const navContentHeight = uni.upx2px(88);
  const tabContentHeight = uni.upx2px(120);
  const navbarHeight = statusBarHeight + navContentHeight;
  const tabbarHeight = tabContentHeight + safeBottom;

  cachedMetrics = {
    windowHeight: sys.windowHeight,
    statusBarHeight,
    navContentHeight,
    navbarHeight,
    tabContentHeight,
    tabbarHeight,
    safeBottom,
  };
  return cachedMetrics;
}

export interface LayoutOptions {
  /** 是否包含底部 TabBar */
  tabBar?: boolean;
  /** 导航栏下方额外固定区域高度（px），如分类 Tab */
  headerHeight?: number;
  /** 底部额外固定区域（px），如聊天输入框 */
  footerHeight?: number;
}

export function useLayout(options: MaybeRef<LayoutOptions> = {}) {
  const metrics = ref(getLayoutMetrics());

  const contentHeight = computed(() => {
    const m = metrics.value;
    const { headerHeight = 0, footerHeight = 0, tabBar = false } = unref(options);
    let h = m.windowHeight - m.navbarHeight - headerHeight - footerHeight;
    if (tabBar) h -= m.tabbarHeight;
    return Math.max(0, Math.floor(h));
  });

  const contentStyle = computed(() => ({
    height: `${contentHeight.value}px`,
  }));

  const navbarSpacerStyle = computed(() => ({
    height: `${metrics.value.navbarHeight}px`,
  }));

  const tabbarSpacerStyle = computed(() => ({
    height: `${metrics.value.tabbarHeight}px`,
  }));

  const pageStyle = computed(() => ({
    height: `${metrics.value.windowHeight}px`,
  }));

  return {
    metrics,
    contentHeight,
    contentStyle,
    navbarSpacerStyle,
    tabbarSpacerStyle,
    pageStyle,
  };
}

/**
 * 测量底部固定栏高度，供 PageLayout 的 footer-height 使用。
 * @param selector 固定栏元素 id 或 class 选择器
 * @param estimateRpx 初始估算高度（rpx，不含 safeBottom）
 */
export function useFixedFooterHeight(
  selector: string,
  estimateRpx: number,
  watchSources: WatchSource<unknown>[] = [],
) {
  const instance = getCurrentInstance();
  const metrics = getLayoutMetrics();
  const footerHeight = ref(uni.upx2px(estimateRpx) + metrics.safeBottom);

  const applyFooterRect = (rect: UniApp.NodeInfo | UniApp.NodeInfo[] | null) => {
    if (rect && !Array.isArray(rect) && rect.height > 0) {
      footerHeight.value = Math.ceil(rect.height);
    }
  };

  const measureFooterHeight = () => {
    nextTick(() => {
      const scope = instance?.proxy ?? instance;
      const scopedQuery = uni.createSelectorQuery();
      if (scope) {
        scopedQuery.in(scope as unknown as UniApp.ComponentInternalInstance);
      }
      scopedQuery.select(selector).boundingClientRect(applyFooterRect).exec();

      // #fixed 插槽渲染在 PageLayout 内，组件内 in() 可能测不到高度
      setTimeout(() => {
        uni
          .createSelectorQuery()
          .select(selector)
          .boundingClientRect(applyFooterRect)
          .exec();
      }, 80);
    });
  };

  onMounted(() => {
    measureFooterHeight();
    setTimeout(measureFooterHeight, 120);
  });

  for (const source of watchSources) {
    watch(source, measureFooterHeight);
  }

  return { footerHeight, measureFooterHeight };
}
