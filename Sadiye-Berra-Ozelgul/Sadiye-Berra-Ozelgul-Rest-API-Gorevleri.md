# Sadiye Berra Özelgül — REST API Test Raporu

**Proje:** DupePharma API  
**Backend (API):** `https://dupepharma.onrender.com`  
**Frontend (Web Sitesi):** `https://dupe-pharma-vkej.vercel.app/`  
**API Test Videosu:** *https://www.youtube.com/watch?v=PZrqPSt91mI*

---

## İçindekiler

1. [Kategori Filtreleme](#1-kategori-filtreleme)
2. [Fiyat Aralığı Filtreleme](#2-fiyat-aralığı-filtreleme)
3. [Favorilere Ekle](#3-favorilere-ekle)
4. [Favorileri Listele](#4-favorileri-listele)
5. [Favorilerden Çıkar](#5-favorilerden-çıkar)
6. [Nöbetçi Eczane Listesini Görüntüle](#6-nöbetçi-eczane-listesini-görüntüle)
7. [Nöbetçi Eczane Listesini Düzenle](#7-nöbetçi-eczane-listesini-düzenle)

---

## 1. Kategori Filtreleme

**API Metodu:** `GET /products?category={categoryName}`

**Açıklama:** Ürünlerin belirli bir kategoriye göre filtrelenmesini sağlar. Kullanıcılar kategori parametresi göndererek yalnızca ilgili kategoriye ait ürünleri listeleyebilir. Filtreleme işlemi isteğe bağlı bir query parametresiyle yapılır.

**Authentication:** Bearer Token — `{{adminToken}}` gerekli

**Query Parameters:**

| Parametre  | Tip    | Zorunlu | Açıklama             |
|------------|--------|---------|----------------------|
| `category` | string | Hayır   | Filtrelenecek kategori adı |

**Örnek İstek URL:**
```
https://dupepharma.onrender.com/products?category=nemlendirici
```

**Beklenen Response:** `200 OK` — İlgili kategoriye ait ürün listesi

**Test Adımları:**
1. Postman'de `GET` metodu seçilir.
2. URL olarak `https://dupepharma.onrender.com/products?category=nemlendirici` girilir.
3. Authorization sekmesinde `Bearer Token` ve `{{adminToken}}` eklenir.
4. İstek gönderilir; `200 OK` yanıtı ile yalnızca `nemlendirici` kategorisindeki ürünler listelenir.

---

## 2. Fiyat Aralığı Filtreleme

**API Metodu:** `GET /products?minPrice={min}&maxPrice={max}`

**Açıklama:** Ürünlerin belirli bir fiyat aralığına göre filtrelenmesini sağlar. Kullanıcılar minimum ve maksimum fiyat değerlerini girerek bütçelerine uygun ürünleri listeleyebilir. Fiyat parametreleri opsiyoneldir; ancak birlikte kullanıldığında belirtilen aralıktaki ürünler gösterilir.

**Authentication:** Bearer Token — `{{adminToken}}` gerekli

**Query Parameters:**

| Parametre  | Tip    | Zorunlu | Açıklama           |
|------------|--------|---------|--------------------|
| `minPrice` | number | Hayır   | Minimum fiyat değeri |
| `maxPrice` | number | Hayır   | Maksimum fiyat değeri |

**Örnek İstek URL:**
```
https://dupepharma.onrender.com/products?minPrice=100&maxPrice=700
```

**Beklenen Response:** `200 OK` — Belirtilen fiyat aralığındaki ürün listesi

**Test Adımları:**
1. Postman'de `GET` metodu seçilir.
2. URL'ye `minPrice` ve `maxPrice` query parametreleri eklenir.
3. Authorization sekmesinde `Bearer Token` ve `{{adminToken}}` girilir.
4. İstek gönderilir; `200 OK` yanıtında yalnızca 100–700 TL arasındaki ürünler listelenir.

---

## 3. Favorilere Ekle

**API Metodu:** `POST /users/{userId}/favorites`

**Açıklama:** Kullanıcının bir ürünü favori listesine eklemesini sağlar. İstek gövdesinde favoriye eklenecek ürünün `productId` bilgisi gönderilir. Bu işlem için kullanıcının giriş yapmış olması gerekir; her kullanıcı yalnızca kendi favori listesini düzenleyebilir.

**Authentication:** Bearer Token — `{{userToken}}` gerekli

**Path Parameters:**

| Parametre | Tip    | Zorunlu | Açıklama    |
|-----------|--------|---------|-------------|
| `userId`  | string | Evet    | Kullanıcı ID'si |

**Request Body:**
```json
{
  "productId": "69d2970e6594e6681624e535"
}
```

**Beklenen Response:** `200 OK` veya `201 Created`

**Test Adımları:**
1. Postman'de `POST` metodu seçilir.
2. URL olarak `https://dupepharma.onrender.com/users/{{userId}}/favorites` girilir.
3. Authorization sekmesinde `Bearer Token` ve `{{userToken}}` eklenir.
4. Body'e favoriye eklenecek `productId` JSON formatında girilir.
5. Başarılı yanıt alınır; ürün favorilere eklenir.

---

## 4. Favorileri Listele

**API Metodu:** `GET /users/{userId}/favorites`

**Açıklama:** Kullanıcının favori listesinde bulunan tüm ürünleri görüntülemesini sağlar. Favori ürünlerin temel bilgileri (ürün adı, fiyat, kategori vb.) liste halinde döndürülür. Güvenlik için giriş yapmış olmak gerekir; kullanıcı yalnızca kendi favori listesini görüntüleyebilir.

**Authentication:** Bearer Token — `{{userToken}}` veya `{{adminToken}}` gerekli

**Path Parameters:**

| Parametre | Tip    | Zorunlu | Açıklama    |
|-----------|--------|---------|-------------|
| `userId`  | string | Evet    | Kullanıcı ID'si |

**Örnek İstek URL:**
```
https://dupepharma.onrender.com/users/{{userId}}/favorites
```

**Beklenen Response:** `200 OK` — Favori ürün listesi

**Test Adımları:**
1. Postman'de `GET` metodu seçilir.
2. URL olarak `https://dupepharma.onrender.com/users/{{userId}}/favorites` girilir.
3. Authorization sekmesinde `Bearer Token` eklenir.
4. İstek gönderilir; `200 OK` yanıtında kullanıcının tüm favori ürünleri listelenir.

---

## 5. Favorilerden Çıkar

**API Metodu:** `DELETE /users/{userId}/favorites/{productId}`

**Açıklama:** Kullanıcının favori listesinde bulunan bir ürünü silmesini sağlar. Belirtilen ürün, kullanıcının favorilerinden kaldırılır. Güvenlik için giriş yapmış olmak gerekir; kullanıcı yalnızca kendi favori listesinden ürün çıkarabilir.

**Authentication:** Bearer Token — `{{adminToken}}` gerekli

**Path Parameters:**

| Parametre   | Tip    | Zorunlu | Açıklama    |
|-------------|--------|---------|-------------|
| `userId`    | string | Evet    | Kullanıcı ID'si |
| `productId` | string | Evet    | Ürün ID'si  |

**Örnek İstek URL:**
```
https://dupepharma.onrender.com/users/{{userId}}/favorites/{{productId}}
```

**Beklenen Response:** `200 OK` veya `204 No Content`

**Test Adımları:**
1. Postman'de `DELETE` metodu seçilir.
2. URL'ye `userId` ve `productId` path parametreleri eklenir.
3. Authorization sekmesinde `Bearer Token` ve `{{adminToken}}` girilir.
4. İstek gönderilir; başarılı yanıt alınarak ürün favorilerden kaldırılır.

---

## 6. Nöbetçi Eczane Listesini Görüntüle

**API Metodu:** `GET /pharmacies/on-duty`

**Açıklama:** Sistemde kayıtlı olan güncel nöbetçi eczane listesini görüntülemeyi sağlar. Bu işlem için giriş yapma zorunluluğu yoktur; tüm kullanıcılara açık bir işlemdir.

**Authentication:** Gerekmez

**Örnek İstek URL:**
```
https://dupepharma.onrender.com/pharmacies/on-duty
```

**Beklenen Response:** `200 OK` — Nöbetçi eczane listesi (eczane adı, adres, telefon, nöbet tarihi vb.)

**Test Adımları:**
1. Postman'de `GET` metodu seçilir.
2. URL olarak `https://dupepharma.onrender.com/pharmacies/on-duty` girilir.
3. Herhangi bir token veya kimlik doğrulama eklenmeden istek gönderilir.
4. `200 OK` yanıtında güncel nöbetçi eczane listesi görüntülenir.

---

## 7. Nöbetçi Eczane Listesini Düzenle

**API Metodu:** `PUT /pharmacies/on-duty`

**Açıklama:** Sistemde bulunan nöbetçi eczane listesinin güncellenmesini sağlar. Bu işlem genellikle yönetici yetkisine sahip kullanıcılar tarafından yapılır. Liste; eczane adı, adres, telefon numarası ve nöbet tarihi gibi bilgileri içerebilir. Güncelleme işlemi mevcut listeyi değiştirebilir veya yeni kayıtlar ekleyebilir. Güvenlik için giriş yapmış olmak ve yönetici yetkisine sahip olmak gerekir.

**Authentication:** Bearer Token — `{{adminToken}}` gerekli (Yönetici yetkisi)

**Request Body (Örnek):**
```json
{
  "pharmacies": [
    {
      "name": "Merkez Eczanesi",
      "address": "Cumhuriyet Mah. Atatürk Cad. No:5",
      "phone": "+905551234567",
      "dutyDate": "2025-01-01"
    }
  ]
}
```

**Beklenen Response:** `200 OK` — Liste başarıyla güncellendi

**Test Adımları:**
1. Postman'de `PUT` metodu seçilir.
2. URL olarak `https://dupepharma.onrender.com/pharmacies/on-duty` girilir.
3. Authorization sekmesinde `Bearer Token` ve `{{adminToken}}` eklenir.
4. Body'e güncellenmiş eczane listesi JSON formatında girilir.
5. `200 OK` yanıtı alınır; nöbetçi eczane listesi başarıyla güncellenir.

---

## Postman Koleksiyon Değişkenleri

| Değişken     | Açıklama                        | Değer                         |
|--------------|---------------------------------|-------------------------------|
| `userToken`  | Normal kullanıcı JWT token'ı   | Giriş yapıldıktan sonra atanır |
| `adminToken` | Admin kullanıcı JWT token'ı    | Admin girişinden sonra atanır  |
| `userId`     | Kullanıcı ID'si                 | Kayıt/giriş sonrası atanır     |
| `productId`  | Ürün ID'si                      | Ürün ekleme sonrası atanır     |

---

*Bu rapor, DupePharma REST API'nin Postman koleksiyonu baz alınarak hazırlanmıştır.*
