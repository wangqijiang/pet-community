/** TabBar 消息角标刷新事件 */
export const REFRESH_TAB_BAR_BADGE = "refreshTabBarBadge";

let badgeEmitTimer: ReturnType<typeof setTimeout> | null = null;

/** 合并短时间内的多次角标刷新，避免 count 接口被重复打满并发 */
export function emitRefreshTabBarBadge() {
  if (badgeEmitTimer) clearTimeout(badgeEmitTimer);
  badgeEmitTimer = setTimeout(() => {
    badgeEmitTimer = null;
    uni.$emit(REFRESH_TAB_BAR_BADGE);
  }, 200);
}
