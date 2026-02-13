import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 256,
  height: 256,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent", // Transparent background as requested
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="210" // Scaled up to fill the canvas
        height="210"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F51A28" // Alan Wake Neon Teal
        strokeWidth="2" // Relative to the 24px viewbox, this will be nice and thick when scaled
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Lucide Anchor Paths */}
        <path d="M12 6v16" />
        <path d="m19 13 2-1a9 9 0 0 1-18 0l2 1" />
        <path d="M9 11h6" />
        <circle cx="12" cy="4" r="2" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
