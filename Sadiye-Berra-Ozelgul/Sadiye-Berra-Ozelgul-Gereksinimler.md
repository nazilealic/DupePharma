## 9- Kategori Filtreleme

**API Metodu:** `GET /products?category={categoryName}`  

**Açıklama:**  
Ürünlerin belirli bir kategoriye göre filtrelenmesini sağlar. Kullanıcılar kategori parametresi göndererek yalnızca ilgili kategoriye ait ürünleri listeleyebilir.  

Filtreleme işlemi isteğe bağlı parametre ile yapılır ve sonuç olarak ilgili kategoriye ait ürün listesi döndürülür.

---

## 10- Fiyat Aralığını Filtreleme

**API Metodu:** `GET /products?minPrice={min}&maxPrice={max}`  

**Açıklama:**  
Ürünlerin belirli bir fiyat aralığına göre filtrelenmesini sağlar. Kullanıcılar minimum ve maksimum fiyat değerlerini girerek bütçelerine uygun ürünleri listeleyebilir.  

Fiyat parametreleri opsiyoneldir ancak birlikte kullanıldığında belirtilen aralıktaki ürünler gösterilir.

---

## 11- Favorilere Ekle

**API Metodu:** `POST /users/{userId}/favorites`  

**Açıklama:**  
Kullanıcının bir ürünü favori listesine eklemesini sağlar.  

İstek gövdesinde (request body) favoriye eklenecek ürünün ID bilgisi gönderilir.  

Bu işlem için kullanıcının giriş yapmış olması gerekir. Her kullanıcı yalnızca kendi favori listesini düzenleyebilir.

---

## 12- Favorilerden Çıkar

**API Metodu:** `DELETE /users/{userId}/favorites/{productId}`  

**Açıklama:**  
Kullanıcının favori listesinde bulunan bir ürünü silmesini sağlar.  

Belirtilen ürün, kullanıcının favorilerinden kaldırılır.  

Güvenlik için giriş yapmış olmak gerekir ve kullanıcı yalnızca kendi favori listesinden ürün çıkarabilir.

---

## 13- Favorileri Listele

**API Metodu:** `GET /users/{userId}/favorites`  

**Açıklama:**  
Kullanıcının favori listesinde bulunan tüm ürünleri görüntülemesini sağlar.  

Favori ürünlerin temel bilgileri (ürün adı, fiyat, kategori vb.) liste halinde döndürülür.  

Güvenlik için giriş yapmış olmak gerekir ve kullanıcı yalnızca kendi favori listesini görüntüleyebilir.

---

## 14- Nöbetçi Eczane Listesini Düzenle

**API Metodu:** `PUT /pharmacies/on-duty`  

**Açıklama:**  
Sistemde bulunan nöbetçi eczane listesinin güncellenmesini sağlar.  

Bu işlem genellikle yönetici yetkisine sahip kullanıcılar tarafından yapılır.  

Liste; eczane adı, adres, telefon numarası ve nöbet tarihi gibi bilgileri içerebilir. Güncelleme işlemi mevcut listeyi değiştirebilir veya yeni kayıtlar ekleyebilir.  

Güvenlik için giriş yapmış olmak ve yönetici yetkisine sahip olmak gerekir.

---

## 15- Listeyi Görüntüle

**API Metodu:** `GET /pharmacies/on-duty`  

**Açıklama:**  
Sistemde kayıtlı olan güncel nöbetçi eczane listesini görüntülemeyi sağlar.  

Bu işlem için giriş yapma zorunluluğu yoktur tüm kullanıcılara açık bir işlemdir.