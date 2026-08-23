import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/lib/theme-provider";

export default function TabsLayout() {
  const { colorScheme } = useThemeContext();

  return (
    <Tabs
      screenOptions={{
        // ✅ Active tab color
        tabBarActiveTintColor: colorScheme === 'dark' ? '#3b82f6' : '#2563eb',
        
        // ✅ Inactive tab color
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
        
        // ✅ Tab bar background
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#334155' : '#e2e8f0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        
        // ✅ Tab label style
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        
        // ✅ Tab icon style (agar icon hai toh)
        tabBarIconStyle: {
          marginTop: 2,
        },
        
        // ✅ Header style
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
        },
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="discover" 
        options={{ 
          title: "Discover",
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="myplan" 
        options={{ 
          title: "My Plan",
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="updates" 
        options={{ 
          title: "Updates",
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }} 
      />
    </Tabs>
  );
}