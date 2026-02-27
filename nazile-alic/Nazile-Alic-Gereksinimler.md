## 1- Ürünlerin Listelenmesi

**API Metodu:** `GET /products`  

**Açıklama:**
Sistem içerisinde bulunan tüm eczane ve kozmetik ürünlerinin listelenmesini sağlar. Ürün adı, marka, kategori, fiyat ve temel içerik bilgileri görüntülenir. Kullanıcılar ürünleri kategoriye veya filtrelere göre listeleyebilir.

---

## 2- Kozmetik Ürün İçin Muadil Ürünleri Listelemek

**API Metodu:** `GET /products/{productId}/alternatives`  

**Açıklama:**
Seçilen bir kozmetik ürüne ait muadil (benzer içerik veya etki sağlayan) ürünleri listeler. Kullanıcılar fiyat, marka veya içerik benzerliğine göre alternatif ürünleri görüntüleyebilir.

---

## 3- Muadil Ürünler İçin Fiyat Karşılaştırması

**API Metodu:** `GET /products/{productId}/price-comparison`  

**Açıklama:**
Seçilen ürün ve muadillerinin fiyat bilgilerini karşılaştırmalı olarak gösterir. Kullanıcılar bu ürünler arasındaki fiyat farklarını inceleyebilir.

---

## 4- Ürün Araması Yapma

**API Metodu:** `GET /products/search?query={keyword}`  

**Açıklama:**
Kullanıcıların ürün adı ve marka göre arama yapmasını sağlar. Arama sonuçları girilen anahtar kelimeye göre filtrelenerek listelenir.

---

## 5- Arama Geçmişini Görüntüleme

**API Metodu:** `GET /users/{userId}/search-history`  

**Açıklama:**
Kullanıcının daha önce yaptığı aramaları liste halinde görüntülemesini sağlar. Güvenlik için giriş yapılmış olması gerekir ve kullanıcı yalnızca kendi arama geçmişini görüntüleyebilir.

---

## 6- Arama Geçmişini Silme

**API Metodu:** `DELETE /users/{userId}/search-history`  

**Açıklama:**
Kullanıcının tüm arama geçmişini sistemden silmesini sağlar. Bu işlem geri alınamaz. Güvenlik için giriş yapılmış olması gerekir ve kullanıcı yalnızca kendi arama geçmişini silebilir.

---

## 7- Cilt Profili Oluşturma

**API Metodu:** `POST /users/{userId}/skin-profile`  
**Açıklama:**
Kullanıcının cilt tipine ve ihtiyaçlarına göre kişisel bir cilt profili oluşturmasını sağlar. Cilt tipi (yağlı, kuru, karma vb.), hassasiyet durumu ve cilt problemleri gibi bilgiler kaydedilir. Bu profil, uygun ürün önerileri sunmak için kullanılır.

---

## 8- Cilt Profili Güncelleme

**API Metodu:** `PUT /users/{userId}/skin-profile`  

**Açıklama:**
Kullanıcının mevcut cilt profilini güncellemesini sağlar. Kullanıcı cilt tipi veya ihtiyaç bilgilerini değiştirebilir. Güvenlik için giriş yapılmış olması gerekir ve kullanıcı yalnızca kendi profilini güncelleyebilir.




