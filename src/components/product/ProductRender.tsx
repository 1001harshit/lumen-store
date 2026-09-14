import type { Artwork } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Generated product imagery.
 *
 * Every "photograph" in this store is drawn here from the product's `art`
 * config — a few hundred bytes of inline SVG that scale to any viewport,
 * re-tint per product, and inherit the theme, so a dark-mode product shot is
 * genuinely dark rather than a white JPEG punched into a dark page.
 *
 * Geometry is authored against a 400x500 viewBox and deliberately fills it.
 * An earlier pass had the vessels at ~14% of frame area, which left every card
 * reading as a mostly-empty panel with a small object adrift in the middle;
 * these occupy roughly half the frame and sit on a full-bleed ground, which is
 * what makes a grid of them feel composed rather than sparse.
 */

/**
 * Midpoint of two hue angles, taking the short way round the wheel.
 *
 * A plain (a + b) / 2 breaks whenever a pair straddles 0°: Retinal runs
 * 28° -> 352°, which are 36° apart, but the naive mean lands on 190° — the
 * opposite side of the wheel — painting a teal band through a maroon bottle.
 */
function midHue(from: number, to: number) {
  const delta = ((to - from + 540) % 360) - 180;
  return (from + delta / 2 + 360) % 360;
}

type Vessel = {
  /** Main silhouette. */
  body: string;
  /** Closure — cap, lid or pump head. */
  cap: string;
  /** Label panel on the face of the vessel. */
  label: string;
  /** Fill line, drawn clipped inside the body. */
  fillY: number;
  /** Horizontal centre of the label, for the printed rules. */
  labelX: number;
  labelW: number;
};

const VESSELS: Record<Artwork["vessel"], Vessel> = {
  dropper: {
    body: "M112 196 Q112 168 140 162 L260 162 Q288 168 288 196 L288 438 Q288 470 256 470 L144 470 Q112 470 112 438 Z",
    cap: "M158 34 Q158 24 168 24 L232 24 Q242 24 242 34 L242 132 Q242 142 232 142 L168 142 Q158 142 158 132 Z M148 142 L252 142 L252 166 L148 166 Z",
    label: "M128 250 L272 250 L272 396 L128 396 Z",
    fillY: 246,
    labelX: 148,
    labelW: 104,
  },
  pump: {
    body: "M104 212 Q104 182 134 176 L266 176 Q296 182 296 212 L296 440 Q296 472 264 472 L136 472 Q104 472 104 440 Z",
    cap: "M176 96 L224 96 L224 176 L176 176 Z M132 44 Q132 34 142 34 L214 34 Q224 34 224 44 L224 70 L176 70 L176 96 L132 96 Z M132 70 L176 70 L176 96 L132 96 Z",
    label: "M120 262 L280 262 L280 404 L120 404 Z",
    fillY: 258,
    labelX: 142,
    labelW: 116,
  },
  tube: {
    body: "M118 158 L282 158 L306 424 Q310 470 264 470 L136 470 Q90 470 94 424 Z",
    cap: "M160 52 Q160 42 170 42 L230 42 Q240 42 240 52 L240 158 L160 158 Z",
    label: "M128 244 L272 244 L286 404 L114 404 Z",
    fillY: 240,
    labelX: 148,
    labelW: 104,
  },
  jar: {
    body: "M74 214 Q74 196 98 196 L302 196 Q326 196 326 214 L326 416 Q326 462 280 462 L120 462 Q74 462 74 416 Z",
    cap: "M78 142 Q78 128 96 128 L304 128 Q322 128 322 142 L322 182 Q322 198 302 198 L98 198 Q78 198 78 182 Z",
    label: "M112 268 L288 268 L288 392 L112 392 Z",
    fillY: 264,
    labelX: 140,
    labelW: 120,
  },
  bottle: {
    body: "M108 258 Q108 214 140 194 L164 180 L236 180 L260 194 Q292 214 292 258 L292 436 Q292 470 258 470 L142 470 Q108 470 108 436 Z",
    cap: "M164 36 Q164 26 174 26 L226 26 Q236 26 236 36 L236 96 L164 96 Z M168 96 L232 96 L236 182 L164 182 Z",
    label: "M124 278 L276 278 L276 404 L124 404 Z",
    fillY: 274,
    labelX: 146,
    labelW: 108,
  },
};

type ProductRenderProps = {
  art: Artwork;
  /** Keys the gradient ids so multiple renders can share a page. */
  id: string;
  className?: string;
  /** Second angle of the pair — used for the hover swap on product cards. */
  alternate?: boolean;
};

export function ProductRender({
  art,
  id,
  className,
  alternate = false,
}: ProductRenderProps) {
  const vessel = VESSELS[art.vessel];
  const { hueFrom, hueTo, chroma } = art;

  // The alternate view rotates the gradient and swings the light to the other
  // side, so the hover swap reads as a second photograph of the same object
  // rather than the same image re-tinted.
  const from = alternate ? hueTo : hueFrom;
  const to = alternate ? hueFrom : hueTo;
  const mid = midHue(from, to);
  const lit = alternate ? "right" : "left";

  const uid = `${id}${alternate ? "-alt" : ""}`;

  return (
    <svg
      viewBox="0 0 400 500"
      className={cn("h-full w-full", className)}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`ground-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={`oklch(0.94 ${chroma * 0.5} ${from})`} />
          <stop offset="55%" stopColor={`oklch(0.89 ${chroma * 0.62} ${mid})`} />
          <stop offset="100%" stopColor={`oklch(0.82 ${chroma * 0.72} ${to})`} />
        </linearGradient>

        <radialGradient id={`glow-${uid}`} cx={lit === "left" ? "30%" : "70%"} cy="26%" r="62%">
          <stop offset="0%" stopColor={`oklch(0.99 ${chroma * 0.3} ${from} / 0.95)`} />
          <stop offset="100%" stopColor="oklch(0.99 0 0 / 0)" />
        </radialGradient>

        <radialGradient id={`corner-${uid}`} cx={lit === "left" ? "88%" : "12%"} cy="88%" r="58%">
          <stop offset="0%" stopColor={`oklch(0.72 ${chroma} ${to} / 0.5)`} />
          <stop offset="100%" stopColor="oklch(0.72 0 0 / 0)" />
        </radialGradient>

        <linearGradient id={`body-${uid}`} x1={lit === "left" ? "0" : "1"} y1="0" x2={lit === "left" ? "1" : "0"} y2="0.7">
          <stop offset="0%" stopColor={`oklch(0.88 ${chroma * 0.9} ${from})`} />
          <stop offset="38%" stopColor={`oklch(0.74 ${chroma * 1.25} ${mid})`} />
          <stop offset="100%" stopColor={`oklch(0.5 ${chroma * 0.95} ${to})`} />
        </linearGradient>

        <linearGradient id={`liquid-${uid}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={`oklch(0.68 ${chroma * 1.5} ${to} / 0.55)`} />
          <stop offset="100%" stopColor={`oklch(0.45 ${chroma * 1.2} ${to} / 0.72)`} />
        </linearGradient>

        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`oklch(0.46 ${chroma * 0.5} ${to})`} />
          <stop offset="42%" stopColor={`oklch(0.66 ${chroma * 0.62} ${to})`} />
          <stop offset="100%" stopColor={`oklch(0.4 ${chroma * 0.45} ${to})`} />
        </linearGradient>

        <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0.72)" />
          <stop offset="60%" stopColor="oklch(1 0 0 / 0.18)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
        </linearGradient>

        <clipPath id={`clip-${uid}`}>
          <path d={vessel.body} />
        </clipPath>

        <filter id={`blur-${uid}`} x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="22" />
        </filter>

        {/* Fine grain — stops the large flat colour fields from banding. */}
        <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Full-bleed ground — the frame is never empty cream. */}
      <rect width="400" height="500" fill={`url(#ground-${uid})`} />
      <rect width="400" height="500" fill={`url(#corner-${uid})`} />
      <rect width="400" height="500" fill={`url(#glow-${uid})`} />

      {/* Horizon, to seat the object in a space rather than on a flat field. */}
      <ellipse
        cx="200"
        cy="508"
        rx="230"
        ry="86"
        fill={`oklch(0.97 ${chroma * 0.25} ${from} / 0.75)`}
      />

      <ellipse
        cx={lit === "left" ? "292" : "108"}
        cy="452"
        rx="130"
        ry="30"
        fill={`oklch(0.42 ${chroma * 0.7} ${to} / 0.4)`}
        filter={`url(#blur-${uid})`}
      />

      <path d={vessel.cap} fill={`url(#cap-${uid})`} />
      <path d={vessel.body} fill={`url(#body-${uid})`} />

      <g clipPath={`url(#clip-${uid})`}>
        {/* Contents, with a visible fill line. */}
        <rect
          x="0"
          y={vessel.fillY}
          width="400"
          height={500 - vessel.fillY}
          fill={`url(#liquid-${uid})`}
        />
        <rect
          x="0"
          y={vessel.fillY}
          width="400"
          height="2.5"
          fill={`oklch(0.94 ${chroma * 0.5} ${from} / 0.7)`}
        />

        {/* Specular band down the lit edge. */}
        <rect
          x={lit === "left" ? "126" : "244"}
          y="120"
          width="30"
          height="360"
          rx="15"
          fill={`url(#shine-${uid})`}
        />
        {/* Narrow catch-light on the opposite edge. */}
        <rect
          x={lit === "left" ? "268" : "112"}
          y="200"
          width="10"
          height="230"
          rx="5"
          fill="oklch(1 0 0 / 0.22)"
        />
      </g>

      {/* Label panel and printed rules. */}
      <path d={vessel.label} fill="oklch(0.985 0.005 85 / 0.94)" />
      <rect
        x={vessel.labelX}
        y="300"
        width={vessel.labelW}
        height="7"
        rx="3.5"
        fill={`oklch(0.44 ${chroma} ${to})`}
      />
      <rect
        x={vessel.labelX}
        y="320"
        width={vessel.labelW * 0.62}
        height="5"
        rx="2.5"
        fill={`oklch(0.64 ${chroma * 0.7} ${to})`}
      />
      <rect
        x={vessel.labelX}
        y="336"
        width={vessel.labelW * 0.4}
        height="5"
        rx="2.5"
        fill={`oklch(0.74 ${chroma * 0.45} ${to})`}
      />

      <rect
        width="400"
        height="500"
        filter={`url(#grain-${uid})`}
        opacity="0.055"
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}
