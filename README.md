# DupePharma API

Node.js + Express + MongoDB tabanlı eczane ve kozmetik ürün API'si.

## Kurulum

```bash
# 1. Repoyu klonla
git clone <repo-url>
cd dupepharma

# 2. Bağımlılıkları yükle (HERKESİN YAPACAĞI TEK KOMUT)
npm install

# 3. .env dosyasını oluştur
cp .env.example .env
# .env içindeki MONGO_URI'yi kendi bağlantın ile değiştir

# 4. Sunucuyu başlat
npm run dev
```

## Proje Yapısı

```
dupepharma/
├── server.js                  ← Ana giriş noktası (DOKUNMA)
├── middleware/
│   └── auth.js                ← JWT middleware (DOKUNMA)
├── models/
│   ├── User.js                ← Kullanıcı modeli (DOKUNMA)
│   ├── Product.js             ← Ürün modeli (DOKUNMA)
│   └── Review.js              ← Yorum modeli (DOKUNMA)
├── routes/
│   ├── auth.js                ← Menekşe & Bahar
│   ├── products.js            ← Nazile & Bahar
│   ├── alternatives.js        ← Nazile & Bahar
│   ├── searchHistory.js       ← Nazile
│   ├── skinProfile.js         ← Nazile
│   ├── favorites.js           ← Şadiye
│   ├── pharmacies.js          ← Şadiye
│   ├── reviews.js             ← Menekşe
│   └── admin.js               ← Bahar
└── controllers/
    ├── authController.js      ← Menekşe & Bahar
    ├── productController.js   ← Nazile & Bahar
    ├── alternativeController.js ← Nazile & Bahar
    ├── searchHistoryController.js ← Nazile
    ├── skinProfileController.js   ← Nazile
    ├── favoritesController.js     ← Şadiye
    ├── pharmacyController.js      ← Şadiye
    ├── reviewController.js        ← Menekşe
    └── adminController.js         ← Bahar
```

## ⚠️ Ekip Kuralları — Merge Sorunlarını Önlemek İçin

### DOKUNULMAYACAK DOSYALAR (grup liderinin sorumluluğunda)
- `server.js`
- `middleware/auth.js`
- `models/User.js`
- `models/Product.js`
- `models/Review.js`
- `package.json`

### Branch Stratejisi

```bash
# Her kişi kendi branch'inde çalışır:
git checkout -b feature/nazile-requirements    # Nazile Alıç
git checkout -b feature/sadiye-requirements    # Şadiye Berra Özelgül
git checkout -b feature/menekse-requirements   # Menekşe Nazik
git checkout -b feature/bahar-requirements     # Bahar Balım
```

### Kimin Hangi Dosyalara Dokunacağı

| Dosya | Sahibi |
|---|---|
| `controllers/authController.js` | Menekşe (#21,#22) + Bahar (#23,#24) |
| `controllers/productController.js` | Nazile (#1,#4) + Bahar (#26,#27,#29) |
| `controllers/alternativeController.js` | Nazile (#2,#3) + Bahar (#28) |
| `controllers/searchHistoryController.js` | Nazile (#5,#6) |
| `controllers/skinProfileController.js` | Nazile (#7,#8) |
| `controllers/favoritesController.js` | Şadiye (#11,#12,#13) |
| `controllers/pharmacyController.js` | Şadiye (#14,#15) |
| `controllers/reviewController.js` | Menekşe (#16,#17,#18,#19,#20) |
| `controllers/adminController.js` | Bahar (#25) |

> Bir dosyayı birden fazla kişi paylaşıyorsa (örn. authController),
> önce biri tamamlar, merge eder; diğeri pull çekip devam eder.

## API Endpoint'leri Özeti

| Method | Endpoint | Gereksinim | Sahibi |
|--------|----------|------------|--------|
| POST | /v1/auth/register | #23 | Bahar |
| POST | /v1/auth/login | #21 | Menekşe |
| POST | /v1/auth/logout | #22 | Menekşe |
| POST | /v1/auth/password-reset | #24 | Bahar |
| GET | /v1/products | #1,#9,#10 | Nazile & Şadiye |
| GET | /v1/products/search | #4 | Nazile |
| GET | /v1/products/:id | #29 | Bahar |
| PUT | /v1/products/:id | #26 | Bahar |
| DELETE | /v1/products/:id | #27 | Bahar |
| POST | /v1/admin/products | #25 | Bahar |
| GET | /v1/products/:id/alternatives | #2 | Nazile |
| GET | /v1/products/:id/price-comparison | #3 | Nazile |
| GET | /v1/products/:id/ai-analysis | #28 | Bahar |
| GET | /v1/users/:id/search-history | #5 | Nazile |
| DELETE | /v1/users/:id/search-history | #6 | Nazile |
| POST | /v1/users/:id/skin-profile | #7 | Nazile |
| PUT | /v1/users/:id/skin-profile | #8 | Nazile |
| GET | /v1/users/:id/favorites | #13 | Şadiye |
| POST | /v1/users/:id/favorites | #11 | Şadiye |
| DELETE | /v1/users/:id/favorites/:pid | #12 | Şadiye |
| GET | /v1/pharmacies/on-duty/image | #15 | Şadiye |
| PUT | /v1/pharmacies/on-duty/image | #14 | Şadiye |
| GET | /v1/products/:id/reviews | #18 | Menekşe |
| POST | /v1/products/:id/reviews | #16 | Menekşe |
| PUT | /v1/products/:id/reviews/:rid | #19 | Menekşe |
| DELETE | /v1/products/:id/reviews/:rid | #17 | Menekşe |
| POST | /v1/products/:id/ratings | #20 | Menekşe |
