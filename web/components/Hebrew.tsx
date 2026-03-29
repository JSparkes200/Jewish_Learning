import type { ReactNode } from "react";

type HebrewTag = "span" | "div" | "p" | "h1" | "h2" | "h3";

type HebrewProps = {
  as?: HebrewTag;
  children: ReactNode;
  className?: string;
};

/**
 * RTL + Hebrew font for any snippet. Root document stays LTR.
 */
export function Hebrew({ as: Tag = "span", children, className = "" }: HebrewProps) {
  return (
    <Tag dir="rtl" lang="he" className={`font-hebrew ${className}`.trim()}>
      {children}
    </Tag>
  );
}
