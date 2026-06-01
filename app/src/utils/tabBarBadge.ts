/** TabBar 消息角标刷新事件 */
export const REFRESH_TAB_BAR_BADGE = "refreshTabBarBadge";

export function emitRefreshTabBarBadge() {
  uni.$emit(REFRESH_TAB_BAR_BADGE);
}
