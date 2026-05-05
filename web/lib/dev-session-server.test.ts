import { describe, expect, it } from "vitest";
import {
  getAllowedDeveloperUserIds,
  isBuiltInDeveloperUserId,
  isUserIdAllowed,
} from "./dev-session-server";

const OWNER_USER_ID = "user_3C3QIOm2ZtPQ1YK4CCLyr42HTml";

describe("dev-session allowlist", () => {
  it("recognizes the built-in owner user", () => {
    expect(isBuiltInDeveloperUserId(OWNER_USER_ID)).toBe(true);
    expect(isUserIdAllowed(OWNER_USER_ID)).toBe(true);
  });

  it("does not allow arbitrary Clerk user ids", () => {
    expect(isBuiltInDeveloperUserId("user_not_the_owner")).toBe(false);
    expect(isUserIdAllowed("user_not_the_owner")).toBe(false);
  });

  it("dedupes the built-in owner with env allowlist ids", () => {
    process.env.DEVELOPER_CLERK_USER_IDS = `${OWNER_USER_ID},user_extra`;
    expect(getAllowedDeveloperUserIds()).toEqual([OWNER_USER_ID, "user_extra"]);
    delete process.env.DEVELOPER_CLERK_USER_IDS;
  });
});
