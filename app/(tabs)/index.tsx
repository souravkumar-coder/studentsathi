import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { MetricCard, PageHeader, ProgressBar, ScholarshipCard, SectionHeading, SathiScreen, sharedStyles } from "@/components/sathi-ui";
import { useColors } from "@/hooks/use-colors";
import { SCHOLARSHIPS } from "@/lib/studentsathi-data";
import { getEligibility, getProfileCompletion } from "@/lib/studentsathi";
import { useStudentSathi } from "@/lib/studentsathi-store";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { state, hydrated, toggleSaved } = useStudentSathi();
  const completion = getProfileCompletion(state.profile);
  const recommendations = SCHOLARSHIPS
    .map((scholarship) => ({ scholarship, result: getEligibility(scholarship, state.profile) }))
    .sort((a, b) => b.result.score - a.result.score)
    .slice(0, 3);
  const readyDocuments = state.documents.filter((document) => document.status !== "missing").length;

  if (!hydrated) return <SathiScreen><View style={styles.loadingSpace} /></SathiScreen>;

  return (
    <SathiScreen>
      <ScrollView contentContainerStyle={[sharedStyles.content, sharedStyles.scrollContent]} showsVerticalScrollIndicator={false}>
        <PageHeader
          eyebrow="Your scholarship companion"
          title={state.profile.fullName ? `Namaste, ${state.profile.fullName.split(" ")[0]}` : "Welcome to StudentSathi"}
          action={
            <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.push("/profile" as never)} style={({ pressed }) => [styles.avatar, { backgroundColor: colors.primary }, pressed && styles.pressed]}>
              <Text style={[styles.avatarText, { color: colors.background }]}>{state.profile.fullName ? state.profile.fullName.charAt(0).toUpperCase() : "S"}</Text>
            </Pressable>
          }
        />

        <Pressable accessibilityRole="button" onPress={() => router.push("/discover" as never)} style={({ pressed }) => [styles.searchPrompt, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}>
          <MaterialIcons name="search" size={21} color={colors.primary} />
          <Text style={[styles.searchText, { color: colors.muted }]}>Search scholarships, schemes, or courses</Text>
          <MaterialIcons name="tune" size={20} color={colors.muted} />
        </Pressable>

        <Pressable accessibilityRole="button" onPress={() => router.push("/onboarding" as never)} style={({ pressed }) => [styles.profileCard, { backgroundColor: colors.primary }, pressed && styles.pressed]}>
          <View style={styles.profileCardTop}>
            <View style={styles.profileCardText}>
              <Text style={[styles.profileOverline, { color: "#DCEBFF" }]}>PERSONALIZE YOUR MATCHES</Text>
              <Text style={[styles.profileHeadline, { color: "#FFFFFF" }]}>{completion === 100 ? "Your profile is ready" : "Complete your profile"}</Text>
              <Text style={[styles.profileSubtext, { color: "#EAF2FF" }]}>{completion === 100 ? "Your preferences are guiding your match scores." : "Add a few details for more relevant opportunities."}</Text>
            </View>
            <View style={styles.profileIcon}><MaterialIcons name="auto-awesome" size={23} color={colors.primary} /></View>
          </View>
          <ProgressBar value={completion} />
          <Text style={styles.profileProgress}>{completion}% complete</Text>
        </Pressable>

        <View style={styles.metricRow}>
          <MetricCard icon="bookmark" value={String(state.savedScholarshipIds.length)} label="Saved" />
          <View style={styles.metricSpacer} />
          <MetricCard icon="assignment-turned-in" value={String(state.applications.length)} label="In progress" tone="warning" />
          <View style={styles.metricSpacer} />
          <MetricCard icon="folder" value={`${readyDocuments}/${state.documents.length}`} label="Documents" tone="success" />
        </View>

        <SectionHeading title="Quick actions" />
        <View style={styles.quickActionRow}>
          <QuickAction icon="verified-user" label="Check eligibility" color="#E6F7F5" onPress={() => router.push("/eligibility" as never)} />
          <QuickAction icon="folder-open" label="Document vault" color="#EAF2FF" onPress={() => router.push("/documents" as never)} />
          <QuickAction icon="smart-toy" label="Ask Sathi" color="#FFF4DE" onPress={() => router.push("/assistant" as never)} />
          <QuickAction icon="people-outline" label="Community" color="#F3EDFF" onPress={() => router.push("/community" as never)} />
        </View>

        <SectionHeading title="Recommended for you" action="See all" onAction={() => router.push("/discover" as never)} />
        {recommendations.map(({ scholarship, result }) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            saved={state.savedScholarshipIds.includes(scholarship.id)}
            matchScore={result.score}
            onBookmark={() => toggleSaved(scholarship.id)}
            onPress={() => router.push(`/scholarships/${scholarship.id}` as never)}
          />
        ))}

        <SectionHeading title="Stay on track" />
        <Pressable accessibilityRole="button" onPress={() => router.push("/applications" as never)} style={({ pressed }) => [styles.deadlineCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}>
          <View style={[styles.deadlineIcon, { backgroundColor: "#FFF4DE" }]}><MaterialIcons name="notifications-active" size={21} color={colors.warning} /></View>
          <View style={styles.deadlineText}>
            <Text style={[styles.deadlineTitle, { color: colors.foreground }]}>{state.applications.length ? "Review your application checklist" : "No reminders set yet"}</Text>
            <Text style={[styles.deadlineDescription, { color: colors.muted }]}>{state.applications.length ? "Open My plan to check documents, notes, and deadlines." : "Save an opportunity to set a gentle deadline reminder."}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
        </Pressable>
      </ScrollView>
    </SathiScreen>
  );
}

function QuickAction({ icon, label, color, onPress }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; color: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}>
      <View style={[styles.quickIcon, { backgroundColor: color }]}><MaterialIcons name={icon} size={22} color={colors.primary} /></View>
      <Text style={[styles.quickLabel, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loadingSpace: { flex: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 17, fontWeight: "800" },
  searchPrompt: { minHeight: 54, borderWidth: 1, borderRadius: 17, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 11 },
  searchText: { flex: 1, fontSize: 14, fontWeight: "600" },
  profileCard: { borderRadius: 24, padding: 19, marginTop: 16, overflow: "hidden" },
  profileCardTop: { flexDirection: "row", gap: 10, justifyContent: "space-between", marginBottom: 18 },
  profileCardText: { flex: 1 },
  profileOverline: { fontSize: 10, fontWeight: "800", letterSpacing: 0.9 },
  profileHeadline: { fontSize: 20, fontWeight: "800", marginTop: 5 },
  profileSubtext: { fontSize: 13, lineHeight: 18, marginTop: 5, maxWidth: 260 },
  profileIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  profileProgress: { color: "#EAF2FF", fontSize: 12, fontWeight: "700", marginTop: 7 },
  metricRow: { flexDirection: "row", marginTop: 20 },
  metricSpacer: { width: 9 },
  quickActionRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10 },
  quickAction: { width: "47.8%", borderWidth: 1, borderRadius: 18, padding: 13, minHeight: 103 },
  quickIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  quickLabel: { fontSize: 13, lineHeight: 17, fontWeight: "800", maxWidth: 100 },
  deadlineCard: { borderWidth: 1, borderRadius: 20, padding: 15, flexDirection: "row", alignItems: "center", gap: 12 },
  deadlineIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  deadlineText: { flex: 1 },
  deadlineTitle: { fontSize: 14, fontWeight: "800" },
  deadlineDescription: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
