import type { FundraisingMilestone } from "@/components/FundraisingPath";

/**
 * Example milestones (amounts + SVG viewBox positions). Tweak or replace as needed.
 * viewBox 0 0 1000 500 — `position` is in the same coordinates as the path.
 */
export const sampleFundraisingMilestones: FundraisingMilestone[] = [
  {
    amount: 2500,
    label: "Launch",
    description: "Minimum to open registration and materials",
    position: { x: 150, y: 180 },
  },
  {
    amount: 8000,
    label: "Scholarship fund",
    description: "Covers 12 student seats for the full term",
    position: { x: 300, y: 95 },
  },
  {
    amount: 18000,
    label: "Library & software",
    description: "Digital texts + lab licenses for one year",
    position: { x: 480, y: 195 },
  },
  {
    amount: 32000,
    label: "Faculty",
    description: "Part-time lead instructor and two TAs",
    position: { x: 600, y: 345 },
  },
  {
    amount: 50000,
    label: "Facilities",
    description: "Room rental and equipment through semester end",
    position: { x: 750, y: 365 },
  },
  {
    amount: 75000,
    label: "Stretch: expansion",
    description: "Add a second cohort and evening track",
    position: { x: 900, y: 175 },
  },
];
