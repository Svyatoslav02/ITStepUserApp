import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  Alert,
  Image,
  Pressable,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

const Donate = ({ isVisible, onClose, theme }) => {
  const t = {
    title: 'Підтримати проєкт',
    go: 'Перейти',
    bank: 'Monobank Банка',
    error: 'Помилка',
    linkError: 'Не вдалося відкрити посилання.',
  };

  const handleGo = async () => {
    const url = 'https://send.monobank.ua/jar/29Npjpt9Kq';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t.error, t.linkError);
      }
    } catch (error) {
      Alert.alert(t.error, error.message);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.bankText, { color: theme.accent }]}>
            {t.bank}
          </Text>

          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {t.title}
          </Text>

          <View style={styles.qrCodeContainer}>
            <Image
              source={require('./Img/qr.png')}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          <Pressable
            onPress={handleGo}
            style={({ pressed }) => [
              styles.goButton,
              {
                backgroundColor: pressed
                  ? theme.favBtnBg + 'cc'
                  : theme.favBtnBg,
              },
            ]}
          >
            <Text style={[styles.goButtonText, { color: theme.favBtnText }]}>
              {t.go}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 28,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 14,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
    padding: 8,
  },
  bankText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.6,
  },
  qrCodeContainer: {
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  goButton: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  goButtonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default Donate;
