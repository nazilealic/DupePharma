import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

export default function LoginScreen({ navigation }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'E-posta ve şifre giriniz.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.login({ email: email.trim(), password });
      if (res.token) {
        await login(res.token, res.user);
      } else {
        Alert.alert('Hata', res.message || 'E-posta veya şifre hatalı.');
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
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>💊</Text>
          <Text style={styles.logoText}>DupePharma</Text>
          <Text style={styles.logoSub}>Akıllı Muadil Sistemi</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
            onPress={() => setTab('login')}
          >
            <Text style={[styles.tabBtnText, tab === 'login' && styles.tabBtnTextActive]}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'forgot' && styles.tabBtnActive]}
            onPress={() => setTab('forgot')}
          >
            <Text style={[styles.tabBtnText, tab === 'forgot' && styles.tabBtnTextActive]}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>

        {tab === 'login' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hoş Geldiniz</Text>
            <Text style={styles.cardSub}>Hesabınıza giriş yapın</Text>

            <Text style={styles.label}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@mail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.btnText}>Giriş Yap</Text>
              }
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>
                Hesabınız yok mu? <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Üye Olun</Text>
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Şifremi Unuttum</Text>
            <Text style={[styles.cardSub, { lineHeight: 22 }]}>
              Şifrenizi sıfırlamak için bizimle iletişime geçin:{'\n'}
              <Text style={{ color: COLORS.primary, fontWeight: '600' }}>dupepharma@gmail.com</Text>
            </Text>
            <TouchableOpacity style={styles.btnOutline} onPress={() => setTab('login')}>
              <Text style={styles.btnOutlineText}>← Giriş Ekranına Dön</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: COLORS.bg2 },
  logoBox: { alignItems: 'center', marginBottom: 32 },
  logoEmoji: { fontSize: 52 },
  logoText: { fontSize: 30, fontWeight: '800', color: COLORS.primary, marginTop: 8 },
  logoSub: { fontSize: 14, color: COLORS.text2, marginTop: 4 },
  tabRow: { flexDirection: 'row', backgroundColor: COLORS.bg3, borderRadius: 10, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabBtnActive: { backgroundColor: COLORS.white, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabBtnText: { fontSize: 14, color: COLORS.text2, fontWeight: '500' },
  tabBtnTextActive: { color: COLORS.primary, fontWeight: '700' },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardSub: { fontSize: 14, color: COLORS.text2, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 16, backgroundColor: COLORS.bg2, color: COLORS.text },
  btn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  btnOutline: { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 },
  btnOutlineText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
  linkText: { textAlign: 'center', color: COLORS.text2, fontSize: 14 },
});
