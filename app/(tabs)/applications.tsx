import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState, PageHeader, SathiScreen, sharedStyles } from "@/components/sathi-ui";
import { useColors } from "@/hooks/use-colors";
import { SCHOLARSHIPS } from "@/lib/studentsathi-data";
import { useStudentSathi } from "@/lib/studentsathi-store";

export default function ApplicationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state } = useStudentSathi();
  const applications = state.applications.map((application) => ({ application, scholarship: SCHOLARSHIPS.find((item) => item.id === application.scholarshipId) })).filter((item): item is { application: typeof state.applications[number]; scholarship: typeof SCHOLARSHIPS[number] } => Boolean(item.scholarship));

  return (
    <SathiScreen>
      <FlatList
        data={applications}
        keyExtractor={({ application }) => application.scholarshipId}
        contentContainerStyle={[sharedStyles.content, sharedStyles.scrollContent, applications.length === 0 && styles.emptyList]}
        ListHeaderComponent={<PageHeader eyebrow="Application tracker" title="My plan" />}
        renderItem={({ item: { application, scholarship } }) => {
          const checked = Object.values(application.checklist).filter(Boolean).length;
          const total = Object.keys(application.checklist).length;
          return (
            <Pressable accessibilityRole="button" onPress={() => router.push(`/scholarships/${scholarship.id}` as never)} style={({ pressed }) => [styles.applicationCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}>
              <View style={styles.applicationTop}>
                <View style={[styles.statusBadge, { backgroundColor: application.status === "submitted" ? "#E8F7ED" : "#FFF4DE" }]}>
                  <Text style={[styles.statusText, { color: application.status === "submitted" ? colors.success : colors.warning }]}>{application.status.replace("-", " ")}</Text>
                </View>
                {application.reminderEnabled ? <MaterialIcons name="notifications-active" size={19} color={colors.primary} /> : null}
              </View>
              <Text style={[styles.applicationTitle, { color: colors.foreground }]}>{scholarship.title}</Text>
              <Text style={[styles.applicationDeadline, { color: colors.warning }]}>Deadline: {new Date(`${scholarship.deadline}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</Text>
              <View style={styles.checkRow}>
                <Text style={[styles.checkText, { color: colors.muted }]}>{checked}/{total} checklist items ready</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={<EmptyState icon="assignment" title="Start your first application" description="Choose a scholarship, review its eligibility, then add it to your plan with a document checklist." actionLabel="Discover scholarships" onAction={() => router.push("/discover" as never)} />}
      />
    </SathiScreen>
  );
}

const styles = StyleSheet.create({
  emptyList: { flexGrow: 1 },
  applicationCard: { borderWidth: 1, borderRadius: 22, padding: 17, marginBottom: 12 },
  applicationTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  statusBadge: { paddingVertical: 5, paddingHorizontal: 9, borderRadius: 999 },
  statusText: { fontSize: 11, fontWeight: "800", textTransform: "capitalize" },
  applicationTitle: { fontSize: 17, lineHeight: 22, fontWeight: "800" },
  applicationDeadline: { fontSize: 12, fontWeight: "700", marginTop: 7 },
  checkRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 },
  checkText: { fontSize: 13, fontWeight: "700" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
