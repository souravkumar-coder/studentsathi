import { describe, expect, it } from "vitest";

import { SCHOLARSHIPS } from "../lib/studentsathi-data";
import { EMPTY_PROFILE, filterScholarships, getEligibility, getProfileCompletion } from "../lib/studentsathi";

describe("StudentSathi matching", () => {
  it("filters a catalogue by query and typed filters", () => {
    expect(filterScholarships(SCHOLARSHIPS, "stem", ["Private"])).toHaveLength(1);
    expect(filterScholarships(SCHOLARSHIPS, "", ["Government"])[0]?.id).toBe("krishi-vidya");
  });

  it("explains both matching and missing scholarship criteria", () => {
    const result = getEligibility(SCHOLARSHIPS[1], {
      ...EMPTY_PROFILE,
      state: "Maharashtra",
      course: "Engineering",
      category: "General",
      incomeBand: "2-to-5",
      isFemale: false,
    });
    expect(result.matchedCriteria).toContain("Supports Engineering");
    expect(result.missingCriteria).toContain("This opportunity is listed for women students");
  });

  it("reports profile completion without treating optional factors as required", () => {
    expect(getProfileCompletion(EMPTY_PROFILE)).toBe(0);
    expect(getProfileCompletion({
      ...EMPTY_PROFILE,
      fullName: "Anika",
      educationLevel: "Undergraduate",
      course: "Engineering",
      state: "Maharashtra",
      category: "General",
      incomeBand: "2-to-5",
    })).toBe(100);
  });
});
