import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/app-theme';

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: Colors.subtleText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
