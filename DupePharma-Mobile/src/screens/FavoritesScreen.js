import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getFavorites(user.id);
      setFavorites(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchFavorites);
    return unsubscribe;
  }, [navigation, fetchFavorites]);

  const handleRemove = async (pid) => {
    Alert.alert('Favorilerden Kaldır', 'Bu ürünü favorilerden kaldırmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Kaldır', style: 'destructive',
        onPress: async () => {
          await api.removeFavorite(user.id, pid);
          setFavorites(f => f.filter(p => p._id !== pid));
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
      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 52, marginBottom: 16 }}>♡</Text>
          <Text style={styles.emptyTitle}>Henüz favori ürün yok</Text>
          <Text style={styles.emptySub}>Beğendiğiniz ürünleri favorilere ekleyin</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.btnText}>Ürünlere Git</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item: p }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ProductDetail', { id: p._id, name: p.name })}
              activeOpacity={0.85}
            >
              <View style={styles.imgBox}>
                {p.imageUrl
                  ? <Image source={{ uri: p.imageUrl }} style={styles.productImg} resizeMode="contain" />
                  : <Text style={{ fontSize: 32 }}>💊</Text>
                }
              </View>
              <View style={styles.info}>
                <Text style={styles.brand} numberOfLines={1}>{p.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                <Text style={styles.price}>{p.price?.toFixed(2)} ₺</Text>
                <Text style={styles.cat}>{p.category}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.reviewBtn}
                  onPress={() => navigation.navigate('Reviews', { productId: p._id, productName: p.name })}
                >
                  <Text style={{ fontSize: 18 }}>💬</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemove(p._id)}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  emptySub: { fontSize: 14, color: COLORS.text2, textAlign: 'center', marginTop: 8 },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, marginTop: 20 },
  btnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  card: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  imgBox: { width: 90, backgroundColor: COLORS.bg2, alignItems: 'center', justifyContent: 'center' },
  productImg: { width: 90, height: 90 },
  info: { flex: 1, padding: 12 },
  brand: { fontSize: 11, color: COLORS.accent, fontWeight: '700', textTransform: 'uppercase' },
  productName: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginVertical: 2 },
  price: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  cat: { fontSize: 12, color: COLORS.text2, marginTop: 2 },
  actions: { padding: 10, justifyContent: 'space-between', alignItems: 'center' },
  reviewBtn: { padding: 8, borderRadius: 8, backgroundColor: COLORS.bg3 },
  removeBtn: { padding: 8, borderRadius: 8, backgroundColor: '#fee2e2' },
  removeBtnText: { color: COLORS.danger, fontWeight: '700' },
});
