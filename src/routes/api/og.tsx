import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "workers-og";
import { config } from "@/lib/config";

const OG_SIZE = { width: 1200, height: 630 };

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const title = url.searchParams.get("title") ?? config.ogTitle;

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

            <div
              style={{
                fontSize: "62px",
                color: "#030712",
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              {title}
            </div>
          </div>,
          {
            ...OG_SIZE,
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          }
        );
      },
    },
  },
});
