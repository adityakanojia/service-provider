import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppointmentsProvider } from '@/providers/appointments-provider';
import { AppAuthProvider } from '@/providers/auth-provider';

export default function RootLayout() {
  return (
    <AppAuthProvider>
      <AppointmentsProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f6f7fb' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/sign-in" />
          <Stack.Screen name="auth/sign-up" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="provider/[id]" />
        </Stack>
        <StatusBar style="dark" />
      </AppointmentsProvider>
    </AppAuthProvider>
  );
}
