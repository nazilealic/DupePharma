import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Image, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

const CATEGORIES = ['', 'nemlendirici', 'temizleyici', 'güneş koruyucu', 'serum', 'tonik', 'takviye'];
const CAT_LABELS = { '': 'Tümü', nemlendirici: 'Nemlendirici', temizleyici: 'Temizleyici', 'güneş koruyucu': 'Güneş', serum: 'Serum', tonik: 'Tonik', takviye: 'Takviye' };

function Stars({ value }) {
  const full = Math.round(value || 0);
  return (
    <Text style={{ color: COLORS.accent, fontSize: 13 }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </Text>
  );
}

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState({});
  const { user } = useAuth();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let params = `?page=${page}&limit=12`;
      if (category) params += `&category=${encodeURIComponent(category)}`;
      const data = await api.getProducts(params);
      setProducts(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    setLoading(false);
  }, [page, category]);

  const fetchFavorites = useCallback(async () => {
    try {
      const data = await api.getFavorites(user.id);
      if (Array.isArray(data)) setFavorites(data.map(f => f._id || f));
    } catch {}
  }, [user.id]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const handleSearch = async () => {
    if (!search.trim()) { setPage(1); return fetchProducts(); }
    setLoading(true);
    try {
      const data = await api.searchProducts(search);
      setProducts(Array.isArray(data) ? data : []);
      setPagination({});
    } catch {}
    setLoading(false);
  };

  const toggleFav = async (pid) => {
    setFavLoading(f => ({ ...f, [pid]: true }));
    try {
      if (favorites.includes(pid)) {
        await api.removeFavorite(user.id, pid);
        setFavorites(f => f.filter(id => id !== pid));
      } else {
        await api.addFavorite(user.id, pid);
        setFavorites(f => [...f, pid]);
      }
    } catch {
      Alert.alert('Hata', 'İşlem başarısız.');
    }
    setFavLoading(f => ({ ...f, [pid]: false }));
  };

  const renderProduct = ({ item: p }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { id: p._id, name: p.name })}
      activeOpacity={0.85}
    >
      <View style={styles.cardImg}>
        {p.imageUrl
          ? <Image source={{ uri: p.imageUrl }} style={styles.productImg} resizeMode="contain" />
          : <Text style={{ fontSize: 36 }}>💊</Text>
        }
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.brand} numberOfLines={1}>{p.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
        <Text style={styles.price}>{p.price?.toFixed(2)} ₺</Text>
        <Text style={styles.catBadge}>{p.category}</Text>
        {p.averageRating > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Stars value={p.averageRating} />
            <Text style={styles.ratingCount}>({p.totalRatings})</Text>
          </View>
        )}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, favorites.includes(p._id) && styles.actionBtnActive]}
            onPress={() => toggleFav(p._id)}
            disabled={favLoading[p._id]}
          >
            <Text style={{ fontSize: 13, color: favorites.includes(p._id) ? COLORS.danger : COLORS.text2 }}>
              {favorites.includes(p._id) ? '♥ Favoride' : '♡ Favori'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Reviews', { productId: p._id, productName: p.name })}
          >
            <Text style={{ fontSize: 13, color: COLORS.text2 }}>💬 Yorum</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Arama */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Ürün adı veya marka ara..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={{ color: COLORS.white, fontWeight: '700' }}>🔍</Text>
        </TouchableOpacity>
        {search.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => { setSearch(''); setPage(1); fetchProducts(); }}>
            <Text style={{ color: COLORS.text2 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Kategori filtreleri */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        style={styles.catList}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, category === item && styles.catChipActive]}
            onPress={() => { setCategory(item); setPage(1); }}
          >
            <Text style={[styles.catChipText, category === item && styles.catChipTextActive]}>
              {CAT_LABELS[item]}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Ürün listesi */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
          <Text style={styles.emptyText}>Ürün bulunamadı.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={renderProduct}
          ListFooterComponent={
            pagination.totalPages > 1 ? (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                  onPress={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >
                  <Text style={styles.pageBtnText}>← Önceki</Text>
                </TouchableOpacity>
                <Text style={styles.pageInfo}>{page} / {pagination.totalPages}</Text>
                <TouchableOpacity
                  style={[styles.pageBtn, page >= pagination.totalPages && styles.pageBtnDisabled]}
                  onPress={() => setPage(p => p + 1)}
                  disabled={page >= pagination.totalPages}
                >
                  <Text style={styles.pageBtnText}>Sonraki →</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  searchRow: { flexDirection: 'row', padding: 16, gap: 8, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, backgroundColor: COLORS.bg2 },
  searchBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  clearBtn: { backgroundColor: COLORS.bg3, borderRadius: 10, paddingHorizontal: 12, justifyContent: 'center' },
  catList: { backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 10, maxHeight: 52 },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipText: { fontSize: 13, color: COLORS.text2, fontWeight: '500' },
  catChipTextActive: { color: COLORS.white, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: COLORS.text2 },
  emptyText: { fontSize: 16, color: COLORS.text2 },
  card: { flex: 1, backgroundColor: COLORS.white, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardImg: { height: 120, backgroundColor: COLORS.bg2, alignItems: 'center', justifyContent: 'center' },
  productImg: { width: '100%', height: '100%' },
  cardBody: { padding: 10 },
  brand: { fontSize: 11, color: COLORS.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  productName: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginVertical: 3 },
  price: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  catBadge: { fontSize: 11, color: COLORS.text2, marginTop: 2 },
  ratingCount: { fontSize: 11, color: COLORS.text3 },
  cardActions: { flexDirection: 'row', gap: 6, marginTop: 8 },
  actionBtn: { flex: 1, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.bg3, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  actionBtnActive: { borderColor: COLORS.danger },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, paddingVertical: 16 },
  pageBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  pageInfo: { color: COLORS.text2, fontSize: 14 },
});
