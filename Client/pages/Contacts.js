import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import AppContext from '../AppContext';
import { submitFeedback } from '../services/feedbackService';

const TEAM_PHONE = '+380 99 999 9999';
const TEAM_EMAIL = 'team@whatwhere.example';

function isValidReplyContact(value) {
  const contact = value.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhone = /^\+?[\d\s()-]{7,}$/.test(contact);
  return isEmail || isPhone;
}

export default function Contacts({ navigation }) {
  const { theme } = useContext(AppContext);
  const [replyContact, setReplyContact] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!replyContact.trim()) {
      nextErrors.replyContact = 'Вкажіть email або номер телефону.';
    } else if (!isValidReplyContact(replyContact)) {
      nextErrors.replyContact = 'Введіть коректний email або номер телефону.';
    }

    if (!message.trim()) {
      nextErrors.message = 'Напишіть повідомлення.';
    } else if (message.trim().length < 10) {
      nextErrors.message = 'Повідомлення має містити щонайменше 10 символів.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    setStatus('idle');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({ replyContact, message });
      setReplyContact('');
      setMessage('');
      setErrors({});
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { backgroundColor: theme.banner }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Назад"
            >
              <Icon name="chevron-left" size={26} color={theme.bannerText} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.bannerText }]}>Контакти</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Команда WhatWhere</Text>
            <Text style={[styles.description, { color: theme.text2 }]}>Маєте питання або пропозицію? Напишіть нам — ми відповімо за вказаним контактом.</Text>

            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${TEAM_PHONE.replace(/\s/g, '')}`)}>
              <Icon name="phone" size={21} color={theme.accent} />
              <Text style={[styles.contactText, { color: theme.text }]}>{TEAM_PHONE}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`mailto:${TEAM_EMAIL}`)}>
              <Icon name="mail" size={21} color={theme.accent} />
              <Text style={[styles.contactText, { color: theme.text }]}>{TEAM_EMAIL}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.formTitle, { color: theme.text }]}>Зворотний зв’язок</Text>

            <Text style={[styles.label, { color: theme.text }]}>Контакт для відповіді</Text>
            <TextInput
              value={replyContact}
              onChangeText={(value) => {
                setReplyContact(value);
                setErrors((current) => ({ ...current, replyContact: undefined }));
                setStatus('idle');
              }}
              placeholder="Email або номер телефону"
              placeholderTextColor={theme.text2}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                { color: theme.text, borderColor: errors.replyContact ? '#ef4444' : theme.text2 },
              ]}
            />
            {errors.replyContact ? <Text style={styles.errorText}>{errors.replyContact}</Text> : null}

            <Text style={[styles.label, { color: theme.text }]}>Повідомлення</Text>
            <TextInput
              value={message}
              onChangeText={(value) => {
                setMessage(value);
                setErrors((current) => ({ ...current, message: undefined }));
                setStatus('idle');
              }}
              placeholder="Напишіть ваше повідомлення"
              placeholderTextColor={theme.text2}
              multiline
              textAlignVertical="top"
              maxLength={1000}
              style={[
                styles.input,
                styles.messageInput,
                { color: theme.text, borderColor: errors.message ? '#ef4444' : theme.text2 },
              ]}
            />
            {errors.message ? <Text style={styles.errorText}>{errors.message}</Text> : null}

            {status === 'success' ? (
              <View style={styles.statusRow}>
                <Icon name="check-circle" size={20} color="#22c55e" />
                <Text style={[styles.statusText, { color: theme.text }]}>Повідомлення надіслано. Дякуємо!</Text>
              </View>
            ) : null}
            {status === 'error' ? (
              <View style={styles.statusRow}>
                <Icon name="alert-circle" size={20} color="#ef4444" />
                <Text style={[styles.statusText, { color: theme.text }]}>Не вдалося надіслати. Спробуйте ще раз.</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
              style={[
                styles.submitButton,
                { backgroundColor: theme.favBtnBg, opacity: isSubmitting ? 0.7 : 1 },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.favBtnText} />
              ) : (
                <Text style={[styles.submitText, { color: theme.favBtnText }]}>Надіслати</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 12, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 5,
  },
  backButton: { padding: 6, marginRight: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  card: { borderRadius: 16, padding: 18, marginBottom: 14, elevation: 3 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 23, marginBottom: 18 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  contactText: { fontSize: 16, fontWeight: '600', marginLeft: 12 },
  formTitle: { fontSize: 21, fontWeight: '800', marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 7 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: 6 },
  messageInput: { minHeight: 130 },
  errorText: { color: '#ef4444', fontSize: 13, marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusText: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '600' },
  submitButton: { minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  submitText: { fontSize: 16, fontWeight: '800' },
});
