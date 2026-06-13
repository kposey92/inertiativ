import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

const OPACITIES = [0.15, 0.32, 0.5, 0.68, 0.84, 1];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111110",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 46 }}>
          {[0, 1].map((row) => (
            <div key={row} style={{ display: "flex", gap: 46 }}>
              {[0, 1, 2].map((col) => (
                <div
                  key={col}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "#f0ede8",
                    opacity: OPACITIES[row * 3 + col],
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
