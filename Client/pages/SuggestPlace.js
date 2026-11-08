import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import AppContext from '../AppContext';
import { submitPlaceSuggestion } from '../services/placeSuggestionService';

const CATEGORIES = [
  { id: 'food', label: 'Їжа', icon: 'coffee' },
  { id: 'culture', label: 'Культура', icon: 'book-open' },
  { id: 'nature', label: 'Природа', icon: 'wind' },
  { id: 'shopping', label: 'Шопінг', icon: 'shopping-bag' },
  { id: 'entertainment', label: 'Розваги', icon: 'film' },
  { id: 'hotels', label: 'Готелі', icon: 'moon' },
];

function validateContact(value) {
  const contact = value.trim();
  if (!contact) return true;

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isWebsite = /^https?:\/\/\S+$/i.test(contact);
  const isPhone = /^[+\d\s().-]+$/.test(contact)
    && contact.replace(/\D/g, '').length >= 7
    && contact.replace(/\D/g, '').length <= 15;

  return isEmail || isWebsite || isPhone;
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  theme,
  error,
  multiline = false,
  keyboardType = 'default',
  maxLength,
  autoCapitalize = 'sentences',
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.text2}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        autoCorrect={multiline}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          { color: theme.text, borderColor: error ? '#ef4444' : theme.text2 },
        ]}
        accessibilityLabel={label}
        accessibilityHint={error || undefined}
      />
      {error ? <Text accessibilityLiveRegion="polite" style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function SuggestPlace({ navigation, route }) {
  const { theme, isDarkMode, selectedCity } = useContext(AppContext);
  const [city, setCity] = useState(route.params?.city || selectedCity || '');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [placeContacts, setPlaceContacts] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [submissionMode, setSubmissionMode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLockRef = useRef(false);

  useEffect(() => {
    const routeCity = route.params?.city;
    if (!routeCity) return;

    setCity(routeCity);
    setErrors((current) => ({ ...current, city: undefined }));
  }, [route.params?.city]);

  const updateField = (field, setter) => (value) => {
    setter(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus('idle');
  };

  const validate = () => {
    const nextErrors = {};
    if (!city.trim()) nextErrors.city = 'Вкажіть місто.';
    if (!name.trim()) nextErrors.name = 'Вкажіть назву місця.';
    if (!category) nextErrors.category = 'Оберіть категорію.';
    if (address.trim().length > 200) nextErrors.address = 'Адреса має містити не більше 200 символів.';
    if (description.trim().length > 1000) nextErrors.description = 'Опис має містити не більше 1000 символів.';
    if (!validateContact(placeContacts)) nextErrors.placeContacts = 'Вкажіть телефон, email або посилання на сайт.';
    if (!validateContact(senderContact)) nextErrors.senderContact = 'Вкажіть коректний email, телефон або посилання.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    setStatus('idle');
    if (submissionLockRef.current || !validate()) return;

    submissionLockRef.current = true;
    setIsSubmitting(true);
    try {
      const result = await submitPlaceSuggestion({
        city,
        name,
        category,
        address,
        description,
        placeContacts,
        senderContact,
      });
      setSubmissionMode(result.mode);
      setStatus('success');
      setErrors({});
    } catch {
      setStatus('error');
    } finally {
      submissionLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
            <Text style={[styles.headerTitle, { color: theme.bannerText }]}>Запропонувати місце</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.intro, { color: theme.text2 }]}>Не знайшли місце в каталозі? Розкажіть про нього.</Text>

            <FormField
              label="Місто *"
              value={city}
              onChangeText={updateField('city', setCity)}
              placeholder="Наприклад, Івано-Франківськ"
              theme={theme}
              error={errors.city}
              maxLength={100}
            />
            <FormField
              label="Назва місця *"
              value={name}
              onChangeText={updateField('name', setName)}
              placeholder="Назва закладу або локації"
              theme={theme}
              error={errors.name}
              maxLength={120}
            />

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Категорія *</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((item) => {
                  const isSelected = category === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        setCategory(item.id);
                        setErrors((current) => ({ ...current, category: undefined }));
                        setStatus('idle');
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      style={[
                        styles.categoryOption,
                        {
                          backgroundColor: isSelected ? theme.accent : theme.card,
                          borderColor: isSelected ? theme.accent : theme.text2,
                        },
                      ]}
                    >
                      <Icon name={item.icon} size={17} color={isSelected ? theme.favBtnText : theme.text} />
                      <Text style={[styles.categoryText, { color: isSelected ? theme.favBtnText : theme.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.category ? <Text accessibilityLiveRegion="polite" style={styles.errorText}>{errors.category}</Text> : null}
            </View>

            <FormField
              label="Адреса"
              value={address}
              onChangeText={updateField('address', setAddress)}
              placeholder="Вулиця, номер будинку"
              theme={theme}
              error={errors.address}
              maxLength={200}
            />
            <FormField
              label="Опис"
              value={description}
              onChangeText={updateField('description', setDescription)}
              placeholder="Що варто знати про це місце?"
              theme={theme}
              error={errors.description}
              multiline
              maxLength={1000}
            />
            <FormField
              label="Контакти місця"
              value={placeContacts}
              onChangeText={updateField('placeContacts', setPlaceContacts)}
              placeholder="Телефон, email або https://сайт"
              theme={theme}
              error={errors.placeContacts}
              autoCapitalize="none"
              maxLength={160}
            />
            <FormField
              label="Ваш контакт для уточнень"
              value={senderContact}
              onChangeText={updateField('senderContact', setSenderContact)}
              placeholder="Email або телефон (необов’язково)"
              theme={theme}
              error={errors.senderContact}
              autoCapitalize="none"
              maxLength={160}
            />

            {status === 'success' ? (
              <View style={styles.statusRow}>
                <Icon name="check-circle" size={20} color="#22c55e" />
                <Text style={[styles.statusText, { color: theme.text }]}>
                  {submissionMode === 'demo'
                    ? 'Форму прийнято. Щоб передавати пропозиції команді, підключіть API.'
                    : 'Дякуємо! Пропозицію надіслано.'}
                </Text>
              </View>
            ) : null}
            {status === 'error' ? (
              <View style={styles.statusRow}>
                <Icon name="alert-circle" size={20} color="#ef4444" />
                <Text style={[styles.statusText, { color: theme.text }]}>Не вдалося надіслати пропозицію. Перевірте інтернет і спробуйте ще раз.</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              style={[styles.submitButton, { backgroundColor: theme.favBtnBg, opacity: isSubmitting ? 0.7 : 1 }]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.favBtnText} />
              ) : (
                <Text style={[styles.submitText, { color: theme.favBtnText }]}>Надіслати пропозицію</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12, marginBottom: 12, elevation: 5 },
  backButton: { padding: 6, marginRight: 4 },
  headerTitle: { flex: 1, fontSize: 19, fontWeight: '700' },
  card: { borderRadius: 16, padding: 18, marginBottom: 14, elevation: 3 },
  intro: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 7 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  multilineInput: { minHeight: 108 },
  errorText: { color: '#ef4444', fontSize: 13, marginTop: 5 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryOption: { minHeight: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8 },
  categoryText: { fontSize: 14, fontWeight: '600', marginLeft: 7 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  submitButton: { minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 18, paddingHorizontal: 12 },
  submitText: { fontSize: 16, fontWeight: '800' },
});
