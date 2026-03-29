import { notFound } from "next/navigation";
import {
  SPECIALTY_TRACK_IDS,
  SPECIALTY_TIER_IDS,
  type SpecialtyTierId,
} from "@/data/specialty-tracks";
import { SpecialtyTierClient } from "./SpecialtyTierClient";

type Props = {
  params: Promise<{ trackId: string; tier: string }>;
};

export default async function SpecialtyTierPage({ params }: Props) {
  const { trackId: rawTrack, tier: rawTier } = await params;
  const trackId = decodeURIComponent(rawTrack);
  const tierRaw = decodeURIComponent(rawTier);
  if (!SPECIALTY_TRACK_IDS.includes(trackId)) notFound();
  if (!SPECIALTY_TIER_IDS.includes(tierRaw as SpecialtyTierId)) notFound();
  const tier = tierRaw as SpecialtyTierId;
  return <SpecialtyTierClient trackId={trackId} tier={tier} />;
}
