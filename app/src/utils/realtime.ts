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
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let connecting = false;
let manualClose = false;
let reconnectAttempt = 0;
let activeChatUserId = 0;

const MAX_RECONNECT_DELAY = 30000;
const HEARTBEAT_MS = 25000;

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

function clearHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function startHeartbeat(task: UniApp.SocketTask) {
  clearHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (!socketTask || socketTask !== task) return;
    try {
      task.send({ data: JSON.stringify({ type: "ping" }) });
    } catch {
      /* ignore */
    }
  }, HEARTBEAT_MS);
}

function scheduleReconnect() {
  if (manualClose || reconnectTimer || !isLoggedIn()) return;
  const delay = Math.min(1000 * 2 ** reconnectAttempt, MAX_RECONNECT_DELAY);
  reconnectAttempt += 1;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectRealtime();
  }, delay);
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

function bindSocket(task: UniApp.SocketTask) {
  task.onOpen(() => {
    connecting = false;
    reconnectAttempt = 0;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    startHeartbeat(task);
    uni.$emit("realtime:connected", { connected: true });
  });

  task.onMessage((res) => {
    if (typeof res.data === "string") {
      handlePayload(res.data);
    }
  });

  const cleanup = () => {
    connecting = false;
    clearHeartbeat();
    if (socketTask === task) socketTask = null;
    if (!manualClose) scheduleReconnect();
  };

  task.onClose(cleanup);
  task.onError(cleanup);
}

export function connectRealtime() {
  const token = getToken();
  if (!token || connecting) return;

  if (socketTask) {
    try {
      socketTask.close({});
    } catch {
      /* ignore */
    }
    socketTask = null;
  }

  manualClose = false;
  connecting = true;

  const task = uni.connectSocket({
    url: getWsUrl(token),
    complete: () => {},
  });
  socketTask = task;
  bindSocket(task);
}

export function disconnectRealtime() {
  manualClose = true;
  connecting = false;
  reconnectAttempt = 0;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  clearHeartbeat();
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
  connectRealtime();
}
