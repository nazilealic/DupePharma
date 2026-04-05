#  Dupe Pharma - REST API Dokümantasyonu

## 📹 API Test Videosu

Link: [Buraya video linki eklenecek](#)

---

##  Authentication

Bu API'deki çoğu endpoint için **Bearer Token zorunludur**.

###  Header Kullanımı

```
Authorization: Bearer <token>
```

---

## 1.  Ürün Oluşturma

* **Endpoint:** `POST /products`
* **Auth:**  Gerekli

###  Request Body

```json
{
  "name": "Nivea Soft Nemlendirici Krem",
  "brand": "Nivea",
  "category": "nemlendirici",
  "price": 200.00,
  "volume": "200 ml",
  "pricePerMl": 1.0,
  "description": "Hafif yapılı, hızlı emilen formülüyle cildi derinlemesine nemlendiren çok amaçlı krem.",
  "ingredients": ["Aqua", "Glycerin", "Paraffinum Liquidum", "Myristyl Myristate", "Alcohol Denat.", "Panthenol", "Tocopheryl Acetate", "Helianthus Annuus Seed Oil"],
  "usageInstructions": "Temiz cilde nazikçe masaj yaparak uygulayın. Günlük kullanıma uygundur."
}
```

###  Response

* **201 Created** → Ürün oluşturuldu

---

## 2.  Ürün Listeleme

* **Endpoint:** `GET /products`
* **Auth:**  Gerekli

###  Response

```json
{
            "_id": "69d2bfb95f30e6d60453c7c3",
            "name": "Nivea Soft Nemlendirici Krem",
            "brand": "Nivea",
            "category": "nemlendirici",
            "price": 200,
            "description": "Hafif yapılı, hızlı emilen formülüyle cildi derinlemesine nemlendiren çok amaçlı krem.",
            "ingredients": [
                "Aqua",
                "Glycerin",
                "Paraffinum Liquidum",
                "Myristyl Myristate",
                "Alcohol Denat.",
                "Panthenol",
                "Tocopheryl Acetate",
                "Helianthus Annuus Seed Oil"
            ],
            "usageInstructions": "Temiz cilde nazikçe masaj yaparak uygulayın. Günlük kullanıma uygundur.",
            "volume": "200 ml",
            "alternatives": [],
            "averageRating": 0,
            "totalRatings": 0,
            "createdAt": "2026-04-05T20:02:01.292Z",
            "updatedAt": "2026-04-05T20:02:01.292Z",
            "__v": 0
}
```

* **200 OK**

---

## 3.  Ürün Silme

* **Endpoint:** `DELETE /products/{productId}`
* **Auth:**  Gerekli

###  Path Parameters

| Parametre | Açıklama |
| --------- | -------- |
| productId | Ürün ID  |

###  Response

* **200 OK** → Ürün silindi
* **404 Not Found**

---

## 4.  Muadil Ürün Listeleme

* **Endpoint:** `GET /products/{productId}/alternatives`
* **Auth:**  Gerekli

###  Response

```json

[
    {
        "_id": "69cfcc3a8dac5fe3483f1d9f",
        "name": "Bioxcin Yüz Temizleme Jeli",
        "brand": "Bioxcin",
        "category": "temizleyici",
        "price": 350,
        "description": "Cildi nazikçe temizleyen, sebum dengesini korumaya yardımcı yüz temizleme jeli.",
        "ingredients": [
            "Aqua",
            "Sodium Laureth Sulfate",
            "Cocamidopropyl Betaine",
            "Panthenol",
            "Biotin",
            "Niacinamide"
        ],
        "usageInstructions": "Nemli cilde masaj yaparak uygulayın ve bol su ile durulayın.",
        "volume": "500 ml",
        "alternatives": [],
        "averageRating": 0,
        "totalRatings": 0,
        "createdAt": "2026-04-03T14:18:34.521Z",
        "updatedAt": "2026-04-04T17:48:47.773Z",
        "__v": 0,
        "imageUrl": "data:image"
    }
]

```

---

## 5.  Muadil Ürün Fiyat Karşılaştırma

* **Endpoint:** `GET /products/{productId}/price-comparison`
* **Auth:**  Gerekli

###  Response

```json
[
    {
        "productId": "69cfca7e8dac5fe3483f1d9b",
        "productName": "La Roche-Posay Effaclar Yüz Temizleme Jeli",
        "brand": "La Roche-Posay",
        "price": 900,
        "volume": "400 ml",
        "pricePerMl": 2.25,
        "similarityScore": 1,
        "matchedIngredients": [],
        "isOriginal": true
    },
    {
        "productId": "69cfcc3a8dac5fe3483f1d9f",
        "productName": "Bioxcin Yüz Temizleme Jeli",
        "brand": "Bioxcin",
        "price": 350,
        "volume": "500 ml",
        "pricePerMl": 0.7,
        "similarityScore": null,
        "matchedIngredients": [],
        "isOriginal": false
    }
]
```

---

## 6.  Kullanıcı Ürün Arama

* **Endpoint:** `GET /search?query=urunAdi`
* **Auth:**  Gerekli

###  Response

```json
[
    {
        "_id": "69cfcc3a8dac5fe3483f1d9f",
        "name": "Bioxcin Yüz Temizleme Jeli",
        "brand": "Bioxcin",
        "category": "temizleyici",
        "price": 350,
        "description": "Cildi nazikçe temizleyen, sebum dengesini korumaya yardımcı yüz temizleme jeli.",
        "ingredients": [
            "Aqua",
            "Sodium Laureth Sulfate",
            "Cocamidopropyl Betaine",
            "Panthenol",
            "Biotin",
            "Niacinamide"
        ],
        "usageInstructions": "Nemli cilde masaj yaparak uygulayın ve bol su ile durulayın.",
        "volume": "500 ml",
        "alternatives": [],
        "averageRating": 0,
        "totalRatings": 0,
        "createdAt": "2026-04-03T14:18:34.521Z",
        "updatedAt": "2026-04-04T17:48:47.773Z",
        "__v": 0,
        "imageUrl": "data:image"
```

---

## 7.  Kullanıcı Geçmişini Görüntüleme

* **Endpoint:** `GET user/{userID}/search-history`
* **Auth:**  Gerekli

###  Response

```json
[
    {
        "query": "bioxcin",
        "searchedOn": "2026-04-05T20:17:10.709Z",
        "_id": "69d2c3465f30e6d60453c839"
    }
]
```

---

## 8.  Kullanıcı Geçmişini Silme

* **Endpoint:** `DELETE /history`
* **Auth:**  Gerekli

###  Response

* **200 OK** → Geçmiş silindi

---

## 9.  Cilt Profili Oluşturma

* **Endpoint:** `POST user/{userID}/skin-profile`
* **Auth:**  Gerekli

###  Request Body

```json
{
  "skinType": "karma",
  "sensitivity": true,
  "concerns": ["akne", "lekeler"]
}
```

###  Response

* **201 Created**

---

## 10.  Cilt Profili Güncelleme

* **Endpoint:** `PUT user/{userID}/skin-profile`
* **Auth:**  Gerekli

###  Request Body

```json
{
  "skinType": "yağlı"
}
```

###  Response

* **200 OK**

---

## 11.  Cilt Profili Görüntüleme

* **Endpoint:** `GET user/{userID}/skin-profile`
* **Auth:**  Gerekli

###  Response

```json
{
    "userId": "69cfc6318dac5fe3483f1d8a",
    "skinType": "kuru",
    "sensitivity": true,
    "skinProblems": [
        "kızarıklık",
        "kuruluk",
        "gözenek",
        "leke"
    ]
}
```
