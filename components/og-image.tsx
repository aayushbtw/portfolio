/** biome-ignore-all lint/performance/noImgElement: og does not work with <Image/> */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { config } from "@/lib/config";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const siteUrl = config.url.replace("https://", "");
const iconData = readFileSync(join(process.cwd(), "public/logo.png"), "base64");
const iconSrc = `data:image/png;base64,${iconData}`;

function Footer() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "20px",
        color: "#9ca3af",
      }}
    >
      <img
        alt="icon"
        height={28}
        src={iconSrc}
        style={{ borderRadius: "5px" }}
        width={28}
      />
      {siteUrl}
    </div>
  );
}

export function OGImage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return new ImageResponse(
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "4px",
          background: "#e06030",
          borderRadius: "2px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 600,
            color: "#030712",
            lineHeight: 1.1,
            letterSpacing: "-1px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#6b7280",
            lineHeight: 1.5,
            maxWidth: "760px",
          }}
        >
          {description}
        </div>
      </div>

      <Footer />
    </div>,
    { ...OG_SIZE }
  );
}
