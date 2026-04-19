"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { VerticalGlassWheel } from "@/components/VerticalGlassWheel";
import { HUB_SLIDES } from "@/data/hub-slides";

/**
 * Floating header hub — replaces the hamburger outside the home page.
 * Starts **collapsed** (cap only); tap ש to open the dial dropdown.
 */
export function HubHeaderMezuzah() {
  const router = useRouter();

  const items = useMemo(() => {
    const base = HUB_SLIDES.map((s) => ({
      key: s.href,
      label: s.title,
      desc: s.desc,
      category: s.category,
      emoji: s.emoji,
    }));
    if (process.env.NEXT_PUBLIC_HIDE_DEVELOPER_NAV === "true") return base;
    return [
      ...base,
      {
        key: "/developer",
        label: "Developer",
        desc: "Tools and diagnostics for contributors.",
        category: "Advanced",
        emoji: "🛠️",
      },
    ];
  }, []);

  const onActivate = useCallback(
    (idx: number) => {
      const slide = items[idx];
      if (slide) router.push(slide.key);
    },
    [router, items],
  );

  return (
    <VerticalGlassWheel
      variant="header"
      defaultBodyOpen={false}
      items={items}
      onActivate={onActivate}
      actionLabel="Open hub →"
    />
  );
}
