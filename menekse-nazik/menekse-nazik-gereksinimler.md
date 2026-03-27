## 16- Ürüne Yorum Ekleme

**API Metodu:** `POST /products/{productId}/reviews`  

**Açıklama:**  
Belirtilen ürüne kullanıcıların yorum eklemesini sağlar.

Kullanıcı, ürünle ilgili deneyim ve görüşlerini sisteme kaydedebilir.

Eklenen her yorum ilgili ürün ile ilişkilendirilir ve veri tabanında saklanır.

---

## 17- Ürünün Yorumunu Sil

**API Metodu:** `DELETE /products/{productId}/reviews/{reviewId}`  

**Açıklama:**  
Belirtilen ürüne ait bir yorumu sistemden silmeyi sağlar.

Bu işlem yalnızca yorumu yapan kullanıcı veya yönetici (admin) tarafından yapılabilir.

Silinen yorum ürünün yorum listesinden kaldırılır ve sistemde görüntülenmez.

---

## 18- Ürün Yorumlarını Listele

**API Metodu:** `GET /products/{productId}/reviews`  

**Açıklama:**  
Seçilen ürüne ait tüm kullanıcı yorumlarını listeler.

Yorumlar ürün detay sayfasında görüntülenmek üzere getirilir.

---
## 19- Yorumu Güncelle

**API Metodu:** `PUT /products/{productId}/reviews/{reviewId}`  

**Açıklama:**  

Kullanıcının daha önce yaptığı yorumu düzenlemesini sağlar.

Güncelleme işlemi yalnızca yorumu oluşturan kullanıcı veya admin tarafından yapılabilir.

Güncellenen içerik sistemde yeni haliyle saklanır.

---

## 20- Ürüne Puan Ver

**API Metodu:** `POST /products/{productId}/ratings`  

**Açıklama:**  
Kullanıcıların ürünü 1 ile 5 arasında puanlamasını sağlar.

Verilen puanlar ürünün genel değerlendirme ortalamasına eklenir.

---

## 21- Kullanıcı Giriş Yap

**API Metodu:** `POST /auth/login`  

**Açıklama:**  

Kullanıcının sisteme giriş yapmasını sağlar.

Doğru kimlik bilgileri girildiğinde kullanıcı için bir oturum başlatılır.


Başarılı giriş sonrasında kullanıcı yetkili işlemleri gerçekleştirebilir.

---

## 22- Kullanıcı Çıkış Yap

**API Metodu:** `POST /auth/login`  

**Açıklama:**  
Kullanıcının mevcut oturumunu güvenli şekilde sonlandırır.

Çıkış işlemi tamamlandığında sistem erişimi kapatılır.

Yeniden işlem yapmak için tekrar giriş yapılması gerekir.
