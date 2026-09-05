import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/api";

export const runtime = "nodejs";
export const alt = "Mohamed Hanifa - Full Stack .NET & AI Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated on the fly from live profile data instead of a static asset, so
// the social-share preview (LinkedIn, Twitter/X, Slack, iMessage, etc.)
// always matches whatever the API currently returns.
export default async function OpengraphImage() {
  const profile = await getProfile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#090d16",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 32,
            fontWeight: 800,
            color: "#00f0ff",
            marginBottom: 48,
          }}
        >
          MH<span style={{ color: "#f1f5f9" }}>.dev</span>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.15 }}>
          {profile.name ?? "Mohamed Hanifa"}
        </div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 20, color: "#00f0ff", fontWeight: 700 }}>
          {profile.title ?? "Full Stack .NET Developer"}
        </div>
        {profile.tagline && (
          <div style={{ display: "flex", fontSize: 24, marginTop: 32, color: "#94a3b8" }}>
            {profile.tagline}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
