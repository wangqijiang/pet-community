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
  label?: {
    content: string;
    color: string;
    fontSize: number;
    anchorX: number;
    anchorY: number;
    borderWidth: number;
    borderColor: string;
    bgColor: string;
    padding: number;
    borderRadius: number;
  };
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

function truncateName(name: string, max = 8) {
  return name.length > max ? `${name.slice(0, max)}…` : name;
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
  const shortName = truncateName(place.name);
  const calloutText = tag ? `${place.name}\n${tag}` : place.name;

  return {
    id: place.id,
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
    iconPath: PLACE_MARKER_ICON[type] || DEFAULT_PLACE_ICON,
    width: 36,
    height: 36,
    anchor: { x: 0.5, y: 0.5 },
    label: {
      content: shortName,
      color: "#3d2f2f",
      fontSize: 11,
      anchorX: 0,
      anchorY: -42,
      borderWidth: 1,
      borderColor: "#f1e5da",
      bgColor: "#ffffff",
      padding: 4,
      borderRadius: 6,
    },
    callout: {
      content: calloutText,
      display: "BYCLICK",
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
    label: {
      content: truncateName(user.username, 6),
      color: "#6b4e3d",
      fontSize: 11,
      anchorX: 0,
      anchorY: -42,
      borderWidth: 1,
      borderColor: "#f1e5da",
      bgColor: "#fff8f3",
      padding: 4,
      borderRadius: 6,
    },
    callout: {
      content: calloutText,
      display: "BYCLICK",
      fontSize: 12,
      borderRadius: 8,
      bgColor: "#fff8f3",
      color: "#6b4e3d",
      padding: 8,
      textAlign: "center",
    },
  };
}
