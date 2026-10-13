import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export function LoadingState({ message = 'Завантаження…', theme }) {
  return (
    <View style={styles.state}>
      <ActivityIndicator color={theme.accent} />
      <Text style={[styles.title, { color: theme.text }]}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message = 'Щось пішло не так.', onRetry, retryLabel = 'Спробувати ще', theme }) {
  return (
    <View style={[styles.state, styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.button, { backgroundColor: theme.accent }]}
          activeOpacity={0.82}
        >
          <Text style={[styles.buttonText, { color: theme.favBtnText }]}>{retryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function EmptyState({ message = 'Тут поки нічого немає.', theme, framed = true }) {
  return (
    <View style={[styles.state, framed && styles.card, framed && { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  card: {
    borderRadius: 14,
    marginHorizontal: 18,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
