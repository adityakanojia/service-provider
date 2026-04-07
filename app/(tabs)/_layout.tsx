import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/app-theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Providers',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.3.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="calendar.badge.clock" color={color} />,
        }}
      />
    </Tabs>
  );
}
