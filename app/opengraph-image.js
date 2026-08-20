import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/api";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";

export default async function Image() {
  const profile = await getProfile();
  const name = profile?.name || "Your Name";
  const title = profile?.title || "Full Stack .NET Developer";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage: "radial-gradient(circle at 30% 20%, #4338ca66 0%, transparent 55%), radial-gradient(circle at 75% 75%, #7e22ce66 0%, transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          {name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div style={{ display: "flex", color: "#a1a1aa", fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
          {name}
        </div>
        <div style={{ display: "flex", color: "#fafafa", fontSize: 60, fontWeight: 700, marginTop: 12 }}>
          {title}
        </div>
        <div style={{ display: "flex", color: "#818cf8", fontSize: 26, marginTop: 28 }}>
          AI Portfolio Assistant · MCP · .NET
        </div>
      </div>
    ),
    { ...size },
  );
}
