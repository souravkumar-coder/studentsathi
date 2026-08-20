import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { Chip, EmptyState, PageHeader, ScholarshipCard, SathiScreen, sharedStyles } from "@/components/sathi-ui";
import { useColors } from "@/hooks/use-colors";
import { SCHOLARSHIPS } from "@/lib/studentsathi-data";
import { filterScholarships, getEligibility } from "@/lib/studentsathi";
import { useStudentSathi } from "@/lib/studentsathi-store";

const FILTERS = ["Government", "Private", "College", "STEM", "Need based", "Women students"];

export default function DiscoverScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, toggleSaved } = useStudentSathi();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const scholarships = useMemo(() => filterScholarships(SCHOLARSHIPS, query, filters), [filters, query]);
  const toggleFilter = (filter: string) => setFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);

  return (
    <SathiScreen>
      <FlatList
        data={scholarships}
        keyExtractor={(scholarship) => scholarship.id}
        contentContainerStyle={[sharedStyles.content, sharedStyles.scrollContent]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <PageHeader eyebrow="Opportunity finder" title="Discover funding" />
            <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MaterialIcons name="search" size={21} color={colors.primary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by scholarship, course, or type"
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                style={[styles.searchInput, { color: colors.foreground }]}
              />
              {query ? <Pressable onPress={() => setQuery("")} hitSlop={8}><MaterialIcons name="close" size={20} color={colors.muted} /></Pressable> : null}
            </View>
            <FlatList
              horizontal
              data={FILTERS}
              keyExtractor={(filter) => filter}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
              renderItem={({ item }) => <Chip label={item} active={filters.includes(item)} onPress={() => toggleFilter(item)} />}
            />
            <View style={styles.resultsRow}>
              <Text style={[styles.resultsLabel, { color: colors.foreground }]}>{scholarships.length} opportunities</Text>
              {filters.length ? <Pressable onPress={() => setFilters([])}><Text style={[styles.clearText, { color: colors.primary }]}>Clear filters</Text></Pressable> : null}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const match = getEligibility(item, state.profile);
          return <ScholarshipCard scholarship={item} saved={state.savedScholarshipIds.includes(item.id)} matchScore={match.score} onBookmark={() => toggleSaved(item.id)} onPress={() => router.push(`/scholarships/${item.id}` as never)} />;
        }}
        ListEmptyComponent={<EmptyState icon="search-off" title="No matching opportunities" description="Try removing a filter or searching with a different course or keyword." />}
      />
    </SathiScreen>
  );
}

const styles = StyleSheet.create({
  searchBox: { minHeight: 54, borderWidth: 1, borderRadius: 17, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: "600", minHeight: 48 },
  filterList: { paddingTop: 14, paddingBottom: 8 },
  resultsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, marginBottom: 12 },
  resultsLabel: { fontSize: 14, fontWeight: "800" },
  clearText: { fontSize: 13, fontWeight: "800" },
});
