"use client";

import { useCallback, useMemo } from "react";
import { CoverFlowCarousel } from "@/components/CoverFlowCarousel";
import type { LibraryExternalLink } from "@/data/library-external-links";

/**
 * 3D cover flow for external library links — shared implementation with
 * {@link CoverFlowCarousel} (same as Reading passage carousel).
 */
export function LibraryCoverCarousel({
  links,
}: {
  links: readonly LibraryExternalLink[];
}) {
  const items = useMemo(
    () =>
      links.map((l) => ({
        key: l.href,
        label: l.label,
        desc: l.desc,
        category: "External",
        iconSrc: l.iconSrc,
      })),
    [links],
  );

  const onActivateCenter = useCallback(
    (centerIndex: number) => {
      const href = links[centerIndex]?.href;
      if (href) window.open(href, "_blank", "noopener,noreferrer");
    },
    [links],
  );

  if (items.length === 0) return null;

  return (
    <CoverFlowCarousel
      items={items}
      eyebrow="Explore"
      title="Resource carousel"
      description={
        <>
          Drag sideways or use arrows. Center card opens the site. Icons are
          app-themed SVGs in{" "}
          <code className="rounded bg-parchment-deep/60 px-1 text-[10px]">
            /public/brand/
          </code>
          ; see{" "}
          <code className="text-[10px]">ATTRIBUTION.txt</code> for external art
          references.
        </>
      }
      onActivateCenter={onActivateCenter}
      prevAriaLabel="Previous resource"
      nextAriaLabel="Next resource"
    />
  );
}
