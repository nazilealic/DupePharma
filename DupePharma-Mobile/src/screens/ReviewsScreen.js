import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert, Modal,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

function StarPicker({ value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <TouchableOpacity key={s} onPress={() => onChange(s)}>
          <Text style={{ fontSize: 28, color: s <= value ? COLORS.accent : COLORS.border }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ReviewsScreen({ route }) {
  const { productId, productName } = route.params;
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [form, setForm] = useState({ comment: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getReviews(productId);
      setReviews(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const openAdd = () => {
    setEditReview(null);
    setForm({ comment: '', rating: 5 });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditReview(r);
    setForm({ comment: r.comment || r.body || '', rating: r.rating || 5 });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.comment.trim()) {
      Alert.alert('Hata', 'Yorum zorunludur.');
      return;
    }
    setSubmitting(true);
    try {
      if (editReview) {
        await api.updateReview(productId, editReview._id || editReview.id, form);
      } else {
        await api.createReview(productId, form);
      }
      setShowModal(false);
      fetchReviews();
    } catch {
      Alert.alert('Hata', 'Islem basarisiz.');
    }
    setSubmitting(false);
  };

  const handleDelete = (reviewId) => {
    Alert.alert('Yorumu Sil', 'Bu yorumu silmek istiyor musunuz?', [
      { text: 'Iptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          await api.deleteReview(productId, reviewId);
          fetchReviews();
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
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle} numberOfLines={1}>{productName}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Yorum Ekle</Text>
        </TouchableOpacity>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>💬</Text>
          <Text style={styles.emptyText}>Henuz yorum yapilmamis.</Text>
          <Text style={styles.emptySub}>Ilk yorumu siz yapin!</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={item => item._id || item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item: r }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {r.userName?.[0]?.toUpperCase() || r.user?.fullName?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewUser}>{r.userName || r.user?.fullName || 'Kullanici'}</Text>
                  <Text style={{ color: COLORS.accent, fontSize: 13 }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </Text>
                </View>
                {(r.userId === user?.id || r.user?._id === user?.id) && (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity onPress={() => openEdit(r)}>
                      <Text style={styles.editText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(r._id || r.id)}>
                      <Text style={styles.deleteText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text style={styles.reviewBody}>{r.comment || r.body}</Text>
              <Text style={styles.reviewDate}>
                {new Date(r.createdAt).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          )}
        />
      )}

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editReview ? 'Yorumu Duzenle' : 'Yorum Ekle'}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 22, color: COLORS.text2 }}>X</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Puan</Text>
          <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />

          <Text style={[styles.label, { marginTop: 16 }]}>Yorum</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Urun hakkinda dusuncelerinizi yazin..."
            value={form.comment}
            onChangeText={v => setForm(f => ({ ...f, comment: v }))}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.submitBtnText}>{editReview ? 'Guncelle' : 'Yayinla'}</Text>
            }
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  topBarTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text, marginRight: 12 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  emptySub: { fontSize: 13, color: COLORS.text2, marginTop: 6 },
  reviewCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primary + '22', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.primary, fontWeight: '700', fontSize: 16 },
  reviewUser: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  reviewBody: { fontSize: 14, color: COLORS.text2, lineHeight: 21 },
  reviewDate: { fontSize: 11, color: COLORS.text3, marginTop: 8 },
  editText: { fontSize: 18 },
  deleteText: { fontSize: 18 },
  modal: { flex: 1, padding: 24, backgroundColor: COLORS.white },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, fontSize: 15, backgroundColor: COLORS.bg2, marginBottom: 16 },
  textarea: { height: 120 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});