import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { Chip, PageHeader, SathiScreen, sharedStyles } from "@/components/sathi-ui";
import { useColors } from "@/hooks/use-colors";
import { type IncomeBand } from "@/lib/studentsathi";
import { useStudentSathi } from "@/lib/studentsathi-store";

const INCOME_OPTIONS: { label: string; value: IncomeBand }[] = [
  { label: "Under ₹2L", value: "under-2" },
  { label: "₹2–5L", value: "2-to-5" },
  { label: "₹5–8L", value: "5-to-8" },
  { label: "Above ₹8L", value: "above-8" },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, updateProfile } = useStudentSathi();
  const profile = state.profile;
  const cycle = (field: "educationLevel" | "category", values: string[]) => {
    const current = values.indexOf(profile[field]);
    updateProfile({ [field]: values[(current + 1) % values.length] });
  };

  return (
    <SathiScreen>
      <ScrollView contentContainerStyle={[sharedStyles.content, styles.content]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <PageHeader eyebrow="Student setup" title="Make matching personal" />
        <Text style={[styles.intro, { color: colors.muted }]}>Your profile stays on this device in the MVP. Add only the details you are comfortable using for eligibility guidance.</Text>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FieldLabel label="Your name" />
          <TextInput value={profile.fullName} onChangeText={(fullName) => updateProfile({ fullName })} placeholder="e.g. Anika Sharma" placeholderTextColor={colors.muted} style={[sharedStyles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} returnKeyType="done" />

          <FieldLabel label="Education level" />
          <Pressable accessibilityRole="button" onPress={() => cycle("educationLevel", ["Undergraduate", "Postgraduate", "Diploma", "School"])} style={({ pressed }) => [styles.selectRow, { backgroundColor: colors.background, borderColor: colors.border }, pressed && styles.pressed]}>
            <Text style={[styles.selectText, { color: profile.educationLevel ? colors.foreground : colors.muted }]}>{profile.educationLevel || "Choose your level"}</Text><MaterialIcons name="expand-more" size={22} color={colors.muted} />
          </Pressable>

          <FieldLabel label="Course or branch" />
          <TextInput value={profile.course} onChangeText={(course) => updateProfile({ course })} placeholder="e.g. Engineering" placeholderTextColor={colors.muted} style={[sharedStyles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} returnKeyType="done" />

          <FieldLabel label="State" />
          <TextInput value={profile.state} onChangeText={(state) => updateProfile({ state })} placeholder="e.g. Maharashtra" placeholderTextColor={colors.muted} style={[sharedStyles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} returnKeyType="done" />

          <FieldLabel label="Category" />
          <Pressable accessibilityRole="button" onPress={() => cycle("category", ["General", "OBC", "SC", "ST", "EWS", "Minority"])} style={({ pressed }) => [styles.selectRow, { backgroundColor: colors.background, borderColor: colors.border }, pressed && styles.pressed]}>
            <Text style={[styles.selectText, { color: profile.category ? colors.foreground : colors.muted }]}>{profile.category || "Choose your category"}</Text><MaterialIcons name="expand-more" size={22} color={colors.muted} />
          </Pressable>

          <FieldLabel label="Annual family-income band" />
          <View style={styles.chipGroup}>{INCOME_OPTIONS.map((option) => <Chip key={option.value} label={option.label} active={profile.incomeBand === option.value} onPress={() => updateProfile({ incomeBand: option.value })} />)}</View>
        </View>

        <Text style={[styles.optionalHeading, { color: colors.foreground }]}>Optional criteria</Text>
        <Text style={[styles.optionalDescription, { color: colors.muted }]}>These can help surface listings that use specific eligibility conditions.</Text>
        <ToggleRow label="I identify as a woman student" value={profile.isFemale} onValueChange={(isFemale) => updateProfile({ isFemale })} />
        <ToggleRow label="I want disability-support opportunities" value={profile.hasDisability} onValueChange={(hasDisability) => updateProfile({ hasDisability })} />
        <ToggleRow label="I belong to a farmer family" value={profile.farmerFamily} onValueChange={(farmerFamily) => updateProfile({ farmerFamily })} />

        <Pressable accessibilityRole="button" onPress={() => router.replace("/")} style={({ pressed }) => [sharedStyles.primaryButton, { backgroundColor: colors.primary, marginTop: 22 }, pressed && styles.pressed]}>
          <Text style={[sharedStyles.primaryButtonText, { color: colors.background }]}>Save profile</Text>
        </Pressable>
      </ScrollView>
    </SathiScreen>
  );
}

function FieldLabel({ label }: { label: string }) { const colors = useColors(); return <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>; }
function ToggleRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) { const colors = useColors(); return <View style={[styles.toggleRow, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.toggleLabel, { color: colors.foreground }]}>{label}</Text><Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: colors.primary }} /></View>; }

const styles = StyleSheet.create({
  content: { paddingBottom: 38 }, intro: { fontSize: 14, lineHeight: 20, marginTop: -10, marginBottom: 19 },
  formCard: { borderWidth: 1, borderRadius: 22, padding: 17 }, fieldLabel: { fontSize: 13, fontWeight: "800", marginTop: 16, marginBottom: 8 },
  selectRow: { minHeight: 49, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, selectText: { fontSize: 15, fontWeight: "600" },
  chipGroup: { flexDirection: "row", flexWrap: "wrap", gap: 7 }, optionalHeading: { fontSize: 17, fontWeight: "800", marginTop: 24 }, optionalDescription: { fontSize: 13, lineHeight: 19, marginTop: 4, marginBottom: 10 },
  toggleRow: { borderWidth: 1, borderRadius: 17, paddingVertical: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }, toggleLabel: { fontSize: 13, fontWeight: "700", flex: 1, marginRight: 16 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
