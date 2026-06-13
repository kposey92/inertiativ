import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InertiaTIV — Digital Planner",
    short_name: "InertiaTIV",
    description: "A digital planner with AI-assisted task suggestions.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111110",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
