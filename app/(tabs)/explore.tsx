import { Href, Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { Colors, Spacing } from '@/constants/app-theme';
import { useAppointments } from '@/providers/appointments-provider';
import { useAppAuth } from '@/providers/auth-provider';

export default function AppointmentsScreen() {
  const { isLoaded, isSignedIn } = useAppAuth();
  const { appointments, cancelAppointment } = useAppointments();

  if (!isLoaded) {
    return <EmptyState title="Loading appointments..." description="Syncing your upcoming bookings." />;
  }

  if (!isSignedIn) {
    return <Redirect href={'/auth/sign-in' as Href} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Your schedule"
          title="Upcoming appointments"
          description="Review your booked sessions and cancel any appointment if your plans change."
        />

        {appointments.length === 0 ? (
          <EmptyState
            title="No appointments booked"
            description="Your confirmed visits will appear here after you reserve a provider slot."
          />
        ) : (
          appointments.map((appointment) => (
            <View key={appointment.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>{appointment.providerName}</Text>
                  <Text style={styles.cardSubtitle}>{appointment.category}</Text>
                </View>
                <Text style={styles.status}>Confirmed</Text>
              </View>
              <Text style={styles.detail}>{appointment.dateLabel}</Text>
              <Text style={styles.detail}>{appointment.time}</Text>
              <Text style={styles.detail}>{appointment.location}</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => cancelAppointment(appointment.id)}>
                <Text style={styles.cancelText}>Cancel booking</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: Colors.subtleText,
    fontSize: 14,
  },
  status: {
    color: Colors.success,
    backgroundColor: Colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
  },
  detail: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  cancelButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.dangerSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  cancelText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});
