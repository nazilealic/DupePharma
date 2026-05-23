import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert, Modal, FlatList,
} from 'react-native';
import api from '../services/api';
import { COLORS } from '../components/theme';

const EMPTY_PRODUCT = {
  name: '', brand: '', category: '', price: '',
  description: '', ingredients: '', volume: '', imageUrl: '',
};

export default function AdminScreen() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts('?limit=50');
      setProducts(data.data || []);
    } catch {}
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'products') fetchProducts();
    else fetchUsers();
  }, [tab]);

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_PRODUCT);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name || '',
      brand: p.brand || '',
      category: p.category || '',
      price: p.price?.toString() || '',
      description: p.description || '',
      ingredients: (p.ingredients || []).join(', '),
      volume: p.volume || '',
      imageUrl: p.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.brand.trim()) {
      Alert.alert('Hata', 'Ürün adı ve marka zorunludur.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editProduct) {
        await api.updateProduct(editProduct._id, payload);
      } else {
        await api.createProduct(payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch {
      Alert.alert('Hata', 'İşlem başarısız.');
    }
    setSubmitting(false);
  };

  const handleDeleteProduct = (id, name) => {
    Alert.alert('Ürünü Sil', `"${name}" silinecek. Emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          await api.deleteProduct(id);
          fetchProducts();
        },
      },
    ]);
  };

  const handleDeleteUser = (id, name) => {
    Alert.alert('Kullanıcıyı Sil', `"${name}" silinecek. Emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          await api.deleteUser(id);
          fetchUsers();
        },
      },
    ]);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {[{ key: 'products', label: '📦 Ürünler' }, { key: 'users', label: '👥 Kullanıcılar' }].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabBtnText, tab === t.key && styles.tabBtnTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ürünler */}
      {tab === 'products' && (
        <>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Text style={styles.addBtnText}>+ Yeni Ürün Ekle</Text>
          </TouchableOpacity>
          {loading ? (
            <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={item => item._id}
              contentContainerStyle={{ padding: 16, gap: 10 }}
              renderItem={({ item: p }) => (
                <View style={styles.rowCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.rowSub}>{p.brand} • {p.category}</Text>
                    <Text style={styles.rowPrice}>{p.price?.toFixed(2)} ₺</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(p)}>
                      <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '700' }}>Düzenle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteProduct(p._id, p.name)}>
                      <Text style={{ color: COLORS.danger, fontSize: 12, fontWeight: '700' }}>Sil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </>
      )}

      {/* Kullanıcılar */}
      {tab === 'users' && (
        loading ? (
          <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => item._id}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            renderItem={({ item: u }) => (
              <View style={styles.rowCard}>
                <View style={styles.avatarSmall}>
                  <Text style={{ color: COLORS.primary, fontWeight: '700' }}>
                    {u.fullName?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.rowTitle}>{u.fullName}</Text>
                  <Text style={styles.rowSub}>{u.email}</Text>
                  <View style={[styles.rolePill, u.role === 'admin' && styles.rolePillAdmin]}>
                    <Text style={[styles.rolePillText, u.role === 'admin' && styles.rolePillTextAdmin]}>
                      {u.role === 'admin' ? '⚙️ Admin' : '👤 Kullanıcı'}
                    </Text>
                  </View>
                </View>
                {u.role !== 'admin' && (
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(u._id, u.fullName)}>
                    <Text style={{ color: COLORS.danger, fontSize: 12, fontWeight: '700' }}>Sil</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )
      )}

      {/* Ürün Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <ScrollView style={styles.modal} contentContainerStyle={{ padding: 24 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editProduct ? 'Ürünü Düzenle' : 'Yeni Ürün'}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 22, color: COLORS.text2 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {[
            { key: 'name', label: 'Ürün Adı *', placeholder: 'Ürün adı' },
            { key: 'brand', label: 'Marka *', placeholder: 'Marka adı' },
            { key: 'category', label: 'Kategori', placeholder: 'nemlendirici, serum...' },
            { key: 'price', label: 'Fiyat (₺)', placeholder: '0.00', keyboard: 'numeric' },
            { key: 'volume', label: 'Hacim', placeholder: '50ml' },
            { key: 'imageUrl', label: 'Görsel URL', placeholder: 'https://...' },
            { key: 'ingredients', label: 'İçerikler (virgülle ayır)', placeholder: 'Niacinamide, Hyaluronic Acid' },
          ].map(field => (
            <View key={field.key}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChangeText={v => set(field.key, v)}
                keyboardType={field.keyboard || 'default'}
                autoCapitalize={field.key === 'imageUrl' ? 'none' : 'sentences'}
              />
            </View>
          ))}

          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Ürün açıklaması..."
            value={form.description}
            onChangeText={v => set('description', v)}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.submitBtnText}>{editProduct ? 'Güncelle' : 'Ekle'}</Text>
            }
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  tabRow: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: COLORS.primary },
  tabBtnText: { fontSize: 14, color: COLORS.text2, fontWeight: '500' },
  tabBtnTextActive: { color: COLORS.primary, fontWeight: '700' },
  addBtn: { margin: 16, backgroundColor: COLORS.primary, borderRadius: 10, padding: 14, alignItems: 'center' },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  rowCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  rowTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  rowSub: { fontSize: 12, color: COLORS.text2, marginTop: 2 },
  rowPrice: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 4 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1.5, borderColor: COLORS.primary },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1.5, borderColor: COLORS.danger },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '22', alignItems: 'center', justifyContent: 'center' },
  rolePill: { marginTop: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: '#dcfce7' },
  rolePillAdmin: { backgroundColor: '#fef3c7' },
  rolePillText: { fontSize: 11, color: '#166534', fontWeight: '700' },
  rolePillTextAdmin: { color: '#92400e' },
  modal: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: COLORS.bg2, marginBottom: 14 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
