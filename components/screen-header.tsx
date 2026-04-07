import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/app-theme';

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function ScreenHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onActionPress,
}: ScreenHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {actionLabel && onActionPress ? (
        <TouchableOpacity style={styles.action} onPress={onActionPress}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  copy: {
    gap: 8,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  description: {
    color: Colors.subtleText,
    fontSize: 15,
    lineHeight: 23,
  },
  action: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.cardMuted,
  },
  actionText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
