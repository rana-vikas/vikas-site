import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const alt = "Vikas Rana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

export default async function Image() {
  const profile = await db.profile.findFirst();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#07090D",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(105,221,255,0.25), transparent 55%), radial-gradient(circle at 85% 80%, rgba(155,131,255,0.25), transparent 55%)",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 600, color: "#F4F7FB" }}>
          {profile?.headline ?? "Vikas Rana"}
        </div>
        <div style={{ fontSize: 36, color: "#99A4B5", marginTop: 24 }}>
          {profile?.tagline ?? "Different Worlds. One Person."}
        </div>
      </div>
    ),
    { ...size },
  );
}
