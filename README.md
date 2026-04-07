# Service Booker

Service Booker is an Expo React Native appointment-booking app for Android-focused demos. It lets users register or sign in, browse mock service providers, view provider details, reserve available time slots, review upcoming appointments, and cancel bookings.

## Features

- Clerk-ready authentication with `@clerk/clerk-expo`
- Automatic fallback to local demo authentication when `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is not configured
- Mock service-provider catalog with profile image, category, pricing, bio, and highlights
- Provider detail screen with generated 5-day availability and live slot locking
- Appointment list with persistent local storage and cancellation support
- Expo Router tab navigation optimized for a simple Android test flow

## Tech Stack

- Expo SDK 54
- React Native
- Expo Router
- Clerk Expo
- AsyncStorage for persisted mock users and appointments
- Expo Secure Store for Clerk token caching
- EAS Build configuration for generating an Android APK

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Optional: enable Clerk mode by creating a `.env` file with:

   ```bash
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

3. Start the Expo app:

   ```bash
   npm run start
   ```

4. Run on Android:

   ```bash
   npm run android
   ```

## Demo Credentials

When Clerk is not configured, the app runs in local demo mode with this seeded account:

- Email: `demo@servicebooker.app`
- Password: `password123`

You can also create additional demo accounts from the sign-up screen. Those accounts and appointments are stored locally on the device.

## Project Structure

- `app/auth/*`: sign-in and sign-up screens
- `app/(tabs)/*`: providers list and appointments list
- `app/provider/[id].tsx`: provider details and slot booking
- `providers/auth-provider.tsx`: Clerk integration and demo auth fallback
- `providers/appointments-provider.tsx`: mock providers, slot generation, booking, and persistence
- `lib/mock-data.ts`: provider seed data

## Assumptions

- Mock provider data is sufficient for the assignment; no backend API is required.
- Appointment availability is generated for the next 5 days with fixed mock time slots.
- Booked slots become unavailable for all local users on the device because appointments are stored in shared local storage.
- Clerk sign-up behavior depends on the verification rules configured in your Clerk dashboard.

## Validation

- Run lint:

   ```bash
   npm run lint
   ```

- To create an Android APK for submission, use Expo Application Services:

   ```bash
   npx eas build -p android --profile preview
   ```

This workspace does not produce an APK automatically; the command above is the expected path for generating the installable build.
