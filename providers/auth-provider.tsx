import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type AuthResult = {
  ok: boolean;
  message: string;
};

type AppUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: AppUser | null;
  mode: 'clerk' | 'demo';
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const STORAGE_USERS_KEY = 'service-booker-demo-users';
const STORAGE_SESSION_KEY = 'service-booker-demo-session';

const defaultContext: AuthContextValue = {
  isLoaded: false,
  isSignedIn: false,
  user: null,
  mode: 'demo',
  signIn: async () => ({ ok: false, message: 'Authentication is unavailable.' }),
  signUp: async () => ({ ok: false, message: 'Authentication is unavailable.' }),
  signOut: async () => undefined,
};

const AuthContext = createContext<AuthContextValue>(defaultContext);

type DemoStoredUser = AppUser & {
  password: string;
};

const seedUsers: DemoStoredUser[] = [
  {
    id: 'demo-user-1',
    name: 'Demo User',
    email: 'demo@servicebooker.app',
    password: 'password123',
  },
];

function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    async function bootstrap() {
      const storedUsersRaw = await AsyncStorage.getItem(STORAGE_USERS_KEY);
      if (!storedUsersRaw) {
        await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(seedUsers));
      }

      const sessionRaw = await AsyncStorage.getItem(STORAGE_SESSION_KEY);
      if (sessionRaw) {
        setUser(JSON.parse(sessionRaw) as AppUser);
      }
      setIsLoaded(true);
    }

    bootstrap();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoaded,
      isSignedIn: Boolean(user),
      user,
      mode: 'demo',
      async signIn(email, password) {
        const storedUsersRaw = await AsyncStorage.getItem(STORAGE_USERS_KEY);
        const storedUsers = storedUsersRaw ? (JSON.parse(storedUsersRaw) as DemoStoredUser[]) : seedUsers;
        const matchedUser = storedUsers.find(
          (storedUser) =>
            storedUser.email.toLowerCase() === email.trim().toLowerCase() &&
            storedUser.password === password,
        );

        if (!matchedUser) {
          return { ok: false, message: 'Invalid email or password.' };
        }

        const sessionUser: AppUser = {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
        };
        await AsyncStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        return { ok: true, message: 'Signed in successfully.' };
      },
      async signUp(name, email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const storedUsersRaw = await AsyncStorage.getItem(STORAGE_USERS_KEY);
        const storedUsers = storedUsersRaw ? (JSON.parse(storedUsersRaw) as DemoStoredUser[]) : seedUsers;

        if (storedUsers.some((storedUser) => storedUser.email.toLowerCase() === normalizedEmail)) {
          return { ok: false, message: 'An account with this email already exists.' };
        }

        const newUser: DemoStoredUser = {
          id: `demo-user-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          password,
        };
        const nextUsers = [...storedUsers, newUser];
        await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(nextUsers));

        const sessionUser: AppUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        await AsyncStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        return { ok: true, message: 'Account created successfully.' };
      },
      async signOut() {
        await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
        setUser(null);
      },
    }),
    [isLoaded, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function ClerkContextBridge({ children }: { children: ReactNode }) {
  const { useAuth, useClerk, useSignIn, useSignUp, useUser } = require('@clerk/clerk-expo') as typeof import('@clerk/clerk-expo');
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut: clerkSignOut, setActive } = useClerk();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoaded: authLoaded && userLoaded && signInLoaded && signUpLoaded,
      isSignedIn: Boolean(isSignedIn),
      user: user
        ? {
            id: user.id,
            name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'User',
            email: user.primaryEmailAddress?.emailAddress ?? '',
          }
        : null,
      mode: 'clerk',
      async signIn(email, password) {
        if (!signIn) {
          return { ok: false, message: 'Clerk sign-in is still loading.' };
        }

        try {
          const result = await signIn.create({
            identifier: email.trim(),
            password,
          });

          if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId });
            return { ok: true, message: 'Signed in successfully.' };
          }

          return { ok: false, message: 'Clerk requires additional verification to finish sign-in.' };
        } catch (error) {
          return { ok: false, message: extractClerkError(error, 'Unable to sign in with Clerk.') };
        }
      },
      async signUp(name, email, password) {
        if (!signUp) {
          return { ok: false, message: 'Clerk sign-up is still loading.' };
        }

        const [firstName, ...rest] = name.trim().split(' ');
        const lastName = rest.join(' ');

        try {
          const result = await signUp.create({
            emailAddress: email.trim(),
            password,
            firstName,
            lastName,
          });

          if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId });
            return { ok: true, message: 'Account created successfully.' };
          }

          return {
            ok: false,
            message:
              'Clerk account created, but additional verification is required. Complete verification in your configured Clerk flow.',
          };
        } catch (error) {
          return { ok: false, message: extractClerkError(error, 'Unable to create Clerk account.') };
        }
      },
      async signOut() {
        await clerkSignOut();
      },
    }),
    [authLoaded, clerkSignOut, isSignedIn, setActive, signIn, signInLoaded, signUp, signUpLoaded, user, userLoaded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function extractClerkError(error: unknown, fallback: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as { errors?: Array<{ longMessage?: string; message?: string }> }).errors) &&
    (error as { errors: Array<{ longMessage?: string; message?: string }> }).errors[0]
  ) {
    const [firstError] = (error as { errors: Array<{ longMessage?: string; message?: string }> }).errors;
    return firstError.longMessage || firstError.message || fallback;
  }

  return fallback;
}

export function AppAuthProvider({ children }: { children: ReactNode }) {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <DemoAuthProvider>{children}</DemoAuthProvider>;
  }

  const { ClerkProvider } = require('@clerk/clerk-expo') as typeof import('@clerk/clerk-expo');

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkContextBridge>{children}</ClerkContextBridge>
    </ClerkProvider>
  );
}

export function useAppAuth() {
  return useContext(AuthContext);
}
