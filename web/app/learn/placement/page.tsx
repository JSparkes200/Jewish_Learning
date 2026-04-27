import { PlacementPageClient } from "./PlacementPageClient";

export const metadata = {
  title: "Placement Quiz — Hebrew Yeshiva",
  description:
    "A quick 12-question quiz that finds your starting level so you jump straight into material that challenges without overwhelming.",
};

export default function PlacementPage() {
  return <PlacementPageClient />;
}
