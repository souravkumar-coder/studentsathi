import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { COMMUNITY_POSTS } from "./studentsathi-data";
import {
  CORE_DOCUMENTS,
  EMPTY_PROFILE,
  type ApplicationRecord,
  type AssistantMessage,
  type CommunityPost,
  type DocumentRecord,
  type Language,
  type StudentProfile,
} from "./studentsathi";

const STORAGE_KEY = "studentsathi:v1";

type StudentSathiState = {
  profile: StudentProfile;
  savedScholarshipIds: string[];
  applications: ApplicationRecord[];
  documents: DocumentRecord[];
  language: Language;
  notificationsEnabled: boolean;
  communityPosts: CommunityPost[];
  assistantMessages: AssistantMessage[];
};

const INITIAL_STATE: StudentSathiState = {
  profile: EMPTY_PROFILE,
  savedScholarshipIds: [],
  applications: [],
  documents: CORE_DOCUMENTS.map((label) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label, status: "missing" })),
  language: "en",
  notificationsEnabled: false,
  communityPosts: COMMUNITY_POSTS,
  assistantMessages: [
    {
      id: "welcome",
      role: "assistant",
      content: "Namaste! I’m Sathi. Ask me how to search, check eligibility, prepare documents, or plan an application.",
      createdAt: new Date().toISOString(),
    },
  ],
};

type StudentSathiContextValue = {
  state: StudentSathiState;
  hydrated: boolean;
  updateProfile: (changes: Partial<StudentProfile>) => void;
  toggleSaved: (scholarshipId: string) => void;
  startApplication: (scholarshipId: string, documentLabels: string[]) => void;
  updateApplication: (scholarshipId: string, changes: Partial<ApplicationRecord>) => void;
  toggleChecklistItem: (scholarshipId: string, label: string) => void;
  upsertDocument: (document: DocumentRecord) => void;
  setLanguage: (language: Language) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  addCommunityPost: (title: string, body: string) => void;
  incrementHelpful: (postId: string) => void;
  addAssistantMessage: (message: AssistantMessage) => void;
};

const StudentSathiContext = createContext<StudentSathiContextValue | null>(null);

export function StudentSathiProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudentSathiState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<StudentSathiState>;
        setState((current) => ({ ...current, ...saved, profile: { ...EMPTY_PROFILE, ...saved.profile } }));
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  const commit = useCallback((update: (current: StudentSathiState) => StudentSathiState) => {
    setState((current) => {
      const next = update(current);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const updateProfile = useCallback((changes: Partial<StudentProfile>) => {
    commit((current) => ({ ...current, profile: { ...current.profile, ...changes } }));
  }, [commit]);

  const toggleSaved = useCallback((scholarshipId: string) => {
    commit((current) => ({
      ...current,
      savedScholarshipIds: current.savedScholarshipIds.includes(scholarshipId)
        ? current.savedScholarshipIds.filter((id) => id !== scholarshipId)
        : [...current.savedScholarshipIds, scholarshipId],
    }));
  }, [commit]);

  const startApplication = useCallback((scholarshipId: string, documentLabels: string[]) => {
    commit((current) => {
      if (current.applications.some((application) => application.scholarshipId === scholarshipId)) return current;
      return {
        ...current,
        applications: [
          {
            scholarshipId,
            status: "in-progress",
            createdAt: new Date().toISOString(),
            notes: "",
            reminderEnabled: false,
            notificationId: null,
            checklist: Object.fromEntries(documentLabels.map((label) => [label, false])),
          },
          ...current.applications,
        ],
      };
    });
  }, [commit]);

  const updateApplication = useCallback((scholarshipId: string, changes: Partial<ApplicationRecord>) => {
    commit((current) => ({
      ...current,
      applications: current.applications.map((application) =>
        application.scholarshipId === scholarshipId ? { ...application, ...changes } : application,
      ),
    }));
  }, [commit]);

  const toggleChecklistItem = useCallback((scholarshipId: string, label: string) => {
    commit((current) => ({
      ...current,
      applications: current.applications.map((application) =>
        application.scholarshipId === scholarshipId
          ? { ...application, checklist: { ...application.checklist, [label]: !application.checklist[label] } }
          : application,
      ),
    }));
  }, [commit]);

  const upsertDocument = useCallback((document: DocumentRecord) => {
    commit((current) => ({
      ...current,
      documents: current.documents.some((item) => item.id === document.id)
        ? current.documents.map((item) => (item.id === document.id ? document : item))
        : [...current.documents, document],
    }));
  }, [commit]);

  const setLanguage = useCallback((language: Language) => commit((current) => ({ ...current, language })), [commit]);
  const setNotificationsEnabled = useCallback((notificationsEnabled: boolean) => commit((current) => ({ ...current, notificationsEnabled })), [commit]);

  const addCommunityPost = useCallback((title: string, body: string) => {
    commit((current) => ({
      ...current,
      communityPosts: [
        {
          id: `community-${Date.now()}`,
          author: current.profile.fullName || "StudentSathi learner",
          title,
          body,
          tags: ["Student question"],
          helpfulCount: 0,
          createdLabel: "Just now",
        },
        ...current.communityPosts,
      ],
    }));
  }, [commit]);

  const incrementHelpful = useCallback((postId: string) => {
    commit((current) => ({
      ...current,
      communityPosts: current.communityPosts.map((post) =>
        post.id === postId ? { ...post, helpfulCount: post.helpfulCount + 1 } : post,
      ),
    }));
  }, [commit]);

  const addAssistantMessage = useCallback((message: AssistantMessage) => {
    commit((current) => ({ ...current, assistantMessages: [...current.assistantMessages, message] }));
  }, [commit]);

  const value = useMemo<StudentSathiContextValue>(() => ({
    state,
    hydrated,
    updateProfile,
    toggleSaved,
    startApplication,
    updateApplication,
    toggleChecklistItem,
    upsertDocument,
    setLanguage,
    setNotificationsEnabled,
    addCommunityPost,
    incrementHelpful,
    addAssistantMessage,
  }), [
    addAssistantMessage,
    addCommunityPost,
    hydrated,
    incrementHelpful,
    setLanguage,
    setNotificationsEnabled,
    startApplication,
    state,
    toggleChecklistItem,
    toggleSaved,
    updateApplication,
    updateProfile,
    upsertDocument,
  ]);

  return <StudentSathiContext.Provider value={value}>{children}</StudentSathiContext.Provider>;
}

export function useStudentSathi(): StudentSathiContextValue {
  const context = useContext(StudentSathiContext);
  if (!context) throw new Error("useStudentSathi must be used within StudentSathiProvider");
  return context;
}
