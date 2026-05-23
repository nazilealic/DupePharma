import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator, Alert,
} from 'react-native';
import api from '../services/api';
import { COLORS } from '../components/theme';

function Stars({ value }) {
  const full = Math.round(value || 0);
  return <Text style={{ color: COLORS.accent, fontSize: 14 }}>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</Text>;
}

const TABS = [
  { key: 'detail', label: 'Detaylar' },
  { key: 'alternatives', label: 'Muadiller' },
  { key: 'price', label: 'Fiyat' },
];

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [prices, setPrices] = useState([]);
  const [aiReport, setAiReport] = useState(null);
  const [tab, setTab] = useState('detail');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prod, alts, pc] = await Promise.all([
          api.getProductDetails(id),
          api.getAlternatives(id),
          api.getPriceComparison(id),
        ]);
        setProduct(prod);
        setAlternatives(Array.isArray(alts) ? alts : []);
        setPrices(Array.isArray(pc) ? pc : []);
      } catch {
        Alert.alert('Hata', 'Ürün yüklenemedi.');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAI = async () => {
    setAiLoading(true);
    try {
      const data = await api.aiAnalysis(id);
      setAiReport(data);
      setTab('ai');
    } catch {
      Alert.alert('Hata', 'AI analizi başarısız.');
    }
    setAiLoading(false);
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={{ marginTop: 12, color: COLORS.text2 }}>Yükleniyor...</Text>
    </View>
  );

  if (!product || product.code === 404) return (
    <View style={styles.center}>
      <Text style={{ fontSize: 40 }}>💊</Text>
      <Text style={styles.emptyText}>Ürün bulunamadı.</Text>
    </View>
  );

  const tabs = aiReport ? [...TABS, { key: 'ai', label: '🤖 AI' }] : TABS;
  const recColor = { 'ÖNERILIR': '#22c55e', 'DİKKATLİ_KULLANIN': '#f59e0b', 'ÖNERİLMEZ': '#ef4444' };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Ürün başlığı */}
      <View style={styles.header}>
        <View style={styles.imgBox}>
          {product.imageUrl
            ? <Image source={{ uri: product.imageUrl }} style={styles.productImg} resizeMode="contain" />
            : <Text style={{ fontSize: 48 }}>💊</Text>
          }
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>{product.price?.toFixed(2)} ₺</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.category}</Text>
            </View>
            {product.volume && (
              <Text style={{ fontSize: 12, color: COLORS.text2 }}>📦 {product.volume}</Text>
            )}
          </View>
          {product.averageRating > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Stars value={product.averageRating} />
              <Text style={{ fontSize: 12, color: COLORS.text2 }}>
                {product.averageRating.toFixed(1)} ({product.totalRatings})
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Butonlar */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, aiLoading && { opacity: 0.7 }]}
          onPress={handleAI}
          disabled={aiLoading}
        >
          {aiLoading
            ? <ActivityIndicator size="small" color={COLORS.white} />
            : <Text style={styles.btnTextWhite}>🤖 AI Analizi</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => navigation.navigate('Reviews', { productId: id, productName: product.name })}
        >
          <Text style={styles.btnTextPrimary}>💬 Yorumlar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {tabs.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabBtnText, tab === t.key && styles.tabBtnTextActive]}>
              {t.key === 'alternatives' ? `Muadiller (${alternatives.length})` : t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detay */}
      {tab === 'detail' && (
        <View style={styles.section}>
          {product.description && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Açıklama</Text>
              <Text style={styles.bodyText}>{product.description}</Text>
            </View>
          )}
          {product.ingredients?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>İçerikler</Text>
              <View style={styles.tagsRow}>
                {product.ingredients.map((ing, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{ing}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {product.usageInstructions && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Kullanım Talimatları</Text>
              <Text style={styles.bodyText}>{product.usageInstructions}</Text>
            </View>
          )}
        </View>
      )}

      {/* Muadiller */}
      {tab === 'alternatives' && (
        <View style={styles.section}>
          {alternatives.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 32 }}>🔄</Text>
              <Text style={styles.emptyText}>Muadil ürün bulunamadı.</Text>
            </View>
          ) : alternatives.map(a => (
            <TouchableOpacity
              key={a._id}
              style={styles.altCard}
              onPress={() => navigation.push('ProductDetail', { id: a._id, name: a.name })}
            >
              <Text style={{ fontSize: 28, marginRight: 12 }}>💊</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.brand}>{a.brand}</Text>
                <Text style={styles.productName}>{a.name}</Text>
                <Text style={styles.price}>{a.price?.toFixed(2)} ₺</Text>
              </View>
              <Text style={{ color: COLORS.text3, fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Fiyat karşılaştırması */}
      {tab === 'price' && (
        <View style={styles.section}>
          {prices.map((item, i) => (
            <View key={i} style={[styles.priceRow, item.isOriginal && styles.priceRowHighlight]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.productName, { fontSize: 13 }]} numberOfLines={1}>{item.productName}</Text>
                <Text style={{ fontSize: 12, color: COLORS.text2 }}>{item.brand} • {item.volume || '-'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.price}>{item.price?.toFixed(2)} ₺</Text>
                <Text style={{ fontSize: 11, color: COLORS.text3 }}>{item.pricePerMl} ₺/ml</Text>
                <View style={[styles.badge, { backgroundColor: item.isOriginal ? '#fef3c7' : '#dcfce7', marginTop: 2 }]}>
                  <Text style={{ fontSize: 11, color: item.isOriginal ? '#92400e' : '#166534' }}>
                    {item.isOriginal ? 'Orijinal' : 'Muadil'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* AI Raporu */}
      {tab === 'ai' && aiReport && (
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Güvenlik Analizi</Text>
              <View style={[styles.badge, { backgroundColor: (recColor[aiReport.recommendation] || COLORS.accent) + '22' }]}>
                <Text style={{ fontSize: 12, color: recColor[aiReport.recommendation] || COLORS.accent, fontWeight: '700' }}>
                  {aiReport.recommendation}
                </Text>
              </View>
            </View>
            <View style={styles.scoreRow}>
              <Text style={{ fontSize: 13, color: COLORS.text2 }}>Güvenlik Skoru</Text>
              <Text style={{ fontWeight: '700', color: aiReport.safetyScore >= 70 ? COLORS.success : aiReport.safetyScore >= 40 ? COLORS.accent : COLORS.danger }}>
                {aiReport.safetyScore}/100
              </Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, {
                width: `${aiReport.safetyScore}%`,
                backgroundColor: aiReport.safetyScore >= 70 ? COLORS.success : aiReport.safetyScore >= 40 ? COLORS.accent : COLORS.danger,
              }]} />
            </View>
            <Text style={styles.bodyText}>{aiReport.analysisText}</Text>
          </View>

          {aiReport.suitableForSkinTypes?.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Uygun Cilt Tipleri</Text>
              <View style={styles.tagsRow}>
                {aiReport.suitableForSkinTypes.map((s, i) => (
                  <View key={i} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>
                ))}
              </View>
            </View>
          )}

          {aiReport.flaggedIngredients?.length > 0 && (
            <View style={styles.card}>
              <Text style={[styles.sectionTitle, { color: COLORS.danger }]}>⚠️ Dikkat Gerektiren İçerikler</Text>
              {aiReport.flaggedIngredients.map((f, i) => (
                <View key={i} style={styles.flagItem}>
                  <Text style={{ fontWeight: '700', color: COLORS.accent }}>{f.ingredient}</Text>
                  <Text style={styles.bodyText}>{f.reason}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', padding: 16, gap: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  imgBox: { width: 100, height: 100, borderRadius: 12, backgroundColor: COLORS.bg2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  productImg: { width: 100, height: 100, borderRadius: 12 },
  headerInfo: { flex: 1 },
  brand: { fontSize: 11, color: COLORS.accent, fontWeight: '700', textTransform: 'uppercase' },
  productName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginVertical: 3 },
  price: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: COLORS.bg3 },
  badgeText: { fontSize: 11, color: COLORS.text2 },
  btnRow: { flexDirection: 'row', gap: 10, padding: 16, backgroundColor: COLORS.white },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnOutline: { borderWidth: 1.5, borderColor: COLORS.primary },
  btnTextWhite: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  btnTextPrimary: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  tabRow: { backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 10, maxHeight: 52 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border },
  tabBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabBtnText: { fontSize: 13, color: COLORS.text2, fontWeight: '500' },
  tabBtnTextActive: { color: COLORS.white, fontWeight: '700' },
  section: { padding: 16, gap: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  bodyText: { fontSize: 14, color: COLORS.text2, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: COLORS.bg3, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  tagText: { fontSize: 12, color: COLORS.text2 },
  emptyBox: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: COLORS.text2, marginTop: 8 },
  altCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  priceRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  priceRowHighlight: { borderColor: COLORS.accent, backgroundColor: '#fffbf0' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBg: { height: 8, backgroundColor: COLORS.bg3, borderRadius: 4, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  flagItem: { padding: 12, backgroundColor: COLORS.bg3, borderRadius: 10, marginBottom: 8 },
});
