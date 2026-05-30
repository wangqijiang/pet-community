import type { ComponentInternalInstance } from "vue";
import type { PostShareInput, PostSharePet } from "./postShare";

/** 设计稿比例 5:7，偏竖版分享卡 */
const DESIGN_W = 600;
const DESIGN_H = 840;
const CANVAS_ID = "postShareCanvas";

type ImageInfo = { path: string; width: number; height: number };
type CanvasSize = { width: number; height: number };

function getCanvasSize(): CanvasSize {
  const sys = uni.getSystemInfoSync();
  const width = Math.floor((520 * sys.windowWidth) / 750);
  const height = Math.floor((width * DESIGN_H) / DESIGN_W);
  return { width, height };
}

function sx(x: number, cw: number): number {
  return Math.round((x * cw) / DESIGN_W);
}

function sy(y: number, ch: number): number {
  return Math.round((y * ch) / DESIGN_H);
}

function ss(size: number, cw: number): number {
  return Math.round((size * cw) / DESIGN_W);
}

async function resolveImagePath(src: string): Promise<string> {
  if (!src) throw new Error("empty src");

  if (/^https?:\/\//i.test(src)) {
    try {
      const downloaded = await new Promise<UniApp.DownloadSuccessData>((resolve, reject) => {
        uni.downloadFile({ url: src, success: resolve, fail: reject });
      });
      if (downloaded.statusCode === 200 && downloaded.tempFilePath) {
        return downloaded.tempFilePath;
      }
    } catch {
      /* fallback */
    }
  }

  const info = await new Promise<ImageInfo>((resolve, reject) => {
    uni.getImageInfo({ src, success: resolve, fail: reject });
  });
  return info.path;
}

function roundRectPath(
  ctx: UniApp.CanvasContext,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arc(x + w - radius, y + radius, radius, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arc(x + w - radius, y + h - radius, radius, 0, Math.PI / 2);
  ctx.lineTo(x + radius, y + h);
  ctx.arc(x + radius, y + h - radius, radius, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + radius);
  ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
  ctx.closePath();
}

function fillRoundRect(
  ctx: UniApp.CanvasContext,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.setFillStyle(color);
  ctx.fill();
}

function drawRoundImage(
  ctx: UniApp.CanvasContext,
  img: ImageInfo,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const dx = x + (w - sw) / 2;
  const dy = y + (h - sh) / 2;

  ctx.save();
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.clip();
  ctx.drawImage(img.path, dx, dy, sw, sh);
  ctx.restore();
}

function drawPetAvatar(
  ctx: UniApp.CanvasContext,
  imgPath: string | undefined,
  name: string,
  cx: number,
  cy: number,
  size: number,
  cw: number,
) {
  const r = size / 2;
  if (imgPath) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgPath, cx - r, cy - r, size, size);
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.setFillStyle("#FFE4EC");
    ctx.fill();
    ctx.setFillStyle("#8B6D73");
    ctx.setFontSize(ss(26, cw));
    ctx.setTextAlign("center");
    ctx.fillText((name || "宠").slice(0, 1), cx, cy + ss(8, cw));
    ctx.setTextAlign("left");
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.setStrokeStyle("#FFFFFF");
  ctx.setLineWidth(3);
  ctx.stroke();
}

function wrapTextLines(text: string, maxChars: number, maxLines: number): string[] {
  const normalized = (text || "").replace(/\s+/g, " ").trim() || "记录了一条萌宠日常";
  const lines: string[] = [];
  let current = "";

  for (const char of normalized) {
    if (current.length >= maxChars) {
      lines.push(current);
      current = char;
      if (lines.length >= maxLines) break;
    } else {
      current += char;
    }
  }
  if (lines.length < maxLines && current) lines.push(current);
  if (lines.length >= maxLines && normalized.length > maxChars * maxLines) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 1))}...`;
  }
  return lines.slice(0, maxLines);
}

function truncateName(name: string, max = 5): string {
  const n = (name || "萌宠").trim();
  return n.length > max ? `${n.slice(0, max)}…` : n;
}

function drawCard(
  ctx: UniApp.CanvasContext,
  input: PostShareInput,
  petAvatars: Map<number, string>,
  cw: number,
  ch: number,
  cover?: ImageInfo,
) {
  const pad = sx(24, cw);
  const cardX = pad;
  const cardY = sy(28, ch);
  const cardW = cw - pad * 2;
  const innerR = ss(28, cw);

  fillRoundRect(ctx, cardX, cardY, cardW, ch - cardY - sy(28, ch), innerR, "#FFFFFF");

  let y = cardY;

  // ① 首图（通栏大图）
  const hasCover = !!cover;
  const imgH = hasCover ? sy(340, ch) : 0;

  if (hasCover && cover) {
    drawRoundImage(ctx, cover, cardX, y, cardW, imgH, innerR);
    y += imgH;
  } else {
    y += sy(20, ch);
  }

  // ② 正文
  const textPad = sx(28, cw);
  const textX = cardX + textPad;
  const textW = cardW - textPad * 2;
  const maxLines = hasCover ? 5 : 8;
  const lines = wrapTextLines(input.content, 18, maxLines);
  const lineH = sy(40, ch);

  y += sy(28, ch);
  ctx.setFillStyle("#2D2424");
  ctx.setFontSize(ss(30, cw));
  lines.forEach((line, i) => {
    ctx.fillText(line, textX, y + sy(32, ch) + i * lineH);
  });
  y += sy(32, ch) + lines.length * lineH;

  // ③ 关联宠物（仅头像 + 名字）
  const pets = (input.pets || []).slice(0, 4);
  if (pets.length > 0) {
    y += sy(24, ch);
    const avatarSize = ss(64, cw);
    const itemW = ss(88, cw);
    const totalW = pets.length * itemW;
    const startX = cardX + (cardW - totalW) / 2 + itemW / 2;

    pets.forEach((pet, i) => {
      const cx = startX + i * itemW;
      const avatarCy = y + avatarSize / 2;
      drawPetAvatar(ctx, petAvatars.get(pet.id), pet.name, cx, avatarCy, avatarSize, cw);

      ctx.setFillStyle("#5C4F4F");
      ctx.setFontSize(ss(22, cw));
      ctx.setTextAlign("center");
      ctx.fillText(truncateName(pet.name), cx, avatarCy + avatarSize / 2 + sy(28, ch));
      ctx.setTextAlign("left");
    });
    y += avatarSize + sy(52, ch);
  }

  // ④ 底部品牌（极简）
  ctx.setFillStyle("#C4B5B5");
  ctx.setFontSize(ss(20, cw));
  ctx.setTextAlign("center");
  ctx.fillText("萌宠朋友圈", cardX + cardW / 2, cardY + (ch - cardY - sy(28, ch)) - sy(24, ch));
  ctx.setTextAlign("left");
}

function fillBackground(ctx: UniApp.CanvasContext, cw: number, ch: number) {
  ctx.setFillStyle("#F5EDE8");
  ctx.fillRect(0, 0, cw, ch);
}

export function getShareCanvasDisplaySize(): CanvasSize {
  return getCanvasSize();
}

export async function generatePostShareCard(
  input: PostShareInput,
  component?: ComponentInternalInstance | null,
): Promise<string> {
  const { width: cw, height: ch } = getCanvasSize();
  const pets = input.pets || [];
  const petAvatars = new Map<number, string>();

  await Promise.all(
    pets.map(async (pet) => {
      const src = pet.avatar?.trim();
      if (!src) return;
      try {
        petAvatars.set(pet.id, await resolveImagePath(src));
      } catch {
        /* 占位首字 */
      }
    }),
  );

  let coverInfo: ImageInfo | undefined;
  const coverUrl = input.images?.[0];
  if (coverUrl) {
    try {
      const path = await resolveImagePath(coverUrl);
      coverInfo = await new Promise<ImageInfo>((resolve, reject) => {
        uni.getImageInfo({ src: path, success: resolve, fail: reject });
      });
    } catch {
      coverInfo = undefined;
    }
  }

  const ctx = uni.createCanvasContext(CANVAS_ID, component as never);
  fillBackground(ctx, cw, ch);
  drawCard(ctx, input, petAvatars, cw, ch, coverInfo);

  return new Promise((resolve, reject) => {
    ctx.draw(false, () => {
      setTimeout(() => {
        uni.canvasToTempFilePath(
          {
            canvasId: CANVAS_ID,
            width: cw,
            height: ch,
            destWidth: cw * 2,
            destHeight: ch * 2,
            fileType: "png",
            success: (res) => resolve(res.tempFilePath),
            fail: (err) => reject(err),
          },
          component as never,
        );
      }, 500);
    });
  });
}

export const POST_SHARE_CANVAS_ID = CANVAS_ID;

export function getPostShareCanvasSize() {
  return getCanvasSize();
}

export const POST_SHARE_CANVAS_SIZE = getCanvasSize();
