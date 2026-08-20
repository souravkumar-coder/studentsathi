import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { type Scholarship } from "@/lib/studentsathi";

export function SathiScreen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <ScreenContainer style={style} containerClassName="bg-background">{children}</ScreenContainer>;
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerText}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {action ? (
        <Pressable accessibilityRole="button" accessibilityLabel={action} onPress={onAction} style={({ pressed }) => pressed && styles.pressed}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chip({ label, active = false, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border },
        pressed && onPress ? styles.pressed : undefined,
      ]}
    >
      <Text style={[styles.chipText, { color: active ? colors.background : colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

export function MetricCard({ icon, label, value, tone = "primary" }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string; tone?: "primary" | "success" | "warning" }) {
  const colors = useColors();
  const background = tone === "success" ? "#DCFCE7" : tone === "warning" ? "#FFF7E6" : "#EAF2FF";
  const iconColor = tone === "success" ? colors.success : tone === "warning" ? colors.warning : colors.primary;
  return (
    <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.metricIcon, { backgroundColor: background }]}>
        <MaterialIcons name={icon} size={19} color={iconColor} />
      </View>
      <Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

export function ScholarshipCard({
  scholarship,
  saved,
  matchScore,
  onPress,
  onBookmark,
}: {
  scholarship: Scholarship;
  saved?: boolean;
  matchScore?: number;
  onPress: () => void;
  onBookmark: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${scholarship.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.scholarshipCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}
    >
      <View style={styles.cardTopRow}>
        <View style={[styles.typePill, { backgroundColor: scholarship.type === "Government" ? "#E6F7F5" : scholarship.type === "College" ? "#FFF4DE" : "#EAF2FF" }]}>
          <Text style={[styles.typePillText, { color: scholarship.type === "Government" ? colors.success : scholarship.type === "College" ? colors.warning : colors.primary }]}>{scholarship.type}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? "Remove bookmark" : "Save scholarship"}
          onPress={(event) => {
            event.stopPropagation();
            onBookmark();
          }}
          hitSlop={10}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <MaterialIcons name={saved ? "bookmark" : "bookmark-border"} size={23} color={saved ? colors.primary : colors.muted} />
        </Pressable>
      </View>
      <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>{scholarship.title}</Text>
      <Text style={[styles.cardProvider, { color: colors.muted }]} numberOfLines={1}>{scholarship.provider}</Text>
      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.cardAward, { color: colors.foreground }]}>{scholarship.award}</Text>
          <Text style={[styles.cardDeadline, { color: colors.warning }]}>Closes {new Date(`${scholarship.deadline}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</Text>
        </View>
        {typeof matchScore === "number" ? (
          <View style={[styles.scorePill, { backgroundColor: matchScore >= 70 ? "#E8F7ED" : "#FFF4DE" }]}>
            <Text style={[styles.scoreText, { color: matchScore >= 70 ? colors.success : colors.warning }]}>{matchScore}% match</Text>
          </View>
        ) : <MaterialIcons name="chevron-right" size={22} color={colors.muted} />}
      </View>
    </Pressable>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const colors = useColors();
  return (
    <View>
      {label ? <Text style={[styles.progressLabel, { color: colors.muted }]}>{label}</Text> : null}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(value, 100))}%`, backgroundColor: colors.primary }]} />
      </View>
    </View>
  );
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.emptyIcon, { backgroundColor: "#EAF2FF" }]}><MaterialIcons name={icon} size={28} color={colors.primary} /></View>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptyDescription, { color: colors.muted }]}>{description}</Text>
      {actionLabel ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}>
          <Text style={[styles.primaryButtonText, { color: colors.background }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function LoadingState() {
  const colors = useColors();
  return <View style={styles.loadingState}><ActivityIndicator color={colors.primary} /></View>;
}

export const sharedStyles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  scrollContent: { paddingBottom: 108 },
  card: { borderRadius: 22, borderWidth: 1, padding: 18 },
  primaryButton: { borderRadius: 14, alignItems: "center", justifyContent: "center", minHeight: 48, paddingHorizontal: 18 },
  primaryButtonText: { fontSize: 15, fontWeight: "700" },
  secondaryButton: { borderRadius: 14, alignItems: "center", justifyContent: "center", minHeight: 48, paddingHorizontal: 18, borderWidth: 1 },
  input: { minHeight: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, fontSize: 15 },
});

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerText: { flex: 1 },
  eyebrow: { fontSize: 13, fontWeight: "700", letterSpacing: 0.2, marginBottom: 4 },
  pageTitle: { fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.5 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 25, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800", letterSpacing: -0.2 },
  sectionAction: { fontSize: 14, fontWeight: "700" },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8, marginRight: 8 },
  chipText: { fontSize: 13, fontWeight: "700" },
  metricCard: { flex: 1, minHeight: 118, borderRadius: 20, borderWidth: 1, padding: 14 },
  metricIcon: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  metricValue: { fontSize: 19, fontWeight: "800", letterSpacing: -0.3 },
  metricLabel: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  scholarshipCard: { borderRadius: 22, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  typePill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  typePillText: { fontSize: 11, fontWeight: "800" },
  cardTitle: { fontSize: 17, lineHeight: 22, fontWeight: "800", letterSpacing: -0.2 },
  cardProvider: { fontSize: 12, lineHeight: 17, marginTop: 5, fontWeight: "500" },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 15 },
  cardAward: { fontSize: 14, fontWeight: "800" },
  cardDeadline: { fontSize: 12, marginTop: 3, fontWeight: "700" },
  scorePill: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 },
  scoreText: { fontSize: 12, fontWeight: "800" },
  progressLabel: { fontSize: 12, fontWeight: "700", marginBottom: 7 },
  progressTrack: { height: 8, borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 999 },
  emptyState: { borderWidth: 1, borderRadius: 24, padding: 24, alignItems: "center", marginTop: 10 },
  emptyIcon: { width: 58, height: 58, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: "800", textAlign: "center" },
  emptyDescription: { fontSize: 14, lineHeight: 20, textAlign: "center", marginTop: 7, marginBottom: 16 },
  primaryButton: { borderRadius: 14, minHeight: 46, paddingHorizontal: 18, justifyContent: "center", alignItems: "center" },
  primaryButtonText: { fontSize: 14, fontWeight: "800" },
  loadingState: { flex: 1, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
});
