export type PostSharePet = {
  id: number;
  name: string;
  avatar: string;
  type?: string;
};

export type PostShareInput = {
  id: number;
  userName: string;
  avatar: string;
  time?: string;
  content: string;
  images: string[];
  likes?: number;
  comments?: number;
  pets?: PostSharePet[];
};

export function buildPostSharePath(id: number): string {
  return `/pages/circle/detail?id=${id}`;
}

export function buildPostShareQuery(id: number): string {
  return `id=${id}`;
}

/** H5 可打开的完整链接；小程序端返回 path */
export function buildPostShareLink(id: number): string {
  // #ifdef H5
  if (typeof window !== "undefined") {
    const base =
      import.meta.env.VITE_APP_SHARE_BASE ||
      `${window.location.origin}${window.location.pathname}`;
    return `${base.replace(/\/$/, "")}#/pages/circle/detail?id=${id}`;
  }
  // #endif
  return buildPostSharePath(id);
}

export function buildPostShareTitle(
  content: string,
  userName: string,
  pets?: PostSharePet[],
): string {
  const text = (content || "").trim() || "快来看看这条萌宠动态";
  const preview = text.length > 28 ? `${text.slice(0, 28)}...` : text;
  if (pets?.length) {
    const petNames = pets
      .map((p) => p.name)
      .slice(0, 2)
      .join("、");
    const suffix = pets.length > 2 ? "等" : "";
    return `${petNames}${suffix} · ${preview}`;
  }
  return `${userName}：${preview}`;
}

export function resolveSharedPostRoute(
  launchQuery?: Record<string, string | undefined>,
): string | null {
  const pickId = (...values: Array<string | undefined>) => {
    for (const value of values) {
      if (value && /^\d+$/.test(String(value))) {
        return buildPostSharePath(Number(value));
      }
    }
    return null;
  };

  if (launchQuery) {
    const fromLaunch = pickId(launchQuery.id, launchQuery.postId);
    if (fromLaunch) return fromLaunch;
  }

  // #ifdef H5
  if (typeof window !== "undefined") {
    const hash = window.location.hash || "";
    const hashMatch = hash.match(/pages\/circle\/detail\?id=(\d+)/);
    if (hashMatch) return buildPostSharePath(Number(hashMatch[1]));

    const search = new URLSearchParams(window.location.search);
    const fromSearch = pickId(search.get("id") || undefined, search.get("postId") || undefined);
    if (fromSearch) return fromSearch;
  }
  // #endif

  return null;
}

export const PENDING_SHARE_ROUTE_KEY = "pendingShareRoute";
