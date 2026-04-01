import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "workers-og";

import { config } from "@/lib/config";

const OG_SIZE = { height: 630, width: 1200 };

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
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              padding: "80px",
              width: "100%",
            }}
          >
            <div
              style={{
                background: "#e06030",
                borderRadius: "2px",
                height: "4px",
                width: "48px",
              }}
            />

            <div
              style={{
                color: "#030712",
                fontSize: "62px",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
          </div>,
          {
            ...OG_SIZE,
            headers: {
              "Cache-Control": "public, max-age=31536000, immutable",
              "Content-Type": "image/png",
            },
          }
        );
      },
    },
  },
});
