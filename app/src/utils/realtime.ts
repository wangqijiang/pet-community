import { getToken, isLoggedIn } from "@/utils/session";
import { getApiOrigin } from "@/utils/media";
import type { ChatMessage } from "@/api/message";
import type { Notification } from "@/api/notification";

export type RealtimeEventType = "message" | "notification" | "connected";

export interface RealtimePayload {
  type: RealtimeEventType | "ping";
  data: ChatMessage | Notification | Record<string, unknown>;
}

let socketTask: UniApp.SocketTask | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let connecting = false;
let manualClose = false;
/** 当前打开的聊天对象，用于消息列表未读数判断 */
let activeChatUserId = 0;

export function setActiveChatUserId(userId: number) {
  activeChatUserId = userId;
}

export function getActiveChatUserId() {
  return activeChatUserId;
}

function getWsUrl(token: string) {
  const origin = getApiOrigin().replace(/^http/, "ws");
  return `${origin}/ws?token=${encodeURIComponent(token)}`;
}

function scheduleReconnect() {
  if (manualClose || reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectRealtime();
  }, 3000);
}

function handlePayload(raw: string) {
  try {
    const payload = JSON.parse(raw) as RealtimePayload;
    if (!payload?.type || payload.type === "ping") return;
    uni.$emit("realtime", payload);
    uni.$emit(`realtime:${payload.type}`, payload.data);
  } catch (err) {
    console.warn("realtime parse error", err);
  }
}

export function connectRealtime() {
  const token = getToken();
  if (!token || connecting || socketTask) return;

  manualClose = false;
  connecting = true;

  const task = uni.connectSocket({
    url: getWsUrl(token),
    complete: () => {},
  });
  socketTask = task;

  task.onOpen(() => {
    connecting = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  });

  task.onMessage((res) => {
    if (typeof res.data === "string") {
      handlePayload(res.data);
    }
  });

  const cleanup = () => {
    connecting = false;
    if (socketTask === task) socketTask = null;
    scheduleReconnect();
  };

  task.onClose(cleanup);
  task.onError(cleanup);
}

export function disconnectRealtime() {
  manualClose = true;
  connecting = false;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (socketTask) {
    try {
      socketTask.close({});
    } catch {
      /* ignore */
    }
    socketTask = null;
  }
}

export function ensureRealtimeConnected() {
  if (!getToken()) return;
  if (!socketTask) connectRealtime();
}
