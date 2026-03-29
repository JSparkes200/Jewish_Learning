export type McqItem = {
  id: string;
  promptHe: string;
  correctEn: string;
  distractorsEn: string[];
};

export type McqDrillPack = {
  kind: "mcq";
  title: string;
  intro?: string;
  items: McqItem[];
};
