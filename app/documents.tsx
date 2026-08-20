import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { PageHeader, ProgressBar, SathiScreen, sharedStyles } from "@/components/sathi-ui";
import { useColors } from "@/hooks/use-colors";
import { useStudentSathi } from "@/lib/studentsathi-store";

export default function DocumentsScreen() {
  const colors = useColors(); const router = useRouter(); const { state, upsertDocument } = useStudentSathi();
  const ready = state.documents.filter((document) => document.status !== "missing").length;
  const chooseDocument = async (id: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*"], copyToCacheDirectory: true });
      if (result.canceled) return;
      const asset = result.assets[0];
      const current = state.documents.find((document) => document.id === id);
      if (!current) return;
      upsertDocument({ ...current, status: "ready", fileName: asset.name, uri: asset.uri, updatedAt: new Date().toISOString() });
      Alert.alert("Document added", `${asset.name} is recorded in this device’s document checklist.`);
    } catch { Alert.alert("Could not select document", "Please try again from your device file picker."); }
  };
  return <SathiScreen><FlatList data={state.documents} keyExtractor={(item) => item.id} contentContainerStyle={[sharedStyles.content, sharedStyles.scrollContent]} ListHeaderComponent={<View><PageHeader eyebrow="Personal document checklist" title="Document vault" /><View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.summaryTop}><View><Text style={[styles.summaryTitle, { color: colors.foreground }]}>{ready}/{state.documents.length} documents ready</Text><Text style={[styles.summaryDescription, { color: colors.muted }]}>Use the device picker to attach a local reference. Confirm provider requirements before applying.</Text></View><MaterialIcons name="folder-shared" size={28} color={colors.primary} /></View><ProgressBar value={state.documents.length ? (ready / state.documents.length) * 100 : 0} /></View><Pressable onPress={() => router.push("/applications")} style={({ pressed }) => [styles.applicationLink, { backgroundColor: "#EAF2FF" }, pressed && styles.pressed]}><MaterialIcons name="assignment" size={19} color={colors.primary} /><Text style={[styles.applicationLinkText, { color: colors.primary }]}>See application-specific checklists</Text><MaterialIcons name="chevron-right" size={20} color={colors.primary} /></Pressable></View>} renderItem={({ item }) => <View style={[styles.documentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={[styles.documentIcon, { backgroundColor: item.status === "missing" ? "#F0F4F8" : "#E8F7ED" }]}><MaterialIcons name={item.status === "missing" ? "description" : "verified"} size={23} color={item.status === "missing" ? colors.muted : colors.success} /></View><View style={styles.documentCopy}><Text style={[styles.documentTitle, { color: colors.foreground }]}>{item.label}</Text><Text style={[styles.documentMeta, { color: colors.muted }]}>{item.fileName ? item.fileName : "Not added yet"}</Text></View><Pressable accessibilityRole="button" onPress={() => chooseDocument(item.id)} style={({ pressed }) => [styles.uploadButton, { borderColor: colors.border }, pressed && styles.pressed]}><Text style={[styles.uploadText, { color: colors.primary }]}>{item.fileName ? "Replace" : "Add"}</Text></Pressable></View>} /></SathiScreen>;
}

const styles = StyleSheet.create({
  summary: { borderWidth: 1, borderRadius: 22, padding: 17 }, summaryTop: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 16 }, summaryTitle: { fontSize: 17, fontWeight: "800" }, summaryDescription: { fontSize: 12, lineHeight: 17, marginTop: 4, maxWidth: 270 }, applicationLink: { borderRadius: 17, padding: 14, flexDirection: "row", alignItems: "center", gap: 9, marginTop: 14, marginBottom: 20 }, applicationLinkText: { flex: 1, fontSize: 13, fontWeight: "800" },
  documentCard: { borderWidth: 1, borderRadius: 19, padding: 13, flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 10 }, documentIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, documentCopy: { flex: 1 }, documentTitle: { fontSize: 14, fontWeight: "800" }, documentMeta: { fontSize: 11, marginTop: 3 }, uploadButton: { borderWidth: 1, borderRadius: 11, paddingVertical: 8, paddingHorizontal: 10 }, uploadText: { fontSize: 12, fontWeight: "800" }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
