/**
 * Progressive roots study path: small groups of static שׁוֹרֶשׁ families,
 * then checkpoint reviews every {@link ROOTS_GROUPS_PER_CHECKPOINT} groups.
 */

export type RootsGroupProgress = {
  introSeen?: boolean;
  /** Correct picks in the group drill (unlocks the mixed test). */
  drillHits?: number;
  testPassed?: boolean;
};

export type RootsCurriculumProgress = {
  groups: Record<string, RootsGroupProgress>;
  /** Block checkpoints passed (0 = after first four groups, …). */
  checkpointsPassed?: number[];
};

export const ROOTS_GROUPS_PER_CHECKPOINT = 4;

export type RootsCurriculumGroupMeta = {
  id: string;
  title: string;
  /** One-line aim for the intro card */
  blurb: string;
  /** Indices into {@link STATIC_ROOT_FAMILIES} */
  familyIndices: readonly number[];
};

/** Ten static families split into four study groups (3 + 3 + 2 + 2). */
export const ROOTS_GROUPS: readonly RootsCurriculumGroupMeta[] = [
  {
    id: "roots-g0",
    title: "Group 1 — Motion, writing, speech",
    blurb: "Three high-utility roots: going, writing, and saying.",
    familyIndices: [0, 1, 2],
  },
  {
    id: "roots-g1",
    title: "Group 2 — Mind & senses",
    blurb: "Knowing, seeing, and hearing — perception and awareness.",
    familyIndices: [3, 4, 5],
  },
  {
    id: "roots-g2",
    title: "Group 3 — Heart & arrival",
    blurb: "Love and coming; emotional and motion vocabulary.",
    familyIndices: [6, 7],
  },
  {
    id: "roots-g3",
    title: "Group 4 — Giving & wholeness",
    blurb: "Giving, peace, and completion — very common in modern Hebrew.",
    familyIndices: [8, 9],
  },
];
