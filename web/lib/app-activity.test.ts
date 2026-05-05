import { describe, expect, it } from "vitest";
import {
  canSetAsResume,
  reduceAppSession,
} from "./app-session.model";
import { getUniversalResumePath } from "./app-activity";
import type { LearnProgressState } from "./learn-progress";

describe("app activity resume", () => {
  it("does not let the Learn hub replace the saved lesson resume", () => {
    const before = reduceAppSession(undefined, "/learn/1/1-3", "/learn/1/1-3");
    const after = reduceAppSession(before, "/learn", "/learn");

    expect(after.lastResume?.path).toBe("/learn/1/1-3");
  });

  it("does not treat level menus as resumable lessons", () => {
    expect(canSetAsResume("/learn/1", "/learn/1")).toBe(false);
    expect(canSetAsResume("/learn/4", "/learn/4")).toBe(false);
  });

  it("falls back to the foundation lesson when the newest visit is Learn home", () => {
    const appSession = reduceAppSession(undefined, "/learn", "/learn");
    const progress: LearnProgressState = {
      completedSections: {
        "1-1": true,
        "1-2": true,
        "1-read": true,
      },
      activeLevel: 1,
      appSession,
      lastCoursePosition: {
        level: 1,
        sectionId: "1-3",
        at: 1,
      },
    };

    expect(getUniversalResumePath(progress)).toBe("/learn/1/1-3");
  });
});
