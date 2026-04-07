import { Href, Link, Redirect } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/app-theme';
import { useAppAuth } from '@/providers/auth-provider';

export default function SignInScreen() {
  const { isLoaded, isSignedIn, signIn, mode } = useAppAuth();
  const [email, setEmail] = useState('demo@servicebooker.app');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoaded && isSignedIn) {
    return <Redirect href={'/(tabs)' as Href} />;
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError('');
    const result = await signIn(email, password);
    if (!result.ok) {
      setError(result.message);
    }
    setIsSubmitting(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Service Booker</Text>
            <Text style={styles.title}>Book service appointments in minutes</Text>
            <Text style={styles.subtitle}>
              Sign in to browse providers, reserve a slot, and manage upcoming appointments.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.modeBanner}>
              {mode === 'clerk'
                ? 'Clerk mode is active. Use your Clerk credentials.'
                : 'Demo mode is active. The prefilled credentials work out of the box.'}
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={Colors.placeholder}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor={Colors.placeholder}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
            </TouchableOpacity>

            <Link href={'/auth/sign-up' as Href} asChild>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>Create a new account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  hero: {
    gap: 12,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  subtitle: {
    color: Colors.subtleText,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: Spacing.lg,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeBanner: {
    color: Colors.subtleText,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 16,
    backgroundColor: Colors.input,
  },
  button: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  linkButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  error: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});
