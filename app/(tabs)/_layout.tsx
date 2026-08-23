import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          color: '#0f172a',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen name="myplan" options={{ title: "My Plan" }} />
      <Tabs.Screen name="updates" options={{ title: "Updates" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="applications" options={{ title: "Applications" }} />
    </Tabs>
  );
}