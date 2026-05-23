import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAdmin } = useAuth();
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ newPassword: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap', style: 'destructive',
        onPress: async () => {
          try { await api.logout(); } catch {}
          await logout();
        },
      },
    ]);
  };

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwErr('Şifreler eşleşmiyor.'); return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwErr('Şifre en az 8 karakter olmalı.'); return;
    }
    setPwLoading(true); setPwErr(''); setPwMsg('');
    try {
      const res = await api.updatePassword(user.id, { newPassword: pwForm.newPassword });
      if (res.message && !res.code) {
        setPwMsg('Şifre güncellendi! ✅');
        setPwForm({ newPassword: '', confirm: '' });
        setShowPwForm(false);
      } else {
        setPwErr(res.message || 'Güncelleme başarısız.');
      }
    } catch { setPwErr('Sunucuya bağlanılamadı.'); }
    setPwLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Avatar & bilgi */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fullName}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={[styles.roleBadge, isAdmin && styles.roleBadgeAdmin]}>
              <Text style={[styles.roleBadgeText, isAdmin && styles.roleBadgeTextAdmin]}>
                {isAdmin ? '⚙️ Admin' : '👤 Kullanıcı'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Aksiyonlar */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowPwForm(v => !v)}
        >
          <Text style={styles.menuIcon}>🔑</Text>
          <Text style={styles.menuText}>Şifre Değiştir</Text>
          <Text style={styles.menuArrow}>{showPwForm ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showPwForm && (
          <View style={styles.pwForm}>
            {pwErr ? <View style={styles.alertError}><Text style={styles.alertErrorText}>{pwErr}</Text></View> : null}
            {pwMsg ? <View style={styles.alertSuccess}><Text style={styles.alertSuccessText}>{pwMsg}</Text></View> : null}

            <Text style={styles.label}>Yeni Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="En az 8 karakter"
              value={pwForm.newPassword}
              onChangeText={v => setPwForm(f => ({ ...f, newPassword: v }))}
              secureTextEntry
            />
            <Text style={styles.label}>Şifre Tekrar</Text>
            <TextInput
              style={styles.input}
              placeholder="Tekrar girin"
              value={pwForm.confirm}
              onChangeText={v => setPwForm(f => ({ ...f, confirm: v }))}
              secureTextEntry
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={[styles.btnPrimary, { flex: 1 }, pwLoading && { opacity: 0.7 }]}
                onPress={handlePasswordChange}
                disabled={pwLoading}
              >
                {pwLoading
                  ? <ActivityIndicator color={COLORS.white} size="small" />
                  : <Text style={styles.btnPrimaryText}>Güncelle</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnOutline, { flex: 1 }]}
                onPress={() => { setShowPwForm(false); setPwErr(''); setPwMsg(''); }}
              >
                <Text style={styles.btnOutlineText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {isAdmin && (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Admin')}
            >
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuText}>Admin Paneli</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuText, { color: COLORS.danger }]}>Çıkış Yap</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Uygulama bilgisi */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Uygulama Hakkında</Text>
        <Text style={styles.bodyText}>
          DupePharma, sağlık ve kozmetik ürünlerine daha bilinçli ulaşmanızı sağlayan akıllı muadil öneri sistemidir.
        </Text>
        <Text style={[styles.bodyText, { marginTop: 8 }]}>Versiyon: 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: COLORS.primary + '22',
    borderWidth: 2, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  fullName: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  email: { fontSize: 13, color: COLORS.text2, marginTop: 2 },
  roleBadge: { marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, backgroundColor: '#dcfce7' },
  roleBadgeAdmin: { backgroundColor: '#fef3c7' },
  roleBadgeText: { fontSize: 12, color: '#166534', fontWeight: '700' },
  roleBadgeTextAdmin: { color: '#92400e' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  menuArrow: { fontSize: 16, color: COLORS.text3 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  pwForm: { paddingTop: 12, paddingBottom: 4 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: COLORS.bg2, marginBottom: 12 },
  btnPrimary: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 13, alignItems: 'center' },
  btnPrimaryText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  btnOutline: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, padding: 13, alignItems: 'center' },
  btnOutlineText: { color: COLORS.text2, fontWeight: '600', fontSize: 14 },
  alertError: { backgroundColor: '#fee2e2', borderRadius: 8, padding: 10, marginBottom: 10 },
  alertErrorText: { color: '#991b1b', fontSize: 13 },
  alertSuccess: { backgroundColor: '#dcfce7', borderRadius: 8, padding: 10, marginBottom: 10 },
  alertSuccessText: { color: '#166534', fontSize: 13 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  bodyText: { fontSize: 13, color: COLORS.text2, lineHeight: 20 },
});
