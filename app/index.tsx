import { Href, Redirect } from 'expo-router';

import { EmptyState } from '@/components/empty-state';
import { useAppAuth } from '@/providers/auth-provider';

export default function IndexScreen() {
  const { isLoaded, isSignedIn } = useAppAuth();

  if (!isLoaded) {
    return <EmptyState title="Loading app..." description="Preparing authentication and local data." />;
  }

  return <Redirect href={(isSignedIn ? '/(tabs)' : '/auth/sign-in') as Href} />;
}
