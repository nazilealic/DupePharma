import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Switch,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

const SKIN_TYPES = ['yağlı', 'kuru', 'karma', 'normal', 'hassas'];
const PROBLEMS = ['akne', 'kızarıklık', 'kuruluk', 'gözenek', 'leke', 'kırışıklık', 'hassasiyet'];

export default function SkinProfileScreen({ navigation }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ skinType: 'normal', sensitivity: false, skinProblems: [] });
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const data = await api.getSkinProfile(user.id);
        if (data && data.skinType) {
          setForm({
            skinType: data.skinType || 'normal',
            sensitivity: data.sensitivity || false,
            skinProblems: data.skinProblems || [],
          });
          setHasProfile(true);
        }
      } catch {}
      setProfileLoading(false);
    };
    fetchProfile();
  }, [user.id]);

  useEffect(() => {
    if (tab === 'history') {
      setHistLoading(true);
      api.getSearchHistory(user.id).then(data => {
        setHistory(Array.isArray(data) ? data : []);
        setHistLoading(false);
      }).catch(() => setHistLoading(false));
    }
  }, [tab, user.id]);

  const toggleProblem = (p) => setForm(f => ({
    ...f,
    skinProblems: f.skinProblems.includes(p)
      ? f.skinProblems.filter(x => x !== p)
      : [...f.skinProblems, p],
  }));

  const handleSubmit = async () => {
    setLoading(true); setMsg(''); setErr('');
    try {
      const fn = hasProfile ? api.updateSkinProfile : api.createSkinProfile;
      const res = await fn(user.id, form);
      if (res.code >= 400) {
        const updateRes = await api.updateSkinProfile(user.id, form);
        if (updateRes.code >= 400) setErr(updateRes.message || 'Hata oluştu.');
        else { setMsg('Cilt profili güncellendi! ✅'); setHasProfile(true); }
      } else {
        setMsg(hasProfile ? 'Cilt profili güncellendi! ✅' : 'Cilt profili oluşturuldu! ✅');
        setHasProfile(true);
      }
    } catch { setErr('Hata oluştu.'); }
    setLoading(false);
  };

  const handleDeleteHistory = () => {
    Alert.alert('Geçmişi Sil', 'Tüm arama geçmişini silmek istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          await api.deleteSearchHistory(user.id);
          setHistory([]);
        },
      },
    ]);
  };

  if (profileLoading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {[{ key: 'profile', label: '🧴 Cilt Profilim' }, { key: 'history', label: '🔍 Arama Geçmişi' }].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabBtnText, tab === t.key && styles.tabBtnTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'profile' && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Cilt Tipiniz</Text>
            <View style={styles.chipRow}>
              {SKIN_TYPES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, form.skinType === s && styles.chipActive]}
                  onPress={() => setForm(f => ({ ...f, skinType: s }))}
                >
                  <Text style={[styles.chipText, form.skinType === s && styles.chipTextActive]}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.switchRow}>
              <Text style={styles.sectionTitle}>Hassas Cilt</Text>
              <Switch
                value={form.sensitivity}
                onValueChange={v => setForm(f => ({ ...f, sensitivity: v }))}
                trackColor={{ true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
            <Text style={{ fontSize: 13, color: COLORS.text2 }}>
              Hassas cilt için özel ürün önerileri alırsınız.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Cilt Sorunlarınız</Text>
            <View style={styles.chipRow}>
              {PROBLEMS.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, form.skinProblems.includes(p) && styles.chipActive]}
                  onPress={() => toggleProblem(p)}
                >
                  <Text style={[styles.chipText, form.skinProblems.includes(p) && styles.chipTextActive]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {msg ? <View style={styles.alertSuccess}><Text style={styles.alertSuccessText}>{msg}</Text></View> : null}
          {err ? <View style={styles.alertError}><Text style={styles.alertErrorText}>{err}</Text></View> : null}

          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.submitBtnText}>{hasProfile ? 'Güncelle' : 'Profil Oluştur'}</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      )}

      {tab === 'history' && (
        <View style={{ flex: 1 }}>
          {histLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : history.length === 0 ? (
            <View style={styles.center}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={styles.emptyText}>Arama geçmişi yok.</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.deleteAllBtn} onPress={handleDeleteHistory}>
                <Text style={styles.deleteAllText}>🗑️ Tümünü Sil</Text>
              </TouchableOpacity>
              <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
                {history.map((h, i) => (
                  <View key={i} style={styles.histItem}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>🔍</Text>
                    <Text style={styles.histText}>{h.query}</Text>
                    <Text style={styles.histDate}>{new Date(h.searchedAt).toLocaleDateString('tr-TR')}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabRow: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: COLORS.primary },
  tabBtnText: { fontSize: 14, color: COLORS.text2, fontWeight: '500' },
  tabBtnTextActive: { color: COLORS.primary, fontWeight: '700' },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.bg3, borderWidth: 1.5, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.text2, fontWeight: '500' },
  chipTextActive: { color: COLORS.white, fontWeight: '700' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  alertSuccess: { backgroundColor: '#dcfce7', borderRadius: 10, padding: 12, marginBottom: 12 },
  alertSuccessText: { color: '#166534', fontSize: 14 },
  alertError: { backgroundColor: '#fee2e2', borderRadius: 10, padding: 12, marginBottom: 12 },
  alertErrorText: { color: '#991b1b', fontSize: 14 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 32 },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  emptyText: { fontSize: 15, color: COLORS.text2, marginTop: 10 },
  deleteAllBtn: { margin: 16, padding: 12, backgroundColor: '#fee2e2', borderRadius: 10, alignItems: 'center' },
  deleteAllText: { color: COLORS.danger, fontWeight: '600', fontSize: 14 },
  histItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  histText: { flex: 1, fontSize: 14, color: COLORS.text },
  histDate: { fontSize: 11, color: COLORS.text3 },
});
