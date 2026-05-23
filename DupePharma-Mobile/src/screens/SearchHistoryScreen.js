import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

export default function SearchHistoryScreen() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getSearchHistory(user.id);
      setHistory(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  }, [user.id]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleDelete = () => {
    Alert.alert('Gecmisi Sil', 'Tum arama gecmisinizi silmek istiyor musunuz?', [
      { text: 'Iptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          await api.deleteSearchHistory(user.id);
          setHistory([]);
        },
      },
    ]);
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Arama Gecmisi</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🕐</Text>
          <Text style={styles.emptyText}>Arama gecmisi yok.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>🔍 {item.query || item.searchTerm || item}</Text>
              {item.createdAt && (
                <Text style={styles.historyDate}>
                  {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                </Text>
              )}
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>Tumunu Sil</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  header: { padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 16, color: COLORS.text2 },
  historyItem: { backgroundColor: COLORS.white, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  historyText: { fontSize: 14, color: COLORS.text },
  historyDate: { fontSize: 11, color: COLORS.text3, marginTop: 4 },
  deleteBtn: { backgroundColor: COLORS.danger, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 16 },
  deleteBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});