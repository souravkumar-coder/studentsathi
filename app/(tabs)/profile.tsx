import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeContext } from '@/lib/theme-provider';

export default function ProfileScreen() {
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>
          Profile
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          Student account
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#f8fafc' }]}>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
          Profile settings
        </Text>
        <Text style={[styles.cardText, { color: isDark ? '#f1f5f9' : '#0f172a' }]}>
          Student
        </Text>
        <Text style={[styles.cardMuted, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          0% profile complete
        </Text>
      </View>

      {/* Dark mode toggle button */}
      <View style={[styles.card, { backgroundColor: isDark ? '#1e293b' : '#f8fafc' }]}>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
          Dark appearance
        </Text>
        <Text style={[styles.cardText, { color: isDark ? '#f1f5f9' : '#0f172a' }]}>
          Use a low-light reading theme
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 14,
    marginTop: 4,
  },
  cardMuted: {
    fontSize: 12,
    marginTop: 2,
  },
});