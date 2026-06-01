import { resolveMediaUrl } from "@/utils/media";

const PLACE_MARKER_ICON: Record<string, string> = {
  park: "/static/images/marker-place-park.png",
  trail: "/static/images/marker-place-trail.png",
  cafe: "/static/images/marker-place-cafe.png",
  shop: "/static/images/marker-place-shop.png",
  hospital: "/static/images/marker-place-hospital.png",
  groom: "/static/images/marker-place-groom.png",
  hotel: "/static/images/marker-place-hotel.png",
  playground: "/static/images/marker-place-playground.png",
};

const DEFAULT_PLACE_ICON = "/static/images/marker-place-default.png";
const USER_MARKER_ICON = "/static/images/marker-user.png";

export interface MapMarkerItem {
  id: number;
  latitude: number;
  longitude: number;
  iconPath: string;
  width: number;
  height: number;
  anchor: { x: number; y: number };
  callout: {
    content: string;
    display: "ALWAYS" | "BYCLICK";
    fontSize: number;
    borderRadius: number;
    bgColor: string;
    color: string;
    padding: number;
    textAlign: "left" | "center" | "right";
  };
}

export function buildPlaceMarker(place: {
  id: number;
  name: string;
  type?: string;
  category_label?: string;
  latitude: number | string;
  longitude: number | string;
}): MapMarkerItem {
  const type = place.type || "";
  const tag = place.category_label || "";
  const calloutText = tag ? `${place.name} · ${tag}` : place.name;

  return {
    id: place.id,
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
    iconPath: PLACE_MARKER_ICON[type] || DEFAULT_PLACE_ICON,
    width: 36,
    height: 36,
    anchor: { x: 0.5, y: 0.5 },
    callout: {
      content: calloutText,
      display: "ALWAYS",
      fontSize: 12,
      borderRadius: 8,
      bgColor: "#ffffff",
      color: "#3d2f2f",
      padding: 8,
      textAlign: "center",
    },
  };
}

export function buildUserMarker(user: {
  id: number;
  username: string;
  avatar?: string;
  pet_name?: string;
  latitude: number | string;
  longitude: number | string;
}): MapMarkerItem {
  const markerId = 100000 + user.id;
  const avatar = resolveMediaUrl(user.avatar);
  const calloutText = user.pet_name
    ? `${user.username} · ${user.pet_name}`
    : user.username;

  return {
    id: markerId,
    latitude: Number(user.latitude),
    longitude: Number(user.longitude),
    iconPath: avatar || USER_MARKER_ICON,
    width: avatar ? 40 : 36,
    height: avatar ? 40 : 36,
    anchor: { x: 0.5, y: 0.5 },
    callout: {
      content: calloutText,
      display: "ALWAYS",
      fontSize: 12,
      borderRadius: 8,
      bgColor: "#fff8f3",
      color: "#6b4e3d",
      padding: 8,
      textAlign: "center",
    },
  };
}
