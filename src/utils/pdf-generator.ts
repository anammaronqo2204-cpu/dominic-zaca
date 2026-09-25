import pearlsUrl from "@/assets/pearls.jpg";
import plumesUrl from "@/assets/plumes.jpg";
import taffetaUrl from "@/assets/taffeta.jpg";
import { buildFeather, rng } from "@/components/feather-geometry";
import { EMAIL, SCREEN, SERVICES, SOCIALS } from "@/content";

export type PdfKind = "overview" | "brands";

export type GeneratedPdf = {
  kind: PdfKind;
  filename: string;
  title: string;
  blob: Blob;
  url: string;
  pagePreviews: string[];
  sizeKb: number;
};

// A4 dimensions in PDF points (72 pt/inch) and canvas pixels (~150 DPI)
const PT_W = 595.28;
const PT_H = 841.89;
const W = 1240;
const H = 1754;

const C = {
  plum: "#1C1016",
  plumDeep: "#140A0F",
  plumSoft: "#291720",
  marigold: "#D9A02E",
  marigoldLight: "#F2D492",
  flare: "#C22A6D",
  flareDeep: "#7A1442",
  bone: "#F3E9DC",
  boneDark: "#E4D5C3",
  ink: "#120A0E",
  dusty: "#8A5468",
};

type LinkRect = {
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  uri: string;
};

type TextItem = {
  page: number;
  x: number;
  y: number;
  size: number;
  text: string;
};

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement | null> {
  const cached = imageCache.get(src);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function setFont(
  ctx: CanvasRenderingContext2D,
  family: "display" | "sans",
  sizePx: number,
  opts: { weight?: number; italic?: boolean } = {},
) {
  const weight = opts.weight ?? (family === "display" ? 400 : 400);
  const style = opts.italic ? "italic " : "";
  const stack =
    family === "display"
      ? `"Fraunces", Georgia, serif`
      : `"Manrope", -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.font = `${style}${weight} ${sizePx}px ${stack}`;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawParagraph(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = wrapLines(ctx, text, maxWidth);
  let cy = y;
  for (const line of lines) {
    ctx.fillText(line, x, cy);
    cy += lineHeight;
  }
  return cy;
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  w: number,
  h: number,
  archTop = false,
) {
  ctx.save();
  ctx.beginPath();
  if (archTop) {
    const r = w / 2;
    ctx.arc(x + r, y + r, r, Math.PI, 0, false);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.clip();

  if (img && img.width > 0 && img.height > 0) {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = img.width * scale;
    const sh = img.height * scale;
    const sx = x + (w - sw) * 0.65;
    const sy = y + (h - sh) * 0.5;
    ctx.drawImage(img, sx, sy, sw, sh);
  } else {
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, C.flare);
    grad.addColorStop(0.5, C.plumSoft);
    grad.addColorStop(1, C.marigold);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

function drawFeatherOnCanvas(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  angleDeg: number,
  alpha = 1,
) {
  const g = buildFeather(95, 7, 1.15);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.translate(-128, -748);

  const barbGrad = ctx.createLinearGradient(0, 748, 0, 16);
  barbGrad.addColorStop(0, C.flare);
  barbGrad.addColorStop(0.22, "#C8416B");
  barbGrad.addColorStop(0.4, C.marigold);
  barbGrad.addColorStop(0.82, "#E8BC5C");
  barbGrad.addColorStop(1, "#F7DFA2");

  const quillGrad = ctx.createLinearGradient(0, 748, 0, 16);
  quillGrad.addColorStop(0, "rgba(243,233,220,0.55)");
  quillGrad.addColorStop(0.3, "#F2D9A0");
  quillGrad.addColorStop(1, "#F7E3B0");

  ctx.lineCap = "round";
  ctx.strokeStyle = C.flare;
  ctx.lineWidth = 1.2;
  ctx.stroke(new Path2D(g.down));

  ctx.strokeStyle = barbGrad;
  ctx.lineWidth = 1.65;
  ctx.stroke(new Path2D(g.barbs));

  ctx.fillStyle = quillGrad;
  ctx.fill(new Path2D(g.rachis));
  ctx.restore();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.fillStyle = color;
  const p = new Path2D(
    "M12 21.2s-7.7-4.7-9.8-9.5C.7 8.2 2.8 4.2 6.8 4.2c2.2 0 3.8 1.2 5.2 3.1 1.4-1.9 3-3.1 5.2-3.1 4 0 6.1 4 4.6 7.5-2.1 4.8-9.8 9.5-9.8 9.5z",
  );
  ctx.fill(p);
  ctx.restore();
}

function drawWaxSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.translate(cx, cy);
  const rand = rng(31);
  const n = 24;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = radius * (0.92 + (rand() - 0.5) * 0.1 + (i % 5 === 0 ? 0.05 : 0));
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.25, radius * 0.1, 0, 0, radius);
  grad.addColorStop(0, "#E7609A");
  grad.addColorStop(0.55, C.flare);
  grad.addColorStop(1, C.flareDeep);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = "#6E0F3A";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.68, 0, Math.PI * 2);
  ctx.stroke();

  ctx.scale(radius / 26, radius / 26);
  ctx.translate(-12, -12);
  ctx.fillStyle = "#F59BC0";
  ctx.fill(new Path2D("M20.5 3.5C13 3.8 7.1 9.4 6.6 17.4c8-.4 13.6-6.3 13.9-13.9z"));
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT 1: OVERVIEW OF DOMINIC (2 A4 Pages)
// ─────────────────────────────────────────────────────────────────────────────

async function renderOverviewPages(): Promise<{
  canvases: HTMLCanvasElement[];
  links: LinkRect[];
  texts: TextItem[];
}> {
  const plumesImg = await loadImage(plumesUrl);
  const links: LinkRect[] = [];
  const texts: TextItem[] = [];

  // ── PAGE 1: Cover, Headline Feather Award Win, Pull Quote & Bio ──────────
  const p1 = document.createElement("canvas");
  p1.width = W;
  p1.height = H;
  const c1 = p1.getContext("2d")!;

  // Ink Plum background + subtle warm spotlight
  c1.fillStyle = C.plum;
  c1.fillRect(0, 0, W, H);

  const spot = c1.createRadialGradient(W * 0.78, 80, 20, W * 0.78, 80, 760);
  spot.addColorStop(0, "rgba(217, 160, 46, 0.22)");
  spot.addColorStop(1, "rgba(217, 160, 46, 0)");
  c1.fillStyle = spot;
  c1.fillRect(0, 0, W, H);

  const spotBottom = c1.createRadialGradient(120, H, 20, 120, H, 620);
  spotBottom.addColorStop(0, "rgba(194, 42, 109, 0.20)");
  spotBottom.addColorStop(1, "rgba(194, 42, 109, 0)");
  c1.fillStyle = spotBottom;
  c1.fillRect(0, 0, W, H);

  // Outer editorial hairline frame
  c1.strokeStyle = "rgba(243, 233, 220, 0.16)";
  c1.lineWidth = 1.5;
  c1.strokeRect(56, 56, W - 112, H - 112);

  // Top header bar
  c1.fillStyle = C.bone;
  setFont(c1, "sans", 18, { weight: 600 });
  c1.fillText("Media kit, 2026", 88, 108);

  c1.fillStyle = C.marigold;
  setFont(c1, "display", 20, { italic: true });
  c1.fillText("Talent Overview", 260, 108);

  c1.textAlign = "right";
  c1.fillStyle = C.bone;
  setFont(c1, "sans", 18, { weight: 600 });
  c1.fillText(EMAIL, W - 88, 108);
  c1.textAlign = "left";
  links.push({ page: 0, x: W - 360, y: 84, w: 272, h: 34, uri: `mailto:${EMAIL}` });

  // Top rule
  c1.strokeStyle = "rgba(243, 233, 220, 0.16)";
  c1.beginPath();
  c1.moveTo(88, 134);
  c1.lineTo(W - 88, 134);
  c1.stroke();

  // Procedural feather tucked behind the name
  drawFeatherOnCanvas(c1, 980, 580, 0.68, 21, 0.96);

  // Kicker
  c1.fillStyle = "rgba(243, 233, 220, 0.82)";
  setFont(c1, "display", 34, { weight: 300, italic: true });
  c1.fillText("And the Feather goes to…", 88, 212);

  // Giant Name
  c1.fillStyle = C.bone;
  setFont(c1, "display", 158, { weight: 400 });
  c1.fillText("Dominic", 84, 362);
  c1.fillText("Zaca", 360, 506);
  texts.push({ page: 0, x: 84, y: 362, size: 72, text: "Dominic Zaca - Talent Overview 2026" });

  // Headline Award Band
  c1.strokeStyle = "rgba(243, 233, 220, 0.2)";
  c1.beginPath();
  c1.moveTo(88, 560);
  c1.lineTo(W - 88, 560);
  c1.stroke();

  c1.fillStyle = C.marigold;
  setFont(c1, "display", 38, { weight: 400 });
  c1.fillText("Social Media Personality of the Year", 88, 616);
  texts.push({ page: 0, x: 88, y: 616, size: 22, text: "Winner, Social Media Personality of the Year, 17th Feather Awards, 2025" });

  c1.fillStyle = "rgba(243, 233, 220, 0.75)";
  setFont(c1, "sans", 20, { weight: 500 });
  c1.fillText("Winner, 17th Feather Awards, Johannesburg, November 2025", 88, 650);

  c1.fillStyle = C.flare;
  setFont(c1, "display", 22, { italic: true });
  c1.fillText("Also nominated: Social Media Dominance of the Year, SA Social Media Awards, 2024", 88, 686);

  c1.strokeStyle = "rgba(243, 233, 220, 0.2)";
  c1.beginPath();
  c1.moveTo(88, 716);
  c1.lineTo(W - 88, 716);
  c1.stroke();

  // Pull quote across the spread
  c1.fillStyle = C.marigold;
  setFont(c1, "display", 110, { italic: true });
  c1.fillText("“", 78, 836);

  c1.fillStyle = C.bone;
  setFont(c1, "display", 48, { weight: 300, italic: true });
  const qEnd = drawParagraph(
    c1,
    "I survived! I show you who I am and you laugh, love and cry along with me.",
    154,
    804,
    W - 246,
    56,
  );
  c1.fillStyle = "rgba(243, 233, 220, 0.6)";
  setFont(c1, "sans", 17, { weight: 500 });
  c1.fillText("Dominic’s public bio line across platforms", 154, qEnd + 4);

  // Two-column lower half: Arch couture frame on left, Bio + Key facts on right
  const archX = 96;
  const archY = 980;
  const archW = 370;
  const archH = 510;

  c1.save();
  c1.strokeStyle = "rgba(217, 160, 46, 0.45)";
  c1.lineWidth = 1.5;
  c1.beginPath();
  const ar = (archW + 24) / 2;
  c1.arc(archX - 12 + ar, archY - 12 + ar, ar, Math.PI, 0, false);
  c1.lineTo(archX + archW + 12, archY + archH + 12);
  c1.lineTo(archX - 12, archY + archH + 12);
  c1.closePath();
  c1.stroke();
  c1.restore();

  drawCoverImage(c1, plumesImg, archX, archY, archW, archH, true);

  c1.fillStyle = "rgba(243, 233, 220, 0.52)";
  setFont(c1, "display", 16, { italic: true });
  c1.fillText("Portrait arch (stand-in texture for sample kit)", archX, archY + archH + 42);

  // Bio column on right
  const bx = 524;
  const bw = W - bx - 88;
  c1.fillStyle = C.bone;
  setFont(c1, "display", 33, { weight: 400 });
  let by = drawParagraph(
    c1,
    "Media personality, MC, content creator, and one of the loudest, warmest voices in queer South Africa.",
    bx,
    1006,
    bw,
    40,
  );

  c1.fillStyle = "rgba(243, 233, 220, 0.84)";
  setFont(c1, "sans", 20, { weight: 400 });
  by = drawParagraph(
    c1,
    "Dominic Zaca has built an audience of more than two million people by refusing to shrink. On TikTok, Instagram and YouTube, everyday life becomes appointment viewing: funny, frank, dressed to the hilt, and always in conversation with the community in the comments.",
    bx,
    by + 18,
    bw,
    31,
  );
  by = drawParagraph(
    c1,
    "Screen credits run from Moja Love’s LGBTQIA+ reality series The Way Ngingakhona to supporting roles in Showmax’s LLB and Mnet’s Udumo. Off camera, Dominic works as a creative director and consults on business development and marketing.",
    bx,
    by + 16,
    bw,
    31,
  );

  // 2x2 Facts grid
  const fy = by + 26;
  c1.strokeStyle = "rgba(243, 233, 220, 0.18)";
  c1.beginPath();
  c1.moveTo(bx, fy);
  c1.lineTo(W - 88, fy);
  c1.stroke();

  const facts: Array<[string, string]> = [
    ["Based", "KwaZulu-Natal & Johannesburg"],
    ["Speaks", "English and isiZulu"],
    ["Known for", "Maximalist fashion, worn loudly"],
    ["Stands up for", "South Africa’s LGBTQIA+ community"],
  ];
  facts.forEach(([k, v], idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const fx = bx + col * 320;
    const fRowY = fy + 38 + row * 82;
    c1.fillStyle = "rgba(243, 233, 220, 0.58)";
    setFont(c1, "sans", 16, { weight: 500 });
    c1.fillText(k, fx, fRowY);
    c1.fillStyle = C.bone;
    setFont(c1, "display", 22, { weight: 400 });
    c1.fillText(v, fx, fRowY + 30);
  });

  // Footer strip Page 1
  c1.fillStyle = "rgba(243, 233, 220, 0.5)";
  setFont(c1, "sans", 15, { weight: 500 });
  c1.fillText("Dominic Zaca — Talent Overview (Page 1 of 2)", 88, H - 78);
  c1.textAlign = "right";
  c1.fillText("Continued: Platform Reach, Screen Credits & Booking", W - 88, H - 78);
  c1.textAlign = "left";

  // ── PAGE 2: Platform Numbers, 101M+ Hearts, Screen Credits & Booking ─────
  const p2 = document.createElement("canvas");
  p2.width = W;
  p2.height = H;
  const c2 = p2.getContext("2d")!;

  c2.fillStyle = C.bone;
  c2.fillRect(0, 0, W, H);

  // Outer hairline frame on Bone
  c2.strokeStyle = "rgba(18, 10, 14, 0.15)";
  c2.lineWidth = 1.5;
  c2.strokeRect(56, 56, W - 112, H - 112);

  // Header
  c2.fillStyle = C.ink;
  setFont(c2, "sans", 18, { weight: 600 });
  c2.fillText("Dominic Zaca — Talent Overview", 88, 108);
  c2.textAlign = "right";
  c2.fillStyle = C.flare;
  setFont(c2, "display", 20, { italic: true });
  c2.fillText("Audience, Screen & Booking", W - 88, 108);
  c2.textAlign = "left";

  c2.strokeStyle = "rgba(18, 10, 14, 0.15)";
  c2.beginPath();
  c2.moveTo(88, 134);
  c2.lineTo(W - 88, 134);
  c2.stroke();

  // Section 1: Who's watching
  c2.fillStyle = C.ink;
  setFont(c2, "display", 74, { weight: 400 });
  c2.fillText("Who’s watching", 88, 222);

  c2.fillStyle = "rgba(18, 10, 14, 0.74)";
  setFont(c2, "sans", 20, { weight: 400 });
  c2.fillText("More than 2.3 million followers across platforms. TikTok does the heavy lifting; Instagram gets the looks.", 88, 264);

  // Left: Giant 2.2M + Platform Ledger
  c2.fillStyle = C.flare;
  setFont(c2, "display", 156, { weight: 300, italic: true });
  c2.fillText("2.2M", 84, 424);
  texts.push({ page: 1, x: 84, y: 424, size: 48, text: "2.2M followers on TikTok @zacadominic, 101M+ likes" });

  c2.fillStyle = C.ink;
  setFont(c2, "sans", 20, { weight: 500 });
  c2.fillText("followers on TikTok as @zacadominic", 88, 464);
  links.push({ page: 1, x: 88, y: 440, w: 380, h: 34, uri: "https://www.tiktok.com/@zacadominic" });

  const platRows = [
    { name: "Instagram", handle: "@zaca_dominic", stat: "139K followers", sub: "351 posts", uri: "https://www.instagram.com/zaca_dominic/" },
    { name: "Facebook", handle: "Dominic Zaca, public page", stat: "157K talking about this", sub: "302 posts" },
    { name: "YouTube", handle: "@dominiczaca", stat: "Official channel", sub: "Video & long-form", uri: "https://www.youtube.com/@dominiczaca" },
  ];

  let py = 516;
  for (const row of platRows) {
    c2.strokeStyle = "rgba(18, 10, 14, 0.16)";
    c2.beginPath();
    c2.moveTo(88, py);
    c2.lineTo(640, py);
    c2.stroke();

    c2.fillStyle = C.ink;
    setFont(c2, "display", 32, { weight: 400 });
    c2.fillText(row.name, 88, py + 44);

    c2.fillStyle = "rgba(18, 10, 14, 0.68)";
    setFont(c2, "sans", 17, { weight: 500 });
    c2.fillText(row.handle, 88, py + 72);

    c2.textAlign = "right";
    c2.fillStyle = C.flare;
    setFont(c2, "display", 30, { weight: 400, italic: true });
    c2.fillText(row.stat, 640, py + 44);

    c2.fillStyle = "rgba(18, 10, 14, 0.6)";
    setFont(c2, "sans", 16, { weight: 500 });
    c2.fillText(row.sub, 640, py + 72);
    c2.textAlign = "left";

    if (row.uri) {
      links.push({ page: 1, x: 88, y: py + 10, w: 552, h: 74, uri: row.uri });
    }
    py += 100;
  }
  c2.strokeStyle = "rgba(18, 10, 14, 0.16)";
  c2.beginPath();
  c2.moveTo(88, py);
  c2.lineTo(640, py);
  c2.stroke();

  // Right: Ink Plum plate with 101M+ Likes & 101 Hearts
  const rx = 684;
  const ry = 304;
  const rw = W - rx - 56;
  const rh = 528;
  c2.fillStyle = C.plum;
  c2.fillRect(rx, ry, rw, rh);

  c2.fillStyle = C.marigold;
  setFont(c2, "display", 86, { weight: 300, italic: true });
  c2.fillText("101M+", rx + 44, ry + 102);

  c2.fillStyle = "rgba(243, 233, 220, 0.76)";
  setFont(c2, "sans", 18, { weight: 500 });
  c2.fillText("likes on TikTok", rx + 44, ry + 134);

  // 101 hearts grid (10 columns)
  const hx0 = rx + 44;
  const hy0 = ry + 160;
  for (let i = 0; i < 101; i++) {
    const col = i % 10;
    const row = Math.floor(i / 10);
    drawHeart(c2, hx0 + col * 24, hy0 + row * 19, 15, i < 63 ? C.marigold : C.flare);
  }

  c2.fillStyle = C.bone;
  setFont(c2, "display", 24, { weight: 400 });
  drawParagraph(
    c2,
    "That’s one for every person in South Africa, with 38 million to spare.",
    rx + 44,
    ry + 408,
    rw - 88,
    30,
  );

  c2.fillStyle = "rgba(243, 233, 220, 0.58)";
  setFont(c2, "sans", 14, { weight: 400 });
  c2.fillText("One heart = 1M likes. Stats SA 2025 estimate: 63.1M.", rx + 44, ry + 494);

  // Section 2: On screen + Decorated Certificate summary
  const sy = 890;
  c2.fillStyle = C.ink;
  setFont(c2, "display", 60, { weight: 400 });
  c2.fillText("On screen", 88, sy);

  let cy = sy + 36;
  for (const item of SCREEN) {
    c2.strokeStyle = "rgba(18, 10, 14, 0.16)";
    c2.beginPath();
    c2.moveTo(88, cy);
    c2.lineTo(W - 88, cy);
    c2.stroke();

    c2.fillStyle = C.ink;
    setFont(c2, "display", 38, { weight: 400 });
    c2.fillText(item.title, 88, cy + 54);

    c2.fillStyle = C.ink;
    setFont(c2, "sans", 20, { weight: 700 });
    c2.fillText(item.network, 560, cy + 50);

    c2.fillStyle = C.flare;
    setFont(c2, "display", 24, { italic: item.role.startsWith("as ") });
    c2.fillText(item.role, 740, cy + 44);

    c2.fillStyle = "rgba(18, 10, 14, 0.65)";
    setFont(c2, "sans", 16, { weight: 500 });
    c2.fillText(item.detail, 740, cy + 70);

    c2.textAlign = "right";
    c2.fillStyle = "rgba(18, 10, 14, 0.65)";
    setFont(c2, "sans", 18, { weight: 500 });
    c2.fillText(item.when, W - 88, cy + 50);
    c2.textAlign = "left";

    cy += 94;
  }
  c2.strokeStyle = "rgba(18, 10, 14, 0.16)";
  c2.beginPath();
  c2.moveTo(88, cy);
  c2.lineTo(W - 88, cy);
  c2.stroke();

  // Bottom Booking Banner in Ink Plum
  const by0 = 1280;
  const bh0 = 356;
  c2.fillStyle = C.plum;
  c2.fillRect(88, by0, W - 176, bh0);

  drawFeatherOnCanvas(c2, W - 165, by0 + 320, 0.42, 16, 0.35);

  c2.fillStyle = C.bone;
  setFont(c2, "display", 58, { weight: 400 });
  c2.fillText("Let’s make a scene.", 132, by0 + 88);

  c2.fillStyle = "rgba(243, 233, 220, 0.8)";
  setFont(c2, "sans", 20, { weight: 400 });
  c2.fillText("Hosting, campaigns, appearances, collaborations. Send the brief, the date and the dress code.", 132, by0 + 132);

  c2.fillStyle = C.marigold;
  setFont(c2, "display", 48, { italic: true });
  c2.fillText(EMAIL, 132, by0 + 210);
  links.push({ page: 1, x: 132, y: by0 + 168, w: 680, h: 56, uri: `mailto:${EMAIL}` });
  texts.push({ page: 1, x: 132, y: by0 + 210, size: 28, text: `Booking email: ${EMAIL}` });

  // Social row inside booking banner
  const socY = by0 + 292;
  SOCIALS.forEach((s, idx) => {
    const sx = 132 + idx * 245;
    c2.fillStyle = "rgba(243, 233, 220, 0.56)";
    setFont(c2, "sans", 15, { weight: 500 });
    c2.fillText(s.platform, sx, socY);
    c2.fillStyle = C.bone;
    setFont(c2, "display", 22, { weight: 400 });
    c2.fillText(s.handle, sx, socY + 28);
    if (s.href) {
      links.push({ page: 1, x: sx, y: socY - 16, w: 220, h: 54, uri: s.href });
    }
  });

  // Footer strip Page 2
  c2.fillStyle = "rgba(18, 10, 14, 0.55)";
  setFont(c2, "sans", 15, { weight: 500 });
  c2.fillText("Dominic Zaca — Talent Overview (Page 2 of 2)", 88, H - 78);
  c2.textAlign = "right";
  c2.fillText("Sample media kit dossier, 2026", W - 88, H - 78);
  c2.textAlign = "left";

  return { canvases: [p1, p2], links, texts };
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT 2: BRAND AFFILIATIONS, FASHION & FIT (2 A4 Pages)
// ─────────────────────────────────────────────────────────────────────────────

async function renderBrandsPages(): Promise<{
  canvases: HTMLCanvasElement[];
  links: LinkRect[];
  texts: TextItem[];
}> {
  const [pearlsImg, taffetaImg] = await Promise.all([loadImage(pearlsUrl), loadImage(taffetaUrl)]);
  const links: LinkRect[] = [];
  const texts: TextItem[] = [];

  // ── PAGE 1: Fashion Houses, Red Carpet, Omoda 2026 & Award Bodies ────────
  const p1 = document.createElement("canvas");
  p1.width = W;
  p1.height = H;
  const c1 = p1.getContext("2d")!;

  c1.fillStyle = C.bone;
  c1.fillRect(0, 0, W, H);

  // Deep Ink Plum top editorial masthead
  c1.fillStyle = C.plum;
  c1.fillRect(0, 0, W, 370);

  drawFeatherOnCanvas(c1, W - 150, 340, 0.46, 20, 0.45);

  c1.fillStyle = C.bone;
  setFont(c1, "sans", 18, { weight: 600 });
  c1.fillText("Dominic Zaca — Media kit, 2026", 88, 88);

  c1.textAlign = "right";
  c1.fillStyle = C.marigold;
  setFont(c1, "display", 20, { italic: true });
  c1.fillText("Brand Affiliations, Fashion & Fit", W - 88, 88);
  c1.textAlign = "left";

  c1.strokeStyle = "rgba(243, 233, 220, 0.18)";
  c1.beginPath();
  c1.moveTo(88, 114);
  c1.lineTo(W - 88, 114);
  c1.stroke();

  c1.fillStyle = C.bone;
  setFont(c1, "display", 98, { weight: 300, italic: true });
  c1.fillText("“Who are you wearing?”", 84, 240);
  texts.push({ page: 0, x: 84, y: 240, size: 48, text: "Dominic Zaca - Brand Affiliations, Fashion & Wardrobe Credits 2026" });

  c1.fillStyle = "rgba(243, 233, 220, 0.82)";
  setFont(c1, "sans", 21, { weight: 400 });
  c1.fillText(
    "The red-carpet question, answered by the fashion houses, partners and award bodies in Dominic’s corner.",
    88,
    306,
  );

  // Left column: Overlapping couture plates (Pearls + Marigold Taffeta)
  drawCoverImage(c1, pearlsImg, 88, 430, 360, 470, false);
  c1.fillStyle = C.bone;
  c1.fillRect(268, 730, 216, 256);
  drawCoverImage(c1, taffetaImg, 278, 740, 196, 236, false);

  c1.fillStyle = "rgba(18, 10, 14, 0.56)";
  setFont(c1, "display", 16, { italic: true });
  c1.fillText("Couture detail plates (stand-in textures)", 88, 1022);

  // Right column: Fashion & Couture House Credits
  const lx = 528;
  const lw = W - lx - 88;
  const fashionCredits = [
    {
      house: "Vallure Designs",
      role: "Red-carpet couture",
      desc: "Designed Dominic’s gown for Netflix’s Bridgerton Season 4 premiere in Cape Town.",
    },
    {
      house: "Indoni Fashion House",
      role: "Durban July couture",
      desc: "Created a custom, pearl-draped gown for the Hollywoodbets Durban July.",
    },
    {
      house: "Khosi Nkosi",
      role: "South African heritage luxury",
      desc: "Flagship South African luxury fashion house tagged directly in Dominic’s Instagram bio.",
    },
  ];

  let ly = 430;
  for (const item of fashionCredits) {
    c1.strokeStyle = "rgba(18, 10, 14, 0.16)";
    c1.lineWidth = 1.5;
    c1.beginPath();
    c1.moveTo(lx, ly);
    c1.lineTo(W - 88, ly);
    c1.stroke();

    c1.fillStyle = C.flare;
    setFont(c1, "display", 19, { italic: true });
    c1.fillText(item.role, lx, ly + 36);

    c1.fillStyle = C.ink;
    setFont(c1, "display", 46, { weight: 400 });
    c1.fillText(item.house, lx, ly + 84);
    texts.push({ page: 0, x: lx, y: ly + 84, size: 24, text: `${item.house} - ${item.desc}` });

    c1.fillStyle = "rgba(18, 10, 14, 0.78)";
    setFont(c1, "sans", 19, { weight: 400 });
    ly = drawParagraph(c1, item.desc, lx, ly + 120, lw, 28) + 22;
  }
  c1.strokeStyle = "rgba(18, 10, 14, 0.16)";
  c1.beginPath();
  c1.moveTo(lx, ly);
  c1.lineTo(W - 88, ly);
  c1.stroke();

  // Middle band: Automotive & Marquee Event Partner (Omoda 2026) + Invitation Card
  const oy = 1076;
  c1.fillStyle = C.ink;
  setFont(c1, "display", 52, { weight: 400 });
  c1.fillText("On the guest list", 88, oy + 52);

  c1.fillStyle = "rgba(18, 10, 14, 0.78)";
  setFont(c1, "sans", 20, { weight: 400 });
  const oEnd = drawParagraph(
    c1,
    "Omoda, Chery’s South African automotive brand and the official vehicle partner of the Hollywoodbets Durban July, extended Dominic an official guest invitation to the 2026 event.",
    88,
    oy + 102,
    500,
    31,
  );
  texts.push({
    page: 0,
    x: 88,
    y: oy + 102,
    size: 18,
    text: "Omoda (Chery SA automotive brand, official Durban July vehicle partner) - 2026 official guest invitation",
  });

  // Bio-tagged Award Body Affiliations under "On the guest list"
  c1.fillStyle = C.ink;
  setFont(c1, "display", 28, { weight: 400 });
  c1.fillText("Award body affiliations in Dominic’s bio", 88, oEnd + 44);

  c1.fillStyle = "rgba(18, 10, 14, 0.78)";
  setFont(c1, "sans", 18, { weight: 500 });
  c1.fillText("Feather Awards SA (@feathersa) — Winner, 17th Feather Awards, 2025", 88, oEnd + 80);
  c1.fillText("SA Social Media Awards (@smawards_za) — Nominee, 2024", 88, oEnd + 110);
  links.push({ page: 0, x: 88, y: oEnd + 60, w: 500, h: 28, uri: "https://www.instagram.com/feathersa/" });
  links.push({ page: 0, x: 88, y: oEnd + 90, w: 500, h: 28, uri: "https://www.instagram.com/smawards_za/" });

  // Styled Omoda Invitation Card on the right
  const cardX = 660;
  const cardY = oy + 8;
  const cardW = 492;
  const cardH = 440;
  c1.save();
  c1.fillStyle = "#FAF3E8";
  c1.shadowColor = "rgba(28, 16, 22, 0.18)";
  c1.shadowBlur = 28;
  c1.shadowOffsetY = 12;
  c1.fillRect(cardX, cardY, cardW, cardH);
  c1.restore();

  c1.strokeStyle = "rgba(18, 10, 14, 0.22)";
  c1.lineWidth = 1.5;
  c1.strokeRect(cardX + 16, cardY + 16, cardW - 32, cardH - 32);

  c1.textAlign = "center";
  const cardMid = cardX + cardW / 2;
  c1.fillStyle = "rgba(18, 10, 14, 0.68)";
  setFont(c1, "display", 20, { italic: true });
  c1.fillText("With the compliments of", cardMid, cardY + 74);

  c1.fillStyle = C.ink;
  setFont(c1, "display", 60, { weight: 400 });
  c1.fillText("Omoda", cardMid, cardY + 140);

  c1.strokeStyle = C.marigold;
  c1.lineWidth = 2;
  c1.beginPath();
  c1.moveTo(cardMid - 90, cardY + 174);
  c1.lineTo(cardMid + 90, cardY + 174);
  c1.stroke();

  c1.fillStyle = C.ink;
  setFont(c1, "sans", 16, { weight: 700 });
  c1.fillText("Official guest", cardMid, cardY + 216);

  setFont(c1, "display", 32, { weight: 400 });
  c1.fillText("Hollywoodbets Durban July", cardMid, cardY + 258);

  c1.fillStyle = "rgba(18, 10, 14, 0.65)";
  setFont(c1, "sans", 18, { weight: 500 });
  c1.fillText("2026", cardMid, cardY + 290);

  c1.setLineDash([5, 5]);
  c1.strokeStyle = "rgba(18, 10, 14, 0.28)";
  c1.beginPath();
  c1.moveTo(cardX + 48, cardY + 330);
  c1.lineTo(cardX + cardW - 48, cardY + 330);
  c1.stroke();
  c1.setLineDash([]);

  c1.fillStyle = "rgba(18, 10, 14, 0.58)";
  setFont(c1, "sans", 15, { weight: 500 });
  c1.fillText("Admit", cardMid, cardY + 364);

  c1.fillStyle = C.ink;
  setFont(c1, "display", 28, { italic: true });
  c1.fillText("Dominic Zaca", cardMid, cardY + 400);
  c1.textAlign = "left";

  // Wax seal accent on Page 1
  drawWaxSeal(c1, cardX + 24, cardY + cardH - 18, 46);

  // Footer strip Page 1
  c1.fillStyle = "rgba(18, 10, 14, 0.55)";
  setFont(c1, "sans", 15, { weight: 500 });
  c1.fillText("Dominic Zaca — Brand Affiliations, Fashion & Fit (Page 1 of 2)", 88, H - 78);
  c1.textAlign = "right";
  c1.fillText("Continued: Fitting Room Sizes, Commercial Scope & Booking", W - 88, H - 78);
  c1.textAlign = "left";

  // ── PAGE 2: Fitting Room Hang-Tag, Commercial Services & Brand Fit ───────
  const p2 = document.createElement("canvas");
  p2.width = W;
  p2.height = H;
  const c2 = p2.getContext("2d")!;

  c2.fillStyle = C.plum;
  c2.fillRect(0, 0, W, H);

  // Fuchsia Flare upper accent panel on left for the garment swing tag
  c2.fillStyle = C.flare;
  c2.fillRect(88, 156, 430, 980);

  // Outer frame
  c2.strokeStyle = "rgba(243, 233, 220, 0.16)";
  c2.lineWidth = 1.5;
  c2.strokeRect(56, 56, W - 112, H - 112);

  // Header
  c2.fillStyle = C.bone;
  setFont(c2, "sans", 18, { weight: 600 });
  c2.fillText("Dominic Zaca — Brand Affiliations, Fashion & Fit", 88, 108);
  c2.textAlign = "right";
  c2.fillStyle = C.marigold;
  setFont(c2, "display", 20, { italic: true });
  c2.fillText("Sizing, Commercial Scope & Booking", W - 88, 108);
  c2.textAlign = "left";

  // Gold cord + Garment Swing Tag inside the Fuchsia panel
  const tagX = 148;
  const tagY = 270;
  const tagW = 310;
  const tagH = 660;

  c2.strokeStyle = C.marigold;
  c2.lineWidth = 3.5;
  c2.beginPath();
  c2.moveTo(tagX + tagW / 2, 156);
  c2.lineTo(tagX + tagW / 2, tagY + 42);
  c2.stroke();

  c2.save();
  c2.beginPath();
  c2.moveTo(tagX + 48, tagY);
  c2.lineTo(tagX + tagW - 48, tagY);
  c2.lineTo(tagX + tagW, tagY + 64);
  c2.lineTo(tagX + tagW, tagY + tagH);
  c2.lineTo(tagX, tagY + tagH);
  c2.lineTo(tagX, tagY + 64);
  c2.closePath();
  c2.fillStyle = C.bone;
  c2.fill();
  c2.restore();

  // Grommet hole
  c2.beginPath();
  c2.arc(tagX + tagW / 2, tagY + 44, 15, 0, Math.PI * 2);
  c2.fillStyle = C.flare;
  c2.fill();
  c2.lineWidth = 6;
  c2.strokeStyle = C.marigold;
  c2.stroke();

  c2.fillStyle = C.ink;
  setFont(c2, "display", 30, { weight: 400 });
  c2.fillText("Dominic Zaca", tagX + 32, tagY + 122);

  c2.fillStyle = "rgba(18, 10, 14, 0.68)";
  setFont(c2, "display", 20, { italic: true });
  c2.fillText("For the fitting room", tagX + 32, tagY + 158);

  const sizes: Array<[string, string]> = [
    ["Height", "1.64 m"],
    ["Shoe", "9"],
    ["Waist & shirt", "UK 24"],
  ];
  let sy2 = tagY + 196;
  for (const [k, v] of sizes) {
    c2.strokeStyle = "rgba(18, 10, 14, 0.15)";
    c2.lineWidth = 1.2;
    c2.beginPath();
    c2.moveTo(tagX + 32, sy2);
    c2.lineTo(tagX + tagW - 32, sy2);
    c2.stroke();

    c2.fillStyle = "rgba(18, 10, 14, 0.72)";
    setFont(c2, "sans", 17, { weight: 600 });
    c2.fillText(k, tagX + 32, sy2 + 48);

    c2.textAlign = "right";
    c2.fillStyle = C.ink;
    setFont(c2, "display", 38, { weight: 400 });
    c2.fillText(v, tagX + tagW - 32, sy2 + 52);
    c2.textAlign = "left";
    sy2 += 86;
  }
  texts.push({ page: 1, x: tagX, y: tagY + 240, size: 20, text: "Casting & physical measurements: Height 1.64m, Shoe size 9, Waist & shirt UK 24" });

  // Barcode on swing tag
  const bRand = rng(24);
  let bx2 = tagX + 32;
  c2.fillStyle = C.ink;
  while (bx2 < tagX + tagW - 32) {
    const bw2 = [1.5, 1.5, 3, 4.5][Math.floor(bRand() * 4)];
    const gap = [2, 3, 3, 4.5][Math.floor(bRand() * 4)];
    if (bx2 + bw2 <= tagX + tagW - 32) {
      c2.fillRect(bx2, tagY + 490, bw2, 68);
    }
    bx2 += bw2 + gap;
  }

  c2.fillStyle = "rgba(18, 10, 14, 0.62)";
  setFont(c2, "sans", 14, { weight: 600 });
  c2.fillText("ZACA-2026", tagX + 32, tagY + 590);
  c2.textAlign = "right";
  c2.fillText("Care: never tone down", tagX + tagW - 32, tagY + 590);
  c2.textAlign = "left";

  c2.fillStyle = C.bone;
  setFont(c2, "display", 22, { italic: true });
  c2.textAlign = "center";
  c2.fillText("Sizes for wardrobe and styling teams.", 88 + 215, 1038);
  c2.textAlign = "left";

  // Right column: "Book Dominic for" Services
  const sx0 = 568;
  const sw0 = W - sx0 - 88;
  c2.fillStyle = C.bone;
  setFont(c2, "display", 68, { weight: 400 });
  c2.fillText("Book Dominic for", sx0, 224);

  let svY = 266;
  for (const s of SERVICES) {
    c2.strokeStyle = "rgba(243, 233, 220, 0.18)";
    c2.lineWidth = 1.2;
    c2.beginPath();
    c2.moveTo(sx0, svY);
    c2.lineTo(W - 88, svY);
    c2.stroke();

    c2.fillStyle = C.marigold;
    setFont(c2, "display", 34, { weight: 400 });
    c2.fillText(s.title, sx0, svY + 46);

    c2.fillStyle = "rgba(243, 233, 220, 0.82)";
    setFont(c2, "sans", 18, { weight: 400 });
    c2.fillText(s.detail, sx0, svY + 78);

    svY += 108;
  }
  c2.strokeStyle = "rgba(243, 233, 220, 0.18)";
  c2.beginPath();
  c2.moveTo(sx0, svY);
  c2.lineTo(W - 88, svY);
  c2.stroke();

  // Brand fit summary box on right under services
  c2.fillStyle = "rgba(243, 233, 220, 0.78)";
  setFont(c2, "sans", 18, { weight: 400 });
  drawParagraph(
    c2,
    "Working across KwaZulu-Natal and Johannesburg in both English and isiZulu, Dominic brings creative direction and marketing consulting fluency to every brief.",
    sx0,
    svY + 48,
    sw0,
    28,
  );

  // Bottom Booking Block on Bone paper plate
  const botY = 1200;
  const botH = 436;
  c2.fillStyle = C.bone;
  c2.fillRect(88, botY, W - 176, botH);

  c2.fillStyle = C.ink;
  setFont(c2, "display", 54, { weight: 400 });
  c2.fillText("Send the brief, the date and the dress code.", 132, botY + 86);

  c2.fillStyle = "rgba(18, 10, 14, 0.72)";
  setFont(c2, "sans", 20, { weight: 500 });
  c2.fillText("Direct booking & brand partnership enquiries:", 132, botY + 136);

  c2.fillStyle = C.flare;
  setFont(c2, "display", 52, { italic: true });
  c2.fillText(EMAIL, 132, botY + 206);
  links.push({ page: 1, x: 132, y: botY + 160, w: 720, h: 60, uri: `mailto:${EMAIL}` });
  texts.push({ page: 1, x: 132, y: botY + 206, size: 28, text: `Book Dominic Zaca: ${EMAIL}` });

  c2.strokeStyle = "rgba(18, 10, 14, 0.15)";
  c2.beginPath();
  c2.moveTo(132, botY + 248);
  c2.lineTo(W - 132, botY + 248);
  c2.stroke();

  SOCIALS.forEach((s, idx) => {
    const sx = 132 + idx * 245;
    c2.fillStyle = "rgba(18, 10, 14, 0.56)";
    setFont(c2, "sans", 15, { weight: 600 });
    c2.fillText(s.platform, sx, botY + 292);
    c2.fillStyle = C.ink;
    setFont(c2, "display", 23, { weight: 400 });
    c2.fillText(s.handle, sx, botY + 322);
    if (s.href) {
      links.push({ page: 1, x: sx, y: botY + 274, w: 220, h: 58, uri: s.href });
    }
  });

  c2.fillStyle = C.ink;
  setFont(c2, "display", 24, { italic: true });
  c2.fillText("Book Dominic. Consider it a feather in your cap.", 132, botY + 392);

  // Footer strip Page 2
  c2.fillStyle = "rgba(243, 233, 220, 0.5)";
  setFont(c2, "sans", 15, { weight: 500 });
  c2.fillText("Dominic Zaca — Brand Affiliations, Fashion & Fit (Page 2 of 2)", 88, H - 78);
  c2.textAlign = "right";
  c2.fillText("Sample media kit dossier, 2026", W - 88, H - 78);
  c2.textAlign = "left";

  return { canvases: [p1, p2], links, texts };
}

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL, STANDARDS-COMPLIANT MULTI-PAGE PDF 1.4 COMPILER
// Embeds high-DPI JPEG page streams, searchable text layer, and clickable links
// ─────────────────────────────────────────────────────────────────────────────

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

function pdfEscape(str: string): string {
  return str
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function compilePdf(
  title: string,
  canvases: HTMLCanvasElement[],
  links: LinkRect[],
  texts: TextItem[],
): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0]; // 1-indexed PDF object offsets
  let cursor = 0;

  const pushStr = (s: string) => {
    const b = encoder.encode(s);
    chunks.push(b);
    cursor += b.byteLength;
  };
  const pushBytes = (b: Uint8Array) => {
    chunks.push(b);
    cursor += b.byteLength;
  };
  const startObj = (id: number) => {
    offsets[id] = cursor;
    pushStr(`${id} 0 obj\n`);
  };
  const endObj = () => {
    pushStr("\nendobj\n");
  };

  pushStr("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  // Object allocation:
  // 1: Catalog
  // 2: Pages
  // 3: Font (/F1 Helvetica for invisible searchable text layer)
  // 4: Info dictionary
  const pageCount = canvases.length;
  let nextId = 5;
  const pageObjIds: number[] = [];
  const imgObjIds: number[] = [];
  const contentObjIds: number[] = [];
  const annotObjIdsByPage: number[][] = [];

  for (let p = 0; p < pageCount; p++) {
    pageObjIds.push(nextId++);
    imgObjIds.push(nextId++);
    contentObjIds.push(nextId++);
    const pageLinks = links.filter((l) => l.page === p);
    annotObjIdsByPage.push(pageLinks.map(() => nextId++));
  }

  // 1: Catalog
  startObj(1);
  pushStr(`<< /Type /Catalog /Pages 2 0 R >>`);
  endObj();

  // 2: Pages
  startObj(2);
  pushStr(
    `<< /Type /Pages /Count ${pageCount} /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] >>`,
  );
  endObj();

  // 3: Font
  startObj(3);
  pushStr(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
  endObj();

  // 4: Info
  startObj(4);
  pushStr(
    `<< /Title (${pdfEscape(title)}) /Author (Dominic Zaca Media Kit) /Subject (Sample Media Kit 2026) /Creator (Dominic Zaca Media Kit) >>`,
  );
  endObj();

  // Per-page objects
  for (let p = 0; p < pageCount; p++) {
    const pageId = pageObjIds[p];
    const imgId = imgObjIds[p];
    const contentId = contentObjIds[p];
    const annotIds = annotObjIdsByPage[p];
    const pageLinks = links.filter((l) => l.page === p);
    const pageTexts = texts.filter((t) => t.page === p);

    const jpegDataUrl = canvases[p].toDataURL("image/jpeg", 0.9);
    const jpegBytes = dataUrlToBytes(jpegDataUrl);

    // Image XObject
    startObj(imgId);
    pushStr(
      `<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.byteLength} >>\nstream\n`,
    );
    pushBytes(jpegBytes);
    pushStr("\nendstream");
    endObj();

    // Content stream: draw full-bleed image + invisible searchable text items
    let stream = `q\n${PT_W.toFixed(2)} 0 0 ${PT_H.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
    if (pageTexts.length > 0) {
      stream += "BT\n3 Tr\n";
      for (const t of pageTexts) {
        const tx = ((t.x / W) * PT_W).toFixed(2);
        const ty = (((H - t.y) / H) * PT_H).toFixed(2);
        const fs = Math.max(8, Math.round((t.size / W) * PT_W));
        stream += `/F1 ${fs} Tf\n1 0 0 1 ${tx} ${ty} Tm\n(${pdfEscape(t.text)}) Tj\n`;
      }
      stream += "ET\n";
    }
    const streamBytes = encoder.encode(stream);
    startObj(contentId);
    pushStr(`<< /Length ${streamBytes.byteLength} >>\nstream\n`);
    pushBytes(streamBytes);
    pushStr("endstream");
    endObj();

    // Link Annotation objects
    for (let i = 0; i < pageLinks.length; i++) {
      const l = pageLinks[i];
      const x1 = ((l.x / W) * PT_W).toFixed(2);
      const y2 = (((H - l.y) / H) * PT_H).toFixed(2);
      const x2 = (((l.x + l.w) / W) * PT_W).toFixed(2);
      const y1 = (((H - (l.y + l.h)) / H) * PT_H).toFixed(2);
      startObj(annotIds[i]);
      pushStr(
        `<< /Type /Annot /Subtype /Link /Rect [${x1} ${y1} ${x2} ${y2}] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${pdfEscape(l.uri)}) >> >>`,
      );
      endObj();
    }

    // Page object
    startObj(pageId);
    const annotsPart =
      annotIds.length > 0 ? ` /Annots [${annotIds.map((id) => `${id} 0 R`).join(" ")}]` : "";
    pushStr(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PT_W.toFixed(2)} ${PT_H.toFixed(2)}] /Resources << /XObject << /Im0 ${imgId} 0 R >> /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R${annotsPart} >>`,
    );
    endObj();
  }

  // Cross-reference table
  const totalObjs = nextId;
  const xrefOffset = cursor;
  pushStr(`xref\n0 ${totalObjs}\n0000000000 65535 f \n`);
  for (let i = 1; i < totalObjs; i++) {
    const off = String(offsets[i] ?? 0).padStart(10, "0");
    pushStr(`${off} 00000 n \n`);
  }
  pushStr(
    `trailer\n<< /Size ${totalObjs} /Root 1 0 R /Info 4 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
  );

  const merged = new Uint8Array(cursor);
  let pos = 0;
  for (const chunk of chunks) {
    merged.set(chunk, pos);
    pos += chunk.byteLength;
  }
  return new Blob([merged.buffer], { type: "application/pdf" });
}

// Cache generated PDFs so repeated clicks or previews are instantaneous
const pdfCache = new Map<PdfKind, Promise<GeneratedPdf>>();

export function getGeneratedPdf(kind: PdfKind): Promise<GeneratedPdf> {
  const existing = pdfCache.get(kind);
  if (existing) return existing;

  const promise = (async (): Promise<GeneratedPdf> => {
    if (typeof document !== "undefined" && "fonts" in document) {
      try {
        await document.fonts.ready;
      } catch {
        // continue with fallback fonts if needed
      }
    }

    const isOverview = kind === "overview";
    const filename = isOverview
      ? "Dominic-Zaca-Overview-2026.pdf"
      : "Dominic-Zaca-Brand-Affiliations-2026.pdf";
    const title = isOverview
      ? "Dominic Zaca — Talent Overview (2026)"
      : "Dominic Zaca — Brand Affiliations, Fashion & Fit (2026)";

    const { canvases, links, texts } = isOverview
      ? await renderOverviewPages()
      : await renderBrandsPages();

    const pagePreviews = canvases.map((c) => c.toDataURL("image/jpeg", 0.86));
    const blob = compilePdf(title, canvases, links, texts);
    const url = URL.createObjectURL(blob);
    const sizeKb = Math.max(1, Math.round(blob.size / 1024));

    return { kind, filename, title, blob, url, pagePreviews, sizeKb };
  })();

  pdfCache.set(kind, promise);
  return promise;
}

export async function downloadPdf(kind: PdfKind): Promise<GeneratedPdf> {
  const pdf = await getGeneratedPdf(kind);
  const a = document.createElement("a");
  a.href = pdf.url;
  a.download = pdf.filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return pdf;
}
