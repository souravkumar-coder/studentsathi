import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { PageHeader, ProgressBar, SathiScreen, SectionHeading, sharedStyles } from "@/components/sathi-ui";
import { startOAuthLogin } from "@/constants/oauth";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { getProfileCompletion } from "@/lib/studentsathi";
import { useStudentSathi } from "@/lib/studentsathi-store";
import { useThemeContext } from "@/lib/theme-provider";

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, setLanguage, setNotificationsEnabled } = useStudentSathi();
  const { colorScheme, setColorScheme } = useThemeContext();
  const { user, isAuthenticated, loading, logout } = useAuth({ autoFetch: false });
  const completion = getProfileCompletion(state.profile);
  const accountName = state.profile.fullName || user?.name || "Student";

  return (
    <SathiScreen>
      <ScrollView contentContainerStyle={[sharedStyles.content, sharedStyles.scrollContent]} showsVerticalScrollIndicator={false}>
        <PageHeader eyebrow="Student account" title="Profile & settings" />
        <Pressable accessibilityRole="button" onPress={() => router.push("/onboarding" as never)} style={({ pressed }) => [styles.profileSummary, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}>
          <View style={[styles.summaryAvatar, { backgroundColor: colors.primary }]}><Text style={[styles.summaryAvatarText, { color: colors.background }]}>{accountName.charAt(0).toUpperCase()}</Text></View>
          <View style={styles.summaryCopy}><Text style={[styles.summaryName, { color: colors.foreground }]}>{accountName}</Text><Text style={[styles.summaryDescription, { color: colors.muted }]}>{completion === 100 ? "Profile ready for matching" : `${completion}% profile complete`}</Text><View style={styles.summaryProgress}><ProgressBar value={completion} /></View></View>
          <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
        </Pressable>

        <SectionHeading title="Preferences" />
        <SettingRow icon="notifications-none" title="Deadline reminders" description="Get local alerts for saved applications" control={<Switch value={state.notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: colors.border, true: colors.primary }} />} />
        <SettingRow icon="dark-mode" title="Dark appearance" description="Use a low-light reading theme" control={<Switch value={colorScheme === "dark"} onValueChange={(enabled) => setColorScheme(enabled ? "dark" : "light")} trackColor={{ false: colors.border, true: colors.primary }} />} />
        <SettingRow icon="translate" title="Language" description={state.language === "en" ? "English" : "हिंदी"} control={<Pressable onPress={() => setLanguage(state.language === "en" ? "hi" : "en")} style={({ pressed }) => [styles.languagePill, { borderColor: colors.border }, pressed && styles.pressed]}><Text style={[styles.languageText, { color: colors.primary }]}>{state.language === "en" ? "हिंदी" : "EN"}</Text></Pressable>} />

        <SectionHeading title="Account & support" />
        <Pressable accessibilityRole="button" onPress={() => isAuthenticated ? logout() : startOAuthLogin()} disabled={loading} style={({ pressed }) => [styles.accountButton, { backgroundColor: isAuthenticated ? colors.surface : colors.primary, borderColor: colors.border }, pressed && styles.pressed]}>
          <MaterialIcons name={isAuthenticated ? "logout" : "login"} size={20} color={isAuthenticated ? colors.foreground : colors.background} />
          <Text style={[styles.accountButtonText, { color: isAuthenticated ? colors.foreground : colors.background }]}>{loading ? "Checking account…" : isAuthenticated ? "Sign out" : "Sign in to sync later"}</Text>
        </Pressable>
        <SettingRow icon="smart-toy" title="Ask Sathi" description="Guidance for discovery, documents, and applications" onPress={() => router.push("/assistant" as never)} />
        <SettingRow icon="help-outline" title="Help & FAQ" description="Understand StudentSathi’s guidance and privacy approach" onPress={() => router.push("/assistant" as never)} />
        <SettingRow icon="admin-panel-settings" title="Future workspaces" description="College, provider, and admin access is planned for a future release" />
      </ScrollView>
    </SathiScreen>
  );
}

function SettingRow({ icon, title, description, control, onPress }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string; control?: React.ReactNode; onPress?: () => void }) {
  const colors = useColors();
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && onPress && styles.pressed]}>
      <View style={[styles.settingIcon, { backgroundColor: "#EAF2FF" }]}><MaterialIcons name={icon} size={20} color={colors.primary} /></View>
      <View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.settingDescription, { color: colors.muted }]}>{description}</Text></View>
      {control ?? (onPress ? <MaterialIcons name="chevron-right" size={22} color={colors.muted} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileSummary: { borderWidth: 1, borderRadius: 22, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  summaryAvatar: { width: 48, height: 48, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  summaryAvatarText: { fontSize: 20, fontWeight: "800" },
  summaryCopy: { flex: 1 },
  summaryName: { fontSize: 16, fontWeight: "800" },
  summaryDescription: { fontSize: 12, marginTop: 3 },
  summaryProgress: { marginTop: 9 },
  settingRow: { borderWidth: 1, borderRadius: 18, padding: 13, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 9 },
  settingIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  settingCopy: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: "800" },
  settingDescription: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  languagePill: { borderWidth: 1, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 10 },
  languageText: { fontSize: 12, fontWeight: "800" },
  accountButton: { minHeight: 52, borderRadius: 16, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 9 },
  accountButtonText: { fontSize: 14, fontWeight: "800" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
