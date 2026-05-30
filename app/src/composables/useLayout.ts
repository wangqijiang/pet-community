import { computed, ref } from "vue";

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

export function useLayout(options?: {
  /** 是否包含底部 TabBar */
  tabBar?: boolean;
  /** 导航栏下方额外固定区域高度（px），如分类 Tab */
  headerHeight?: number;
  /** 底部额外固定区域（px），如聊天输入框 */
  footerHeight?: number;
}) {
  const metrics = ref(getLayoutMetrics());
  const headerExtra = options?.headerHeight ?? 0;
  const footerExtra = options?.footerHeight ?? 0;
  const hasTabBar = options?.tabBar ?? false;

  const contentHeight = computed(() => {
    const m = metrics.value;
    let h = m.windowHeight - m.navbarHeight - headerExtra - footerExtra;
    if (hasTabBar) h -= m.tabbarHeight;
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
