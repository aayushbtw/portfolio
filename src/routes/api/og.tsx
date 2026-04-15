import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse, loadGoogleFont } from "workers-og";
import { config } from "@/lib/config";

const OG_SIZE = { width: 1200, height: 630 };

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const title = url.searchParams.get("title") ?? config.name;
        const description =
          url.searchParams.get("description") ?? config.description;

        const fontData = await loadGoogleFont({
          family: "Inter",
          weight: 400,
          text: `${title}${description}`,
        });

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
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: "62px",
                  color: "#030712",
                  lineHeight: "1.1",
                  letterSpacing: "-0.15px",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: "34px",
                  color: "#6b7280",
                  lineHeight: "1.35",
                  letterSpacing: "-0.15px",
                  maxWidth: "75%",
                  textWrap: "pretty",
                }}
              >
                {description}
              </div>
            </div>
          </div>,
          {
            ...OG_SIZE,
            fonts: [
              {
                name: "Inter",
                data: fontData,
                weight: 400,
              },
            ],
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
