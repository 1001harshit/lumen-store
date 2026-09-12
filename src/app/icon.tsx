import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated favicon — the wordmark's L on the brand sage. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5a7d68",
          color: "#fdfcf9",
          fontSize: 21,
          fontFamily: "serif",
          borderRadius: 7,
        }}
      >
        L
      </div>
    ),
    size,
  );
}
