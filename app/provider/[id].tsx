import { Image } from 'expo-image';
import { Href, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { Colors, Spacing } from '@/constants/app-theme';
import { useAppointments } from '@/providers/appointments-provider';
import { useAppAuth } from '@/providers/auth-provider';

export default function ProviderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAppAuth();
  const {
    getProviderById,
    getAvailabilityForProvider,
    bookAppointment,
  } = useAppointments();

  if (!isLoaded) {
    return <EmptyState title="Loading provider..." description="Preparing availability details." />;
  }

  if (!isSignedIn) {
    router.replace('/auth/sign-in' as Href);
    return null;
  }

  const provider = getProviderById(id);

  if (!provider) {
    return <EmptyState title="Provider not found" description="The requested service provider is unavailable." />;
  }

  const availability = getAvailabilityForProvider(provider.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: provider.name, headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Image source={provider.image} style={styles.heroImage} contentFit="cover" />

        <View style={styles.headerCard}>
          <Text style={styles.title}>{provider.name}</Text>
          <Text style={styles.category}>{provider.category}</Text>
          <Text style={styles.description}>{provider.bio}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Rating {provider.rating.toFixed(1)}</Text>
            <Text style={styles.metaItem}>{provider.location}</Text>
            <Text style={styles.metaItem}>${provider.sessionPrice}/session</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          {provider.highlights.map((highlight) => (
            <View key={highlight} style={styles.infoPill}>
              <Text style={styles.infoPillText}>{highlight}</Text>
            </View>
          ))}
        </View>

        <View style={styles.slotsSection}>
          <Text style={styles.slotsTitle}>Available time slots</Text>
          <Text style={styles.slotsSubtitle}>Pick any open time. Reserved slots disappear automatically.</Text>

          {availability.map((day) => (
            <View key={day.dateKey} style={styles.dayBlock}>
              <Text style={styles.dayTitle}>{day.dateLabel}</Text>
              <View style={styles.slotWrap}>
                {day.slots.map((slot) => (
                  <TouchableOpacity
                    key={`${day.dateKey}-${slot.time}`}
                    style={[styles.slotButton, !slot.available && styles.slotButtonDisabled]}
                    disabled={!slot.available}
                    onPress={() => {
                      bookAppointment(provider.id, day.dateKey, day.dateLabel, slot.time);
                      router.push('/(tabs)/explore' as Href);
                    }}>
                    <Text style={[styles.slotText, !slot.available && styles.slotTextDisabled]}>
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  heroImage: {
    width: '100%',
    height: 260,
    borderRadius: 28,
    backgroundColor: Colors.cardMuted,
  },
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: Spacing.lg,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  category: {
    alignSelf: 'flex-start',
    color: Colors.primary,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: '700',
  },
  description: {
    color: Colors.subtleText,
    fontSize: 15,
    lineHeight: 24,
  },
  metaRow: {
    gap: 8,
  },
  metaItem: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  infoPill: {
    backgroundColor: Colors.cardMuted,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  infoPillText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  slotsSection: {
    gap: Spacing.md,
  },
  slotsTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  slotsSubtitle: {
    color: Colors.subtleText,
    fontSize: 14,
  },
  dayBlock: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  slotWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotButton: {
    backgroundColor: Colors.primarySoft,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 88,
    alignItems: 'center',
  },
  slotButtonDisabled: {
    backgroundColor: Colors.cardMuted,
  },
  slotText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  slotTextDisabled: {
    color: Colors.placeholder,
  },
});
