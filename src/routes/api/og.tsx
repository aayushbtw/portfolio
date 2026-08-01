import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse, loadGoogleFont } from "workers-og";
import { config } from "~/lib/config";

const OG_SIZE = { width: 1200, height: 630 };

/* Satori rasterises this on the edge with no stylesheet, so it cannot read the
   @theme tokens. These are those tokens resolved to sRGB; keep them in step. */
const OG_COLORS = {
  bg1: "#ffffff",
  fg1: "#030712",
  fg2: "#6b7280",
  brand: "#e06030",
};

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
              background: OG_COLORS.bg1,
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
                background: OG_COLORS.brand,
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
                  color: OG_COLORS.fg1,
                  lineHeight: "1.1",
                  // -0.0223em, same Inter curve as the text scale. Satori takes
                  // px, so these are the em values resolved at each size.
                  letterSpacing: "-1.38px",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: "34px",
                  color: OG_COLORS.fg2,
                  lineHeight: "1.35",
                  letterSpacing: "-0.74px", // -0.0218em
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
