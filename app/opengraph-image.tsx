import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/seo";

export const alt = "SaaS Alternatives — open-source & free alternatives to the SaaS you already use";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          color: "#fafafa",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "#16a34a",
              color: "#ffffff",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 700 }}>
            SaaS Alternatives
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "860px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Swap your SaaS for open-source tools.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              lineHeight: 1.5,
              color: "#a1a1aa",
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            color: "#71717a",
          }}
        >
          Find alternatives to Vercel, Zapier, Notion and 180+ more.
        </div>
      </div>
    ),
    size,
  );
}