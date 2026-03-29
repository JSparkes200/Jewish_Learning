import type { MetadataRoute } from "next";

const shortcutIcon: NonNullable<
  MetadataRoute.Manifest["shortcuts"]
>[number]["icons"] = [
  {
    src: "/hebrew-icon.svg",
    sizes: "512x512",
    type: "image/svg+xml",
  },
];

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hebrew — Yeshiva",
    short_name: "Hebrew",
    description: "Hebrew learning — course, drills, library (Next.js app)",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f5ecd8",
    theme_color: "#f5ecd8",
    categories: ["education", "books"],
    icons: [
      {
        src: "/hebrew-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/hebrew-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Learn",
        short_name: "Learn",
        description: "Course path (Aleph–Dalet)",
        url: "/learn",
        icons: shortcutIcon,
      },
      {
        name: "Roots",
        short_name: "Roots",
        description: "Shoresh families and drill",
        url: "/roots",
        icons: shortcutIcon,
      },
      {
        name: "Study",
        short_name: "Study",
        description: "Review hub",
        url: "/study",
        icons: shortcutIcon,
      },
      {
        name: "Numbers",
        short_name: "Numbers",
        description: "Counting, days, ordinals",
        url: "/numbers",
        icons: shortcutIcon,
      },
      {
        name: "Reading",
        short_name: "Reading",
        description: "Stories and guided reading",
        url: "/reading",
        icons: shortcutIcon,
      },
    ],
  };
}
