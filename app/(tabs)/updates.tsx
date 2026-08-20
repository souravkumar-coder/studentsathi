import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { PageHeader, SathiScreen, sharedStyles } from "@/components/sathi-ui";
import { useColors } from "@/hooks/use-colors";
import { NEWS_ITEMS } from "@/lib/studentsathi-data";

export default function UpdatesScreen() {
  const colors = useColors();
  const router = useRouter();
  return (
    <SathiScreen>
      <FlatList
        data={NEWS_ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[sharedStyles.content, sharedStyles.scrollContent]}
        ListHeaderComponent={
          <View>
            <PageHeader eyebrow="Student information hub" title="Updates for you" />
            <Pressable accessibilityRole="button" onPress={() => router.push("/assistant" as never)} style={({ pressed }) => [styles.assistantBanner, { backgroundColor: "#EAF2FF" }, pressed && styles.pressed]}>
              <View style={styles.assistantIcon}><MaterialIcons name="smart-toy" size={23} color={colors.primary} /></View>
              <View style={styles.assistantCopy}><Text style={[styles.assistantTitle, { color: colors.foreground }]}>Need help understanding an update?</Text><Text style={[styles.assistantDescription, { color: colors.muted }]}>Ask Sathi in Hindi or English.</Text></View>
              <MaterialIcons name="chevron-right" size={22} color={colors.primary} />
            </Pressable>
            <Text style={[styles.feedLabel, { color: colors.muted }]}>STUDENTSSATHI GUIDES</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.newsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.newsTop}><Text style={[styles.category, { color: colors.primary }]}>{item.category}</Text>{item.important ? <View style={[styles.important, { backgroundColor: "#FFF4DE" }]}><Text style={[styles.importantText, { color: colors.warning }]}>Important</Text></View> : null}</View>
            <Text style={[styles.newsTitle, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.newsSummary, { color: colors.muted }]}>{item.summary}</Text>
            <Text style={[styles.newsMeta, { color: colors.muted }]}>{item.updatedLabel}</Text>
          </View>
        )}
      />
    </SathiScreen>
  );
}

const styles = StyleSheet.create({
  assistantBanner: { borderRadius: 21, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 },
  assistantIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  assistantCopy: { flex: 1 },
  assistantTitle: { fontSize: 14, fontWeight: "800" },
  assistantDescription: { fontSize: 12, marginTop: 3 },
  feedLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 9 },
  newsCard: { borderWidth: 1, borderRadius: 22, padding: 17, marginBottom: 12 },
  newsTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  category: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  important: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  importantText: { fontSize: 10, fontWeight: "800" },
  newsTitle: { fontSize: 17, lineHeight: 22, fontWeight: "800" },
  newsSummary: { fontSize: 13, lineHeight: 19, marginTop: 7 },
  newsMeta: { fontSize: 11, fontWeight: "700", marginTop: 13 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
