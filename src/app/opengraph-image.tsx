import { ImageResponse } from "next/og";

export const alt = "Lumen — Skincare with the percentages on the front";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, rendered at request time by Satori.
 *
 * Colours are hex rather than the site's OKLCH tokens: Satori implements a
 * subset of CSS and does not parse oklch(), so the palette is restated here as
 * its sRGB equivalents. Layout is flexbox only, for the same reason.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fdfcf9 0%, #f3efe6 55%, #e7efe9 100%)",
          padding: 72,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: 99,
              background: "#5a7d68",
            }}
          />
          <div
            style={{
              fontSize: 25,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#6b6157",
            }}
          >
            Lumen Skin Labs
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 86,
            lineHeight: 1.02,
            letterSpacing: -3.5,
            color: "#2b2621",
            maxWidth: 940,
          }}
        >
          Skincare with the percentages on the front.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 27,
            color: "#6b6157",
          }}
        >
          <div style={{ display: "flex" }}>
            Twelve products · No ten-step routine
          </div>
          <div style={{ display: "flex", color: "#5a7d68" }}>
            lumen-store.vercel.app
          </div>
        </div>
      </div>
    ),
    size,
  );
}
