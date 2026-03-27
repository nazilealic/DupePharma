# Şadiye Berra Özelgül'ün Rest API Metodları

**API Test Videosu:** __Link sonradan eklenecek__

---

## 9. Kategori Filtrelemesi

- **Endpoint:** `GET /products`
- **Query Parameters:**
  - `category` (string, opsiyonel) — Filtrelenecek kategori adı

**Request:**
```
GET /products?category=nemlendirici
Authorization: Bearer {token}
```

**Authentication:** Bearer Token gerekli

**Response:** `200 OK` — Kategoriye ait ürün listesi başarıyla getirildi.

```json
{
  "data": [
    {
      "id": "p101",
      "name": "Cicaplast Baume B5",
      "brand": "La Roche-Posay",
      "category": "nemlendirici",
      "price": 1049.90,
      "volume": "100 ml",
      "pricePerMl": 10.00,
      "averageRating": 4.5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 12
  }
}
```

---

## 10. Fiyat Aralığı Filtrelemesi

- **Endpoint:** `GET /products`
- **Query Parameters:**
  - `minPrice` (number, opsiyonel) — Minimum fiyat (TL)
  - `maxPrice` (number, opsiyonel) — Maksimum fiyat (TL)

**Request:**
```
GET /products?minPrice=100&maxPrice=700
Authorization: Bearer {token}
```

**Authentication:** Bearer Token gerekli

**Response:** `200 OK` — Fiyat aralığına uyan ürünler listelendi.

```json
{
  "data": [
    {
      "id": "p102",
      "name": "Cicabio Cream",
      "brand": "Bioderma",
      "category": "nemlendirici",
      "price": 643.00,
      "volume": "200 ml",
      "pricePerMl": 3.22,
      "averageRating": 4.3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 8
  }
}
```

---

## 11. Favorilere Ekle

- **Endpoint:** `POST /users/{userId}/favorites`
- **Path Parameters:**
  - `userId` (string, zorunlu) — Kullanıcı ID'si

**Request Body:**
```json
{
  "productId": "p102"
}
```

**Authentication:** Bearer Token gerekli

**Response:** `201 Created` — Ürün favorilere başarıyla eklendi.

---

## 12. Favorilerden Çıkar

- **Endpoint:** `DELETE /users/{userId}/favorites/{productId}`
- **Path Parameters:**
  - `userId` (string, zorunlu) — Kullanıcı ID'si
  - `productId` (string, zorunlu) — Favoriden çıkarılacak ürünün ID'si

**Authentication:** Bearer Token gerekli (Yalnızca kendi favorilerini silebilir)

**Response:** `204 No Content` — Ürün favorilerden başarıyla çıkarıldı.

---

## 13. Favorileri Listele

- **Endpoint:** `GET /users/{userId}/favorites`
- **Path Parameters:**
  - `userId` (string, zorunlu) — Kullanıcı ID'si

**Authentication:** Bearer Token gerekli

**Response:** `200 OK` — Favori ürün listesi başarıyla getirildi.

```json
[
  {
    "id": "p102",
    "name": "Cicabio Cream",
    "brand": "Bioderma",
    "category": "nemlendirici",
    "price": 643.00,
    "volume": "200 ml",
    "pricePerMl": 3.22,
    "averageRating": 4.3
  }
]
```

---

## 14. Nöbetçi Eczane Listesini Düzenle

- **Endpoint:** `PUT /pharmacies/on-duty/image`

**Request Body:** `multipart/form-data`
```
pharmacyListImage  (file, zorunlu) — Yüklenecek görsel dosyası
```

**Authentication:** Bearer Token gerekli (Admin yetkisi zorunlu)

**Response:** `200 OK` — Nöbetçi eczane listesi görseli başarıyla güncellendi.

```json
{
  "message": "Görsel başarıyla yüklendi.",
  "imageUrl": "https://api.dupepharma.com/uploads/nobetci-eczane-2026-03-09.jpg"
}
```

---

## 15. Nöbetçi Eczane Listesini Görüntüle

- **Endpoint:** `GET /pharmacies/on-duty/image`

**Authentication:** Gerekmiyor

**Response:** `200 OK` — Güncel nöbetçi eczane listesi görseli başarıyla getirildi.

```json
{
  "imageUrl": "https://api.dupepharma.com/uploads/nobetci-eczane-2026-03-09.jpg",
  "updatedAt": "2026-03-09T08:00:00Z"
}
```
