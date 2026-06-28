import type { Artwork } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Generated product imagery.
 *
 * Every "photograph" in this store is drawn here from the product's `art`
 * config. That is a deliberate choice over stock photography: the renders are
 * a few hundred bytes of inline SVG, they scale to any viewport without an
 * image pipeline, they re-tint per product from two hue angles, and they
 * inherit the theme — a dark-mode product shot is genuinely dark rather than a
 * white JPEG punched into a dark page.
 *
 * Geometry is authored against a 400x500 viewBox.
 */

const VESSELS: Record<Artwork["vessel"], { body: string; cap: string; label: string }> = {
  dropper: {
    body: "M150 190 Q150 176 164 176 L236 176 Q250 176 250 190 L250 408 Q250 430 228 430 L172 430 Q150 430 150 408 Z",
    cap: "M178 96 Q178 88 186 88 L214 88 Q222 88 222 96 L222 168 Q222 176 214 176 L186 176 Q178 176 178 168 Z",
    label: "M158 262 L242 262 L242 348 L158 348 Z",
  },
  pump: {
    body: "M144 196 Q144 180 160 180 L240 180 Q256 180 256 196 L256 412 Q256 432 236 432 L164 432 Q144 432 144 412 Z",
    cap: "M182 118 L218 118 L218 180 L182 180 Z M164 96 Q164 88 172 88 L228 88 Q236 88 236 96 L236 118 L164 118 Z",
    label: "M154 258 L246 258 L246 352 L154 352 Z",
  },
  tube: {
    body: "M158 168 L242 168 L256 400 Q258 430 228 430 L172 430 Q142 430 144 400 Z",
    cap: "M172 112 Q172 104 180 104 L220 104 Q228 104 228 112 L228 168 L172 168 Z",
    label: "M160 240 L240 240 L246 356 L154 356 Z",
  },
  jar: {
    body: "M120 236 Q120 222 136 222 L264 222 Q280 222 280 236 L280 386 Q280 418 248 418 L152 418 Q120 418 120 386 Z",
    cap: "M110 168 Q110 156 124 156 L276 156 Q290 156 290 168 L290 214 Q290 222 278 222 L122 222 Q110 222 110 214 Z",
    label: "M140 272 L260 272 L260 344 L140 344 Z",
  },
  bottle: {
    body: "M140 232 Q140 210 158 198 L172 188 L228 188 L242 198 Q260 210 260 232 L260 404 Q260 430 234 430 L166 430 Q140 430 140 404 Z",
    cap: "M180 100 Q180 92 188 92 L212 92 Q220 92 220 100 L220 188 L180 188 Z",
    label: "M150 268 L250 268 L250 352 L150 352 Z",
  },
};

type ProductRenderProps = {
  art: Artwork;
  /** Used to key the gradient ids so multiple renders can share a page. */
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
  // side, which reads as a second photograph of the same object rather than
  // the same image tinted differently.
  const from = alternate ? hueTo : hueFrom;
  const to = alternate ? hueFrom : hueTo;
  const lightX = alternate ? "72%" : "28%";

  const uid = `${id}${alternate ? "-alt" : ""}`;

  return (
    <svg
      viewBox="0 0 400 500"
      className={cn("h-full w-full", className)}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`oklch(0.86 ${chroma} ${from})`} />
          <stop offset="48%" stopColor={`oklch(0.72 ${chroma * 1.15} ${(from + to) / 2})`} />
          <stop offset="100%" stopColor={`oklch(0.54 ${chroma * 0.9} ${to})`} />
        </linearGradient>

        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`oklch(0.42 ${chroma * 0.5} ${to})`} />
          <stop offset="50%" stopColor={`oklch(0.58 ${chroma * 0.6} ${to})`} />
          <stop offset="100%" stopColor={`oklch(0.34 ${chroma * 0.45} ${to})`} />
        </linearGradient>

        <radialGradient id={`halo-${uid}`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={`oklch(0.9 ${chroma * 0.8} ${from} / 0.85)`} />
          <stop offset="62%" stopColor={`oklch(0.9 ${chroma * 0.5} ${from} / 0.22)`} />
          <stop offset="100%" stopColor={`oklch(0.9 0 0 / 0)`} />
        </radialGradient>

        <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0.55)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0.02)" />
        </linearGradient>

        <clipPath id={`clip-${uid}`}>
          <path d={vessel.body} />
        </clipPath>

        <filter id={`soft-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      {/* Studio backdrop */}
      <circle cx="200" cy="238" r="168" fill={`url(#halo-${uid})`} />

      {/* Contact shadow — grounds the vessel so it does not float in space */}
      <ellipse
        cx="200"
        cy="438"
        rx="92"
        ry="16"
        fill={`oklch(0.32 ${chroma * 0.4} ${to} / 0.34)`}
        filter={`url(#soft-${uid})`}
      />

      <path d={vessel.cap} fill={`url(#cap-${uid})`} />
      <path d={vessel.body} fill={`url(#body-${uid})`} />

      {/* Specular band, clipped to the silhouette */}
      <g clipPath={`url(#clip-${uid})`}>
        <rect
          x={lightX === "28%" ? "150" : "224"}
          y="150"
          width="26"
          height="300"
          rx="13"
          fill={`url(#shine-${uid})`}
        />
        <rect
          x="0"
          y="352"
          width="400"
          height="100"
          fill={`oklch(0.3 ${chroma * 0.5} ${to} / 0.28)`}
        />
      </g>

      {/* Label band */}
      <path d={vessel.label} fill="oklch(0.98 0.006 85 / 0.92)" />
      <rect
        x={art.vessel === "jar" ? "156" : "170"}
        y={art.vessel === "jar" ? "292" : "288"}
        width={art.vessel === "jar" ? "88" : "60"}
        height="5"
        rx="2.5"
        fill={`oklch(0.5 ${chroma} ${to})`}
      />
      <rect
        x={art.vessel === "jar" ? "156" : "170"}
        y={art.vessel === "jar" ? "306" : "302"}
        width={art.vessel === "jar" ? "56" : "38"}
        height="4"
        rx="2"
        fill={`oklch(0.68 ${chroma * 0.6} ${to})`}
      />
    </svg>
  );
}
