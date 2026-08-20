export type Language = "en" | "hi";
export type IncomeBand = "under-2" | "2-to-5" | "5-to-8" | "above-8" | "not-set";
export type ApplicationStatus = "saved" | "in-progress" | "submitted" | "completed";
export type DocumentStatus = "missing" | "ready" | "verified" | "expiring";
export type UserRole = "student" | "college" | "provider" | "admin";

export type StudentProfile = {
  fullName: string;
  educationLevel: string;
  course: string;
  state: string;
  category: string;
  incomeBand: IncomeBand;
  isFemale: boolean;
  hasDisability: boolean;
  farmerFamily: boolean;
  role: UserRole;
};

export type Scholarship = {
  id: string;
  title: string;
  provider: string;
  type: "Government" | "Private" | "College";
  award: string;
  deadline: string;
  description: string;
  states: string[];
  courses: string[];
  categories: string[];
  incomeBands: IncomeBand[];
  gender: "all" | "female";
  requiresDisability?: boolean;
  requiresFarmerFamily?: boolean;
  educationLevels: string[];
  requiredDocuments: string[];
  tags: string[];
};

export type EligibilityResult = {
  scholarshipId: string;
  score: number;
  matchedCriteria: string[];
  missingCriteria: string[];
  checkedAt: string;
};

export type DocumentRecord = {
  id: string;
  label: string;
  status: DocumentStatus;
  fileName?: string;
  uri?: string;
  expiresOn?: string;
  updatedAt?: string;
};

export type ApplicationRecord = {
  scholarshipId: string;
  status: ApplicationStatus;
  createdAt: string;
  notes: string;
  checklist: Record<string, boolean>;
  reminderEnabled: boolean;
  notificationId?: string | null;
};

export type NewsItem = {
  id: string;
  category: "Scholarships" | "Exams" | "Admissions" | "Internships" | "Schemes";
  title: string;
  summary: string;
  updatedLabel: string;
  important?: boolean;
};

export type CommunityPost = {
  id: string;
  author: string;
  title: string;
  body: string;
  tags: string[];
  helpfulCount: number;
  createdLabel: string;
};

export type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: string;
};

export const EMPTY_PROFILE: StudentProfile = {
  fullName: "",
  educationLevel: "",
  course: "",
  state: "",
  category: "",
  incomeBand: "not-set",
  isFemale: false,
  hasDisability: false,
  farmerFamily: false,
  role: "student",
};

export const CORE_DOCUMENTS = [
  "Identity proof",
  "Academic marksheet",
  "Income certificate",
  "Bank details",
];

export function getProfileCompletion(profile: StudentProfile): number {
  const fields = [
    profile.fullName,
    profile.educationLevel,
    profile.course,
    profile.state,
    profile.category,
    profile.incomeBand !== "not-set" ? profile.incomeBand : "",
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export function getEligibility(scholarship: Scholarship, profile: StudentProfile): EligibilityResult {
  const matchedCriteria: string[] = [];
  const missingCriteria: string[] = [];
  const check = (matches: boolean, matched: string, missing: string) => {
    if (matches) matchedCriteria.push(matched);
    else missingCriteria.push(missing);
  };

  check(
    scholarship.states.includes("All India") || scholarship.states.includes(profile.state),
    `Available in ${profile.state || "your selected state"}`,
    `Available for: ${scholarship.states.join(", ")}`,
  );
  check(
    scholarship.courses.includes("Any course") || scholarship.courses.includes(profile.course),
    `Supports ${profile.course || "your selected course"}`,
    `Course focus: ${scholarship.courses.join(", ")}`,
  );
  check(
    scholarship.categories.includes("All categories") || scholarship.categories.includes(profile.category),
    `Open to ${profile.category || "your selected category"}`,
    `Category focus: ${scholarship.categories.join(", ")}`,
  );
  check(
    scholarship.incomeBands.includes(profile.incomeBand),
    "Income band is within the listed range",
    "Review the provider’s income criteria",
  );
  check(
    scholarship.gender === "all" || (scholarship.gender === "female" && profile.isFemale),
    scholarship.gender === "female" ? "Matches the women-student criterion" : "Open to all students",
    "This opportunity is listed for women students",
  );
  if (scholarship.requiresDisability) {
    check(profile.hasDisability, "Matches the disability-support criterion", "Disability-support criterion is required");
  }
  if (scholarship.requiresFarmerFamily) {
    check(profile.farmerFamily, "Matches the farmer-family criterion", "Farmer-family criterion is required");
  }

  const total = matchedCriteria.length + missingCriteria.length;
  return {
    scholarshipId: scholarship.id,
    score: total ? Math.round((matchedCriteria.length / total) * 100) : 0,
    matchedCriteria,
    missingCriteria,
    checkedAt: new Date().toISOString(),
  };
}

export function filterScholarships(
  scholarships: Scholarship[],
  query: string,
  filters: string[],
): Scholarship[] {
  const normalizedQuery = query.trim().toLowerCase();
  return scholarships.filter((scholarship) => {
    const haystack = [
      scholarship.title,
      scholarship.provider,
      scholarship.type,
      scholarship.description,
      ...scholarship.tags,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    const matchesFilters = filters.every(
      (filter) =>
        scholarship.type === filter ||
        scholarship.tags.includes(filter) ||
        scholarship.states.includes(filter) ||
        scholarship.courses.includes(filter),
    );
    return matchesQuery && matchesFilters;
  });
}

export function formatDeadline(deadline: string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${deadline}T12:00:00`),
  );
}
