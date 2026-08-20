import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Chip, EmptyState, PageHeader, ProgressBar, ScholarshipCard, SathiScreen, SectionHeading, sharedStyles } from "@/components/sathi-ui";
import { useColors } from "@/hooks/use-colors";
import { SCHOLARSHIPS } from "@/lib/studentsathi-data";
import { formatDeadline, getEligibility } from "@/lib/studentsathi";
import { useStudentSathi } from "@/lib/studentsathi-store";

export default function ScholarshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { state, toggleSaved, startApplication, updateApplication, toggleChecklistItem } = useStudentSathi();
  const scholarship = SCHOLARSHIPS.find((item) => item.id === id);
  if (!scholarship) return <SathiScreen><View style={sharedStyles.content}><EmptyState icon="error-outline" title="Opportunity not found" description="This listing is not available in the local catalogue." actionLabel="Back to discover" onAction={() => router.replace("/discover" as never)} /></View></SathiScreen>;
  const eligibility = getEligibility(scholarship, state.profile);
  const application = state.applications.find((item) => item.scholarshipId === scholarship.id);
  const beginApplication = () => { startApplication(scholarship.id, scholarship.requiredDocuments); Alert.alert("Added to My plan", "Your checklist is ready. Add documents and set a reminder when you are ready."); };
  const advanceStatus = () => {
    if (!application) return;
    const nextStatus = application.status === "in-progress" ? "submitted" : application.status === "submitted" ? "completed" : "in-progress";
    updateApplication(scholarship.id, { status: nextStatus });
  };
  const toggleReminder = async () => {
    if (!application) return;
    if (application.reminderEnabled) {
      if (application.notificationId && Platform.OS !== "web") await Notifications.cancelScheduledNotificationAsync(application.notificationId).catch(() => undefined);
      updateApplication(scholarship.id, { reminderEnabled: false, notificationId: null });
      Alert.alert("Reminder paused", "You can turn it back on whenever you need a deadline cue.");
      return;
    }
    if (Platform.OS === "web") {
      updateApplication(scholarship.id, { reminderEnabled: true, notificationId: "web-reminder" });
      Alert.alert("Reminder preference saved", "Local device notifications will be available when you open this flow in the mobile build.");
      return;
    }
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("deadlines", { name: "Scholarship deadlines", importance: Notifications.AndroidImportance.DEFAULT });
    }
    const permissions = await Notifications.getPermissionsAsync();
    const status = permissions.status === "granted" ? permissions.status : (await Notifications.requestPermissionsAsync()).status;
    if (status !== "granted") { Alert.alert("Permission needed", "Allow notifications to receive a deadline reminder."); return; }
    const triggerDate = new Date(`${scholarship.deadline}T09:00:00`);
    triggerDate.setDate(triggerDate.getDate() - 3);
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title: "Scholarship deadline approaching", body: `${scholarship.title} closes on ${formatDeadline(scholarship.deadline)}.`, data: { scholarshipId: scholarship.id } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate, channelId: "deadlines" },
    });
    updateApplication(scholarship.id, { reminderEnabled: true, notificationId });
    Alert.alert("Reminder set", "We’ll remind you three days before the listed deadline.");
  };

  return (
    <SathiScreen>
      <ScrollView contentContainerStyle={[sharedStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <PageHeader eyebrow={scholarship.type} title={scholarship.title} action={<Pressable onPress={() => toggleSaved(scholarship.id)} style={({ pressed }) => [styles.bookmark, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><MaterialIcons name={state.savedScholarshipIds.includes(scholarship.id) ? "bookmark" : "bookmark-border"} size={22} color={colors.primary} /></Pressable>} />
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.provider, { color: colors.muted }]}>{scholarship.provider}</Text>
          <Text style={[styles.award, { color: colors.foreground }]}>{scholarship.award}</Text>
          <View style={styles.deadlineRow}><MaterialIcons name="event" size={17} color={colors.warning} /><Text style={[styles.deadline, { color: colors.warning }]}>Application closes {formatDeadline(scholarship.deadline)}</Text></View>
          <Text style={[styles.description, { color: colors.muted }]}>{scholarship.description}</Text>
          <View style={styles.tagRow}>{scholarship.tags.map((tag) => <Chip key={tag} label={tag} />)}</View>
        </View>

        <View style={[styles.matchCard, { backgroundColor: eligibility.score >= 70 ? "#E8F7ED" : "#FFF4DE" }]}>
          <View style={styles.matchTop}><View><Text style={[styles.matchEyebrow, { color: eligibility.score >= 70 ? colors.success : colors.warning }]}>YOUR ELIGIBILITY CHECK</Text><Text style={[styles.matchScore, { color: colors.foreground }]}>{eligibility.score}% profile match</Text></View><View style={[styles.matchIcon, { backgroundColor: "#FFFFFF" }]}><MaterialIcons name="verified-user" size={24} color={eligibility.score >= 70 ? colors.success : colors.warning} /></View></View>
          <ProgressBar value={eligibility.score} />
          <Pressable onPress={() => router.push("/eligibility" as never)} style={({ pressed }) => [styles.explainButton, pressed && styles.pressed]}><Text style={[styles.explainText, { color: colors.primary }]}>See why this matches</Text><MaterialIcons name="arrow-forward" size={17} color={colors.primary} /></Pressable>
        </View>

        <SectionHeading title="Required documents" />
        <View style={[styles.documentsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {scholarship.requiredDocuments.map((document) => { const record = state.documents.find((item) => item.label === document); const ready = record?.status !== "missing"; return <View key={document} style={styles.documentRow}><MaterialIcons name={ready ? "check-circle" : "radio-button-unchecked"} size={20} color={ready ? colors.success : colors.muted} /><Text style={[styles.documentLabel, { color: colors.foreground }]}>{document}</Text></View>; })}
          <Pressable onPress={() => router.push("/documents" as never)} style={({ pressed }) => [styles.documentsLink, pressed && styles.pressed]}><Text style={[styles.documentsLinkText, { color: colors.primary }]}>Open document vault</Text></Pressable>
        </View>

        <SectionHeading title="Application plan" />
        <View style={styles.actionRow}>
          <Pressable onPress={application ? () => router.push("/applications" as never) : beginApplication} style={({ pressed }) => [styles.applyButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={[styles.applyText, { color: colors.background }]}>{application ? "View My plan" : "Add to My plan"}</Text><MaterialIcons name={application ? "arrow-forward" : "add"} size={19} color={colors.background} /></Pressable>
        </View>
        {application ? <Pressable onPress={toggleReminder} style={({ pressed }) => [styles.reminderButton, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><MaterialIcons name={application.reminderEnabled ? "notifications-off" : "notifications-active"} size={19} color={colors.primary} /><Text style={[styles.reminderText, { color: colors.primary }]}>{application.reminderEnabled ? "Pause deadline reminder" : "Set deadline reminder"}</Text></Pressable> : null}
        {application ? <View style={[styles.workspaceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.workspaceHeader}><View><Text style={[styles.workspaceTitle, { color: colors.foreground }]}>Application workspace</Text><Text style={[styles.workspaceDescription, { color: colors.muted }]}>Track actions locally before applying on the official provider site.</Text></View><Pressable onPress={advanceStatus} style={({ pressed }) => [styles.statusButton, { backgroundColor: application.status === "submitted" ? "#E8F7ED" : "#FFF4DE" }, pressed && styles.pressed]}><Text style={[styles.statusButtonText, { color: application.status === "submitted" ? colors.success : colors.warning }]}>{application.status.replace("-", " ")}</Text></Pressable></View><Text style={[styles.workspaceLabel, { color: colors.foreground }]}>Checklist</Text>{Object.entries(application.checklist).map(([label, checked]) => <Pressable key={label} onPress={() => toggleChecklistItem(scholarship.id, label)} style={({ pressed }) => [styles.checklistItem, pressed && styles.pressed]}><MaterialIcons name={checked ? "check-box" : "check-box-outline-blank"} size={21} color={checked ? colors.success : colors.muted} /><Text style={[styles.checklistLabel, { color: colors.foreground }]}>{label}</Text></Pressable>)}<Text style={[styles.workspaceLabel, { color: colors.foreground, marginTop: 13 }]}>Private notes</Text><TextInput value={application.notes} onChangeText={(notes) => updateApplication(scholarship.id, { notes })} placeholder="Add a reminder for yourself, such as where you found the official form" placeholderTextColor={colors.muted} multiline style={[styles.notesInput, { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border }]} /></View> : null}
        <Text style={[styles.disclaimer, { color: colors.muted }]}>This is a representative StudentSathi demo listing. Confirm official provider details and live deadlines before sharing documents or applying.</Text>

        <SectionHeading title="Similar opportunities" />
        {SCHOLARSHIPS.filter((item) => item.id !== scholarship.id).slice(0, 2).map((item) => <ScholarshipCard key={item.id} scholarship={item} saved={state.savedScholarshipIds.includes(item.id)} onBookmark={() => toggleSaved(item.id)} onPress={() => router.replace(`/scholarships/${item.id}` as never)} />)}
      </ScrollView>
    </SathiScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 38 }, bookmark: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" }, heroCard: { borderWidth: 1, borderRadius: 24, padding: 19 },
  provider: { fontSize: 13, fontWeight: "700" }, award: { fontSize: 25, fontWeight: "800", marginTop: 5, letterSpacing: -0.5 }, deadlineRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 13 }, deadline: { fontSize: 13, fontWeight: "800" }, description: { fontSize: 14, lineHeight: 21, marginTop: 15 }, tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 0, marginTop: 15 },
  matchCard: { borderRadius: 23, padding: 18, marginTop: 14 }, matchTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }, matchEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 }, matchScore: { fontSize: 20, fontWeight: "800", marginTop: 4 }, matchIcon: { width: 45, height: 45, borderRadius: 15, alignItems: "center", justifyContent: "center" }, explainButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 15 }, explainText: { fontSize: 13, fontWeight: "800" },
  documentsCard: { borderWidth: 1, borderRadius: 21, padding: 16 }, documentRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }, documentLabel: { fontSize: 14, fontWeight: "700" }, documentsLink: { alignSelf: "flex-start", marginTop: 2 }, documentsLinkText: { fontSize: 13, fontWeight: "800" }, actionRow: { flexDirection: "row" }, applyButton: { flex: 1, minHeight: 51, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 }, applyText: { fontSize: 15, fontWeight: "800" }, reminderButton: { borderWidth: 1, minHeight: 48, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 10 }, reminderText: { fontSize: 14, fontWeight: "800" }, workspaceCard: { borderWidth: 1, borderRadius: 21, padding: 16, marginTop: 10 }, workspaceHeader: { flexDirection: "row", gap: 10, justifyContent: "space-between", marginBottom: 15 }, workspaceTitle: { fontSize: 15, fontWeight: "800" }, workspaceDescription: { fontSize: 12, lineHeight: 17, marginTop: 3, maxWidth: 205 }, statusButton: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 }, statusButtonText: { fontSize: 10, fontWeight: "800", textTransform: "capitalize" }, workspaceLabel: { fontSize: 12, fontWeight: "800", marginBottom: 8 }, checklistItem: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 10 }, checklistLabel: { flex: 1, fontSize: 13, fontWeight: "600" }, notesInput: { minHeight: 84, borderWidth: 1, borderRadius: 13, paddingHorizontal: 12, paddingTop: 10, fontSize: 13, lineHeight: 18, textAlignVertical: "top" }, disclaimer: { fontSize: 12, lineHeight: 17, marginTop: 12 }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
