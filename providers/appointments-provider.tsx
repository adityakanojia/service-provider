import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { serviceProviders, ServiceProvider } from '@/lib/mock-data';
import { useAppAuth } from '@/providers/auth-provider';

type StoredAppointment = {
  id: string;
  userId: string;
  providerId: string;
  providerName: string;
  category: string;
  location: string;
  dateKey: string;
  dateLabel: string;
  time: string;
  createdAt: string;
};

type AvailabilityDay = {
  dateKey: string;
  dateLabel: string;
  slots: Array<{
    time: string;
    available: boolean;
  }>;
};

type AppointmentsContextValue = {
  providers: ServiceProvider[];
  appointments: StoredAppointment[];
  getProviderById: (id: string) => ServiceProvider | undefined;
  getAvailabilityForProvider: (providerId: string) => AvailabilityDay[];
  bookAppointment: (providerId: string, dateKey: string, dateLabel: string, time: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
};

const STORAGE_APPOINTMENTS_KEY = 'service-booker-appointments';
const slotTemplate = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:30 PM'];

const AppointmentsContext = createContext<AppointmentsContextValue>({
  providers: serviceProviders,
  appointments: [],
  getProviderById: () => undefined,
  getAvailabilityForProvider: () => [],
  bookAppointment: async () => undefined,
  cancelAppointment: async () => undefined,
});

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAppAuth();
  const [allAppointments, setAllAppointments] = useState<StoredAppointment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadAppointments() {
      const stored = await AsyncStorage.getItem(STORAGE_APPOINTMENTS_KEY);
      if (stored) {
        setAllAppointments(JSON.parse(stored) as StoredAppointment[]);
      }
      setLoaded(true);
    }

    loadAppointments();
  }, []);

  async function persistAppointments(nextAppointments: StoredAppointment[]) {
    setAllAppointments(nextAppointments);
    await AsyncStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(nextAppointments));
  }

  const userAppointments = useMemo(() => {
    if (!user) {
      return [];
    }

    return allAppointments
      .filter((appointment) => appointment.userId === user.id)
      .sort((left, right) => {
        const leftDate = new Date(`${left.dateKey} ${left.time}`).getTime();
        const rightDate = new Date(`${right.dateKey} ${right.time}`).getTime();
        return leftDate - rightDate;
      });
  }, [allAppointments, user]);

  const value = useMemo<AppointmentsContextValue>(
    () => ({
      providers: serviceProviders,
      appointments: loaded ? userAppointments : [],
      getProviderById(id) {
        return serviceProviders.find((provider) => provider.id === id);
      },
      getAvailabilityForProvider(providerId) {
        const days = buildUpcomingDays();

        return days.map((day) => ({
          ...day,
          slots: slotTemplate.map((time) => ({
            time,
            available: !allAppointments.some(
              (appointment) =>
                appointment.providerId === providerId &&
                appointment.dateKey === day.dateKey &&
                appointment.time === time,
            ),
          })),
        }));
      },
      async bookAppointment(providerId, dateKey, dateLabel, time) {
        if (!user) {
          return;
        }

        const provider = serviceProviders.find((item) => item.id === providerId);
        if (!provider) {
          return;
        }

        const alreadyBooked = allAppointments.some(
          (appointment) =>
            appointment.providerId === providerId &&
            appointment.dateKey === dateKey &&
            appointment.time === time,
        );

        if (alreadyBooked) {
          return;
        }

        const nextAppointment: StoredAppointment = {
          id: `appt-${Date.now()}`,
          userId: user.id,
          providerId,
          providerName: provider.name,
          category: provider.category,
          location: provider.location,
          dateKey,
          dateLabel,
          time,
          createdAt: new Date().toISOString(),
        };

        await persistAppointments([...allAppointments, nextAppointment]);
      },
      async cancelAppointment(appointmentId) {
        await persistAppointments(allAppointments.filter((appointment) => appointment.id !== appointmentId));
      },
    }),
    [allAppointments, loaded, user, userAppointments],
  );

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

function buildUpcomingDays() {
  return Array.from({ length: 5 }, (_, index) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + index);

    return {
      dateKey: nextDate.toISOString().slice(0, 10),
      dateLabel: nextDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    };
  });
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}
