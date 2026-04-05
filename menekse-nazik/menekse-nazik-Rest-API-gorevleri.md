
# Menekşe Nazik'in REST API Metotları

**API Test Videosu:** **Link sonradan eklenecek**

---

## 1. Yorum Ekle

* **Endpoint:** `POST /products/{productId}/reviews`
* **Path Parameters:**
  * `productId` (string, zorunlu) — Yorum yapılacak ürünün ID'si

**Request Body:**

```json
{
  "rating": 4,
  "comment": "Cildime çok iyi geldi, kesinlikle tavsiye ederim."
}
```

**Authentication:** Bearer Token gerekli

**Response:** `201 Created` — Yorum başarıyla eklendi.

---

## 2. Yorum Sil

* **Endpoint:** `DELETE /products/{productId}/reviews/{reviewId}`
* **Path Parameters:**
  * `productId` (string, zorunlu) — Ürünün ID'si
  * `reviewId` (string, zorunlu) — Silinecek yorumun ID'si

**Authentication:** Bearer Token gerekli (Yalnızca kendi yorumunu silebilir; admin tüm yorumları silebilir)

**Response:** `204 No Content` — Yorum başarıyla silindi.

---

## 3. Yorumları Listele

* **Endpoint:** `GET /products/{productId}/reviews`
* **Path Parameters:**
  * `productId` (string, zorunlu) — Yorumları listelenecek ürünün ID'si
* **Query Parameters:**
  * `page` (integer, opsiyonel) — Sayfa numarası (varsayılan: 1)
  * `limit` (integer, opsiyonel) — Sayfa başına kayıt sayısı (varsayılan: 20)

**Request:**

```
GET /products/p101/reviews?page=1&limit=20
```

**Authentication:** Gerekmiyor

**Response:** `200 OK` — Yorumlar başarıyla listelendi.


---

## 4. Yorumu Güncelle

* **Endpoint:** `PUT /products/{productId}/reviews/{reviewId}`
* **Path Parameters:**
  * `productId` (string, zorunlu) — Ürünün ID'si
  * `reviewId` (string, zorunlu) — Güncellenecek yorumun ID'si

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Bir süre daha kullandım, harika bir ürün!"
}
```

**Authentication:** Bearer Token gerekli (Yalnızca kendi yorumunu güncelleyebilir)

**Response:** `200 OK` — Yorum başarıyla güncellendi.

---

## 5. Ürünü Puanla

* **Endpoint:** `POST /products/{productId}/ratings`
* **Path Parameters:**
  * `productId` (string, zorunlu) — Puanlanacak ürünün ID'si

**Request Body:**

```json
{
  "rating": 5
}
```

**Authentication:** Bearer Token gerekli

**Response:** `200 OK` — Puan başarıyla kaydedildi.

---

## 6. Kullanıcı Girişi

* **Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "kullanici@example.com",
  "password": "12345678"
}
```

**Authentication:** Gerekmiyor

**Response:** `200 OK` — Giriş başarılı.


## 7. Kullanıcı Çıkışı

* **Endpoint:** `POST /auth/logout`

**Authentication:** Bearer Token gerekli

**Response:** `204 No Content` — Çıkış başarılı, oturum sonlandırıldı.
