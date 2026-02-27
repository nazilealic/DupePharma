## 23. Üye Olma
---
**API Metodu:** `POST /auth/register`

**Açıklama:**  
Kullanıcıların sisteme yeni bir hesap oluşturmasını sağlar. Kullanıcı adı, e-posta ve şifre bilgileri alınarak yeni hesap oluşturulur.  
Kayıt sırasında e-posta adresinin benzersiz olması gerekir ve şifre güvenlik kurallarına uygun olmalıdır.

## 24. Şifre Yenileme
---
**API Metodu:** `PUT /users/{userId}/password`

**Açıklama:**  
Kullanıcının mevcut şifresini değiştirmesini veya unutulan şifreyi yenilemesini sağlar.  
Güvenlik için kullanıcı doğrulaması gereklidir. Kullanıcı yalnızca kendi şifresini değiştirebilir.

## 25. Admin Paneli Üzerinden Ürün Ekleme
---
**API Metodu:** `POST /admin/products`

**Açıklama:**  
Yöneticinin sisteme yeni ürün eklemesini sağlar.  
Ürün adı, marka, kategori, fiyat, içerik ve stok bilgileri girilerek yeni ürün kaydı oluşturulur.  
Bu işlem için admin yetkisi gereklidir.

## 26. Admin Paneli Üzerinden Ürün Düzenleme
---
**API Metodu:** `PUT /admin/products/{productId}`

**Açıklama:**  
Yöneticinin mevcut ürün bilgilerini güncellemesini sağlar.  
Ürün fiyatı, içerik bilgisi, kategori veya stok durumu değiştirilebilir.  
Bu işlem yalnızca admin yetkisine sahip kullanıcılar tarafından yapılabilir.

## 27. Admin Paneli Üzerinden Ürün Silme
---
**API Metodu:** `DELETE /admin/products/{productId}`

**Açıklama:**  
Yöneticinin seçilen ürünü sistemden kaldırmasını sağlar.  
Bu işlem geri alınamaz ve admin yetkisi gerektirir.

## 28. Yapay Zeka ile Ürün Analizi
---
**API Metodu:** `POST /ai/product-analysis`

**Açıklama:**  
Ürünün içerik bilgilerini analiz ederek etkileri, cilt tipine uygunluğu ve olası yan etkiler hakkında öneriler sunar.  
Analiz sonuçları kullanıcıya rapor olarak gösterilir.

## 29. Ürünlerin İçerik Bilgilerini Görüntüleme
---
**API Metodu:** `GET /products/{productId}/details`

**Açıklama:**  
Seçilen ürünün detaylı içerik listesini, kullanım amacını ve etkilerini gösterir.  
Kullanıcıya analiz ve kullanım bilgileri rapor olarak sunulur.

