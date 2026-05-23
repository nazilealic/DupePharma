import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { COLORS } from '../components/theme';

export default function PharmacyScreen() {
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const { isAdmin } = useAuth();

  const fetchPharmacy = async () => {
    setLoading(true);
    try {
      const data = await api.getOnDutyPharmacy();
      if (data && data.imageUrl) setPharmacy(data);
      else setPharmacy(null);
    } catch { setPharmacy(null); }
    setLoading(false);
  };

  useEffect(() => { fetchPharmacy(); }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galeri erişimi için izin vermeniz gerekiyor.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPreview(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pharmacyListImage', {
        uri: imageUri,
        name: 'pharmacy.jpg',
        type: 'image/jpeg',
      });
      const res = await api.updateOnDutyPharmacy(formData);
      if (res.imageUrl) {
        Alert.alert('Başarılı', 'Nöbetçi eczane listesi güncellendi!');
        setPreview(null);
        setImageUri(null);
        fetchPharmacy();
      } else {
        Alert.alert('Hata', res.message || 'Yükleme başarısız.');
      }
    } catch {
      Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
    }
    setUploading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Admin: Yükleme */}
      {isAdmin && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📤 Listeyi Güncelle</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          </View>

          {preview ? (
            <View style={{ marginVertical: 12 }}>
              <Image source={{ uri: preview }} style={styles.preview} resizeMode="contain" />
              <TouchableOpacity style={styles.btnOutline} onPress={() => { setPreview(null); setImageUri(null); }}>
                <Text style={styles.btnOutlineText}>Görseli Kaldır</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🖼️</Text>
              <Text style={styles.pickBtnText}>Galeriden Görsel Seç</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.uploadBtn, (!imageUri || uploading) && { opacity: 0.5 }]}
            onPress={handleUpload}
            disabled={!imageUri || uploading}
          >
            {uploading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.uploadBtnText}>📤 Listeyi Güncelle</Text>
            }
          </TouchableOpacity>
        </View>
      )}

      {/* Nöbetçi eczane listesi */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Güncel Nöbetçi Eczane Listesi</Text>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 12, color: COLORS.text2 }}>Yükleniyor...</Text>
          </View>
        ) : pharmacy ? (
          <>
            <Text style={styles.updateDate}>
              🕐 Son güncelleme: {new Date(pharmacy.updatedAt).toLocaleString('tr-TR')}
            </Text>
            <Image
              source={{ uri: pharmacy.imageUrl }}
              style={styles.pharmacyImg}
              resizeMode="contain"
            />
          </>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🏥</Text>
            <Text style={styles.emptyTitle}>Liste henüz yüklenmemiş</Text>
            {isAdmin
              ? <Text style={styles.emptySub}>Yukarıdan liste ekleyebilirsiniz.</Text>
              : <Text style={styles.emptySub}>Admin tarafından yakında güncellenecektir.</Text>
            }
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  adminBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  adminBadgeText: { color: '#92400e', fontWeight: '700', fontSize: 12 },
  pickBtn: { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 12, padding: 24, alignItems: 'center', marginVertical: 10, backgroundColor: COLORS.bg2 },
  pickBtnText: { fontSize: 14, color: COLORS.text2, fontWeight: '500' },
  preview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  btnOutline: { borderWidth: 1.5, borderColor: COLORS.danger, borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 10 },
  btnOutlineText: { color: COLORS.danger, fontWeight: '600' },
  uploadBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 14, alignItems: 'center' },
  uploadBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  loadingBox: { padding: 40, alignItems: 'center' },
  updateDate: { fontSize: 12, color: COLORS.text2, marginBottom: 12 },
  pharmacyImg: { width: '100%', height: 500, borderRadius: 10 },
  emptyBox: { padding: 32, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  emptySub: { fontSize: 13, color: COLORS.text2, marginTop: 6, textAlign: 'center' },
});
