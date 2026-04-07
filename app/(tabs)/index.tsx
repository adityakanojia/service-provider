import { Image } from 'expo-image';
import { Href, Link, Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { Colors, Spacing } from '@/constants/app-theme';
import { useAppointments } from '@/providers/appointments-provider';
import { useAppAuth } from '@/providers/auth-provider';

export default function ProvidersScreen() {
  const { isLoaded, isSignedIn, user, signOut } = useAppAuth();
  const { providers, appointments } = useAppointments();

  if (!isLoaded) {
    return <EmptyState title="Loading your workspace..." description="Preparing providers and appointments." />;
  }

  if (!isSignedIn) {
    return <Redirect href={'/auth/sign-in' as Href} />;
  }

  const nextAppointment = appointments[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Appointment Booking"
          title={`Welcome, ${user?.name.split(' ')[0] ?? 'Guest'}`}
          description="Browse trusted professionals, reserve an open slot, and manage everything from one place."
          actionLabel="Log Out"
          onActionPress={signOut}
        />

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Next appointment</Text>
          {nextAppointment ? (
            <>
              <Text style={styles.heroTitle}>{nextAppointment.providerName}</Text>
              <Text style={styles.heroMeta}>
                {nextAppointment.category} • {nextAppointment.dateLabel} at {nextAppointment.time}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroTitle}>No booking yet</Text>
              <Text style={styles.heroMeta}>Choose a provider below to reserve your first time slot.</Text>
            </>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured providers</Text>
          <Text style={styles.sectionSubtitle}>{providers.length} professionals ready to book</Text>
        </View>

        {providers.map((provider) => (
          <Link href={`/provider/${provider.id}` as Href} key={provider.id} asChild>
            <TouchableOpacity style={styles.card}>
              <Image source={provider.image} style={styles.avatar} contentFit="cover" />
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle}>{provider.name}</Text>
                  <Text style={styles.rating}>{provider.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.badge}>{provider.category}</Text>
                <Text style={styles.cardText}>{provider.bio}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>{provider.location}</Text>
                  <Text style={styles.footerText}>${provider.sessionPrice}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
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
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    padding: Spacing.lg,
    gap: 8,
  },
  heroLabel: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  heroMeta: {
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.92,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: Colors.subtleText,
    fontSize: 14,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: Colors.cardMuted,
  },
  cardBody: {
    flex: 1,
    gap: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  rating: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  badge: {
    alignSelf: 'flex-start',
    color: Colors.primary,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
  },
  cardText: {
    color: Colors.subtleText,
    fontSize: 14,
    lineHeight: 21,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
