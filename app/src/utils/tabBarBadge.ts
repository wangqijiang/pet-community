import { getUnreadMessageCount } from "@/api/message";
import { getUnreadNotificationCount } from "@/api/notification";
import { isLoggedIn } from "@/api/auth";

/** TabBar 消息角标刷新事件（兼容旧监听） */
export const REFRESH_TAB_BAR_BADGE = "refreshTabBarBadge";
/** 角标数量广播（全局唯一数据源） */
export const TAB_BAR_BADGE_COUNT = "tabBarBadgeCount";

let badgeFetchTimer: ReturnType<typeof setTimeout> | null = null;
let badgeFetching = false;
let lastBadgeCount = 0;

function broadcastBadgeCount(count: number) {
  lastBadgeCount = count;
  uni.$emit(TAB_BAR_BADGE_COUNT, count);
  uni.$emit(REFRESH_TAB_BAR_BADGE);
}

/** 全局唯一角标拉取，未登录不发请求 */
export async function fetchTabBarBadgeCount(): Promise<number> {
  if (!isLoggedIn()) {
    broadcastBadgeCount(0);
    return 0;
  }
  if (badgeFetching) return lastBadgeCount;

  badgeFetching = true;
  try {
    const msg = await getUnreadMessageCount();
    const notif = await getUnreadNotificationCount("message");
    const count = msg + notif;
    broadcastBadgeCount(count);
    return count;
  } catch {
    return lastBadgeCount;
  } finally {
    badgeFetching = false;
  }
}

/** 合并短时间内的多次角标刷新，避免 count 接口重复请求 */
export function scheduleTabBarBadgeRefresh(delayMs = 200) {
  if (!isLoggedIn()) {
    broadcastBadgeCount(0);
    return;
  }
  if (badgeFetchTimer) clearTimeout(badgeFetchTimer);
  badgeFetchTimer = setTimeout(() => {
    badgeFetchTimer = null;
    void fetchTabBarBadgeCount();
  }, delayMs);
}

/** @deprecated 请用 scheduleTabBarBadgeRefresh */
export function emitRefreshTabBarBadge() {
  scheduleTabBarBadgeRefresh(200);
}
