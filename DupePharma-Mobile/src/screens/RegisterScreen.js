import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert('Hata', 'Tüm alanları doldurunuz.');
      return;
    }
    if (form.password !== form.confirm) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (res.token) {
        await login(res.token, res.user);
      } else {
        Alert.alert('Hata', res.message || 'Kayıt başarısız.');
      }
    } catch {
      Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>💊</Text>
          <Text style={styles.logoText}>DupePharma</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hesap Oluştur</Text>
          <Text style={styles.cardSub}>Ücretsiz kayıt olun</Text>

          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ad Soyad"
            value={form.fullName}
            onChangeText={v => set('fullName', v)}
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@mail.com"
            value={form.email}
            onChangeText={v => set('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="En az 6 karakter"
            value={form.password}
            onChangeText={v => set('password', v)}
            secureTextEntry
          />

          <Text style={styles.label}>Şifre Tekrar</Text>
          <TextInput
            style={styles.input}
            placeholder="Şifreyi tekrar girin"
            value={form.confirm}
            onChangeText={v => set('confirm', v)}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.btnText}>Kayıt Ol</Text>
            }
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Zaten hesabınız var mı? <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Giriş Yapın</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: COLORS.bg2 },
  logoBox: { alignItems: 'center', marginBottom: 24 },
  logoEmoji: { fontSize: 44 },
  logoText: { fontSize: 26, fontWeight: '800', color: COLORS.primary, marginTop: 6 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardSub: { fontSize: 14, color: COLORS.text2, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 16, backgroundColor: COLORS.bg2, color: COLORS.text },
  btn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
  linkText: { textAlign: 'center', color: COLORS.text2, fontSize: 14 },
});
