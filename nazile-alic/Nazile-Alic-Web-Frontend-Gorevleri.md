#  Dupe Pharma - Web Frontend Görevleri

##  Front-end Test Videosu

Link: [Buraya video linki eklenecek](#)

---

##  Authentication

Tüm endpointler için **Bearer Token gereklidir**

```
Authorization: Bearer <token>
```

---

## 1.  Ürün Arama Sayfası

* **API Endpoint:** `GET /search?query=urunAdi`
* **Auth:**  Gerekli

###  Görev

Kullanıcının ürün arayıp sonuçları görüntüleyebileceği sayfa

###  UI Bileşenleri

* Arama input (`type="text"`)
* "Ara" butonu
* Ürün kartları (isim, marka, fiyat)
* Loading spinner
* Empty state

###  Kullanıcı Deneyimi

* Debounce search
* Hata durumunda mesaj gösterimi
* Scrollable liste

---

## 2.  Ürün Listeleme Sayfası

* **API Endpoint:** `GET /products`
* **Auth:**  Gerekli

###  Görev

Tüm ürünleri listeleme

###  UI Bileşenleri

* Ürün kartları
* Grid layout
* Pagination / infinite scroll
* Loading skeleton

---

## 3.  Ürün Oluşturma Sayfası

* **API Endpoint:** `POST /products`
* **Auth:**  Gerekli

###  Görev

Yeni ürün ekleme formu

###  UI Bileşenleri

* name input
* brand input
* category input
* price input
* volume input
* description textarea
* ingredients input (array)
* usageInstructions textarea
* "Kaydet" butonu

###  Form Validasyonu

* Tüm alanlar zorunlu
* price numeric olmalı

---

## 4.  Ürün Silme

* **API Endpoint:** `DELETE /products/{productId}`
* **Auth:**  Gerekli

###  Görev

Ürün silme işlemi

###  UI

* Sil butonu
* Confirmation modal

---

## 5.  Muadil Ürün Listeleme Sayfası

* **API Endpoint:** `GET /products/{productId}/alternatives`
* **Auth:**  Gerekli

###  Görev

Ürünün muadillerini listeleme

###  UI

* Ürün kartları
* Fiyat bilgisi

---

## 6.  Fiyat Karşılaştırma Sayfası

* **API Endpoint:** `GET /products/{productId}/price-comparison`
* **Auth:**  Gerekli

###  Görev

Orijinal ürün ve muadillerini karşılaştırma

###  UI

* Orijinal ürün kartı
* Muadil ürün listesi
* pricePerMl gösterimi
* En ucuz ürün highlight

---

## 7.  Kullanıcı Geçmişi Sayfası

* **API Endpoint:** `GET /user/{userID}/search-history`
* **Auth:**  Gerekli

###  Görev

Kullanıcının arama geçmişini görüntüleme

###  UI

* Geçmiş listesi
* query + tarih gösterimi

---

## 8.  Geçmiş Silme

* **API Endpoint:** `DELETE /history`
* **Auth:**  Gerekli

###  Görev

Kullanıcı geçmişini temizleme

###  UI

* "Geçmişi Temizle" butonu
* Confirmation modal

---

## 9.  Cilt Profili Oluşturma Sayfası

* **API Endpoint:** `POST /user/{userID}/skin-profile`
* **Auth:**  Gerekli

###  Görev

Cilt profili oluşturma

###  UI

* skinType select
* sensitivity checkbox
* concerns multi-input
* Kaydet butonu

---

## 10.  Cilt Profili Güncelleme Sayfası

* **API Endpoint:** `PUT /user/{userID}/skin-profile`
* **Auth:**  Gerekli

###  Görev

Cilt profilini güncelleme

###  UI

* Önceden doldurulmuş form
* Güncelle butonu

---

## 11.  Cilt Profili Görüntüleme Sayfası

* **API Endpoint:** `GET /user/{userID}/skin-profile`
* **Auth:**  Gerekli

###  Görev

Cilt profilini görüntüleme

###  UI

* skinType
* sensitivity
* skinProblems listesi

---

##  Teknik Gereksinimler

* React (önerilir)
* Axios / Fetch
* React Router
* State management
* Responsive tasarım

---

##  Notlar

* Tüm endpointlerde token zorunlu
* Base URL:

```
