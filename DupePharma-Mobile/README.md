# DupePharma Mobile 📱

React Native + Expo ile geliştirilmiş DupePharma mobil uygulaması.

## Kurulum

### Gereksinimler
- Node.js 18+
- Expo CLI
- Android Studio (Android) veya Xcode (iOS)

### Adımlar

```bash
# 1. Klasöre gir
cd DupePharma-Mobile

# 2. Bağımlılıkları yükle
npm install

# 3. Uygulamayı başlat
npx expo start

# 4. Simülatörde aç
# → Android için: 'a' tuşuna bas
# → iOS için: 'i' tuşuna bas
# → Telefondan: QR kodu Expo Go ile tara
```

## Ekranlar

| Ekran | Açıklama |
|-------|----------|
| Login | Giriş yapma, şifremi unuttum |
| Register | Yeni hesap oluşturma |
| Products | Ürün listeleme, arama, kategori filtresi |
| ProductDetail | Ürün detayı, muadiller, fiyat karşılaştırması, AI analizi |
| Favorites | Favori ürünler |
| Reviews | Ürün yorumları (ekleme, düzenleme, silme) |
| SkinProfile | Cilt profili ve arama geçmişi |
| Pharmacy | Nöbetçi eczane listesi |
| Profile | Profil, şifre değiştirme, çıkış |
| Admin | Ürün ve kullanıcı yönetimi (admin'e özel) |

## API

Backend: `https://api.yazmuh.com`

Tüm API çağrıları `src/services/api.js` dosyasında tanımlıdır.

## Grup Üyeleri - Branch Yapısı

```bash
# Her üye kendi branch'ını açmalı
git checkout -b feature/uye-adi-mobil

# Geliştirme sonrası push
git add .
git commit -m "Mobil frontend: [ekran adı] tamamlandı"
git push origin feature/uye-adi-mobil
```

## Kanıt Videosu Hazırlama

1. `npx expo start` komutuyla uygulamayı başlat
2. Simülatörde veya gerçek cihazda çalıştır
3. Ekran kaydı al (sesli olarak anlatarak)
4. Video içeriği:
   - Ekranın açılması
   - API isteğinin gitmesi (backend console'dan göster)
   - İşlemin gerçekleşmesi

## Teknolojiler

- React Native 0.74
- Expo SDK 51
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage (token yönetimi)
- Expo Image Picker (fotoğraf yükleme)
