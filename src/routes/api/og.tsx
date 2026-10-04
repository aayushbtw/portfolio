import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse, loadGoogleFont } from "workers-og";

import { MarkIcon } from "~/components/icons";
import { config } from "~/lib/config";

const OG_SIZE = { width: 1200, height: 630 };

// Satori renders with no stylesheet, so these are the color tokens resolved.
const OG_COLORS = {
  accent: "#111111",
  background: "#ffffff",
  textPrimary: "#202020",
  textSecondary: "#646464",
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
              background: OG_COLORS.background,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "80px",
            }}
          >
            <MarkIcon
              color={OG_COLORS.accent}
              height={56}
              // The glyph sits inset in its viewBox; this aligns it with the text.
              style={{ marginLeft: "-8px" }}
              width={56}
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
                  color: OG_COLORS.textPrimary,
                  lineHeight: "1.1",
                  // Satori takes px, so the scale's em values are resolved
                  // here. -1.38px is -0.0223em.
                  letterSpacing: "-1.38px",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: "34px",
                  color: OG_COLORS.textSecondary,
                  lineHeight: "1.35",
                  // -0.74px is -0.0218em.
                  letterSpacing: "-0.74px",
                  width: "780px",
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
              // Social crawlers must fetch it, so it's kept out of search here, not in robots.txt.
              "X-Robots-Tag": "noindex",
            },
          }
        );
      },
    },
  },
});
