import { STATIC_ROOT_FAMILIES, type CourseRootFamily } from "@/data/course-roots";
import {
  ROOTS_GROUPS,
  ROOTS_GROUPS_PER_CHECKPOINT,
  type RootsCurriculumProgress,
} from "@/data/roots-curriculum";

export const ROOTS_DRILL_HITS_TO_TEST = 6;
export const ROOTS_TEST_QUESTION_COUNT = 6;
export const ROOTS_TEST_PASS_MIN = 5;
export const ROOTS_CHECKPOINT_QUESTION_COUNT = 8;
export const ROOTS_CHECKPOINT_PASS_MIN = 6;

export function familiesForCurriculumGroup(
  groupIndex: number,
): CourseRootFamily[] {
  const meta = ROOTS_GROUPS[groupIndex];
  if (!meta) return [];
  return meta.familyIndices.map((i) => STATIC_ROOT_FAMILIES[i]!);
}

export function isRootsGroupUnlocked(
  rc: RootsCurriculumProgress | undefined,
  groupIndex: number,
): boolean {
  if (groupIndex <= 0) return true;
  const prevId = ROOTS_GROUPS[groupIndex - 1]?.id;
  if (!prevId) return false;
  if (!rc?.groups[prevId]?.testPassed) return false;
  if (
    groupIndex >= ROOTS_GROUPS_PER_CHECKPOINT &&
    groupIndex % ROOTS_GROUPS_PER_CHECKPOINT === 0
  ) {
    const checkpointIdx = groupIndex / ROOTS_GROUPS_PER_CHECKPOINT - 1;
    return rc.checkpointsPassed?.includes(checkpointIdx) ?? false;
  }
  return true;
}

/** After these groups all have `testPassed`, learner must pass checkpoint `blockIndex` before later groups (if any). */
export function checkpointNeeded(
  rc: RootsCurriculumProgress | undefined,
): number | null {
  const cpPassed = new Set(rc?.checkpointsPassed ?? []);
  for (let b = 0; ; b++) {
    const start = b * ROOTS_GROUPS_PER_CHECKPOINT;
    if (start >= ROOTS_GROUPS.length) break;
    const end = Math.min(
      start + ROOTS_GROUPS_PER_CHECKPOINT,
      ROOTS_GROUPS.length,
    );
    let allPassed = true;
    for (let k = start; k < end; k++) {
      const id = ROOTS_GROUPS[k]!.id;
      if (!rc?.groups[id]?.testPassed) {
        allPassed = false;
        break;
      }
    }
    if (allPassed && !cpPassed.has(b)) return b;
  }
  return null;
}

export function firstIncompleteGroupIndex(
  rc: RootsCurriculumProgress | undefined,
): number | null {
  for (let k = 0; k < ROOTS_GROUPS.length; k++) {
    const id = ROOTS_GROUPS[k]!.id;
    if (!rc?.groups[id]?.testPassed) return k;
  }
  return null;
}

export type RootsCurriculumPhase = "intro" | "drill" | "test";

export type RootsCurriculumDerivedView =
  | {
      kind: "group";
      groupIndex: number;
      phase: RootsCurriculumPhase;
      locked: boolean;
    }
  | { kind: "checkpoint"; checkpointIndex: number }
  | { kind: "complete" };

export function deriveRootsCurriculumView(
  rc: RootsCurriculumProgress | undefined,
): RootsCurriculumDerivedView {
  const inc = firstIncompleteGroupIndex(rc);
  if (inc != null) {
    const locked = !isRootsGroupUnlocked(rc, inc);
    const id = ROOTS_GROUPS[inc]!.id;
    const g = rc?.groups[id] ?? {};
    if (locked) {
      return { kind: "group", groupIndex: inc, phase: "intro", locked: true };
    }
    if (!g.introSeen) {
      return { kind: "group", groupIndex: inc, phase: "intro", locked: false };
    }
    if ((g.drillHits ?? 0) < ROOTS_DRILL_HITS_TO_TEST) {
      return { kind: "group", groupIndex: inc, phase: "drill", locked: false };
    }
    return { kind: "group", groupIndex: inc, phase: "test", locked: false };
  }
  const cp = checkpointNeeded(rc);
  if (cp != null) return { kind: "checkpoint", checkpointIndex: cp };
  return { kind: "complete" };
}

/** Inclusive family index range covered by a checkpoint block. */
export function checkpointBlockFamilyIndexRange(
  checkpointIndex: number,
): { start: number; end: number } {
  const startG = checkpointIndex * ROOTS_GROUPS_PER_CHECKPOINT;
  const endG = Math.min(
    startG + ROOTS_GROUPS_PER_CHECKPOINT - 1,
    ROOTS_GROUPS.length - 1,
  );
  let startF = Number.POSITIVE_INFINITY;
  let endF = 0;
  for (let g = startG; g <= endG; g++) {
    const meta = ROOTS_GROUPS[g];
    if (!meta) continue;
    for (const fi of meta.familyIndices) {
      startF = Math.min(startF, fi);
      endF = Math.max(endF, fi);
    }
  }
  if (!Number.isFinite(startF)) return { start: 0, end: 0 };
  return { start: startF, end: endF };
}

export function familiesForCheckpoint(checkpointIndex: number): CourseRootFamily[] {
  const startG = checkpointIndex * ROOTS_GROUPS_PER_CHECKPOINT;
  const endG = Math.min(
    startG + ROOTS_GROUPS_PER_CHECKPOINT - 1,
    ROOTS_GROUPS.length - 1,
  );
  const out: CourseRootFamily[] = [];
  for (let g = startG; g <= endG; g++) {
    out.push(...familiesForCurriculumGroup(g));
  }
  return out;
}
