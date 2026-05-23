1. Üye Olma (Kayıt) Servisi

API Endpoint: POST /auth/register
Görev: Mobil uygulamada kullanıcı kayıt işlemini gerçekleştiren servis entegrasyonu
İşlevler:

Kullanıcı bilgilerini (email, password, firstName, lastName) toplama
Form validasyonu (email formatı, şifre güvenliği kontrolü)
API'ye POST isteği gönderme
Başarılı kayıt durumunda kullanıcıyı giriş ekranına yönlendirme
Hata durumlarını yakalama ve kullanıcıya gösterme (409 Conflict, 400 Bad Request)


Teknik Detaylar:

Request body: { email, password, firstName, lastName }
Response: 201 Created
HTTP Client kullanımı (Axios/Fetch)
Error handling ve retry mekanizması
Loading state yönetimi




2. Şifre Yenileme Servisi

API Endpoint: POST /auth/reset-password
Görev: Kullanıcının şifresini sıfırlama işlemini gerçekleştirme
İşlevler:

Email adresi giriş ekranı gösterme
API'ye POST isteği gönderme (sıfırlama bağlantısı/kodu gönderimi)
Yeni şifre belirleme ekranı (kod doğrulama sonrası)
Başarılı güncelleme sonrası giriş ekranına yönlendirme
Hata durumlarını kullanıcıya gösterme


Teknik Detaylar:

Request body: { email } (ilk adım) / { token, newPassword } (ikinci adım)
Şifre tekrarı validasyonu
Error handling (400 Bad Request, 404 Not Found)
Loading state yönetimi




3. Admin Paneli Üzerinden Ürün Ekleme Servisi

API Endpoint: POST /products
Görev: Admin kullanıcısının mobil uygulama üzerinden yeni ürün eklemesi
İşlevler:

Admin yetkisi kontrolü (token içindeki rol)
Ürün bilgilerini (isim, marka, fiyat, kategori, açıklama) toplayan form
Fotoğraf seçimi (kamera veya galeri)
API'ye POST isteği ile ürün oluşturma
Başarılı ekleme sonrası ürün listesine yönlendirme


Teknik Detaylar:

Request body: { name, brand, price, category, description, ingredients }
Multipart form data ile görsel yükleme (expo-image-picker)
Authentication header (Bearer Token) + Admin rol kontrolü
Error handling (400 Bad Request, 401, 403 Forbidden)
Loading state yönetimi




4. Admin Paneli Üzerinden Ürün Düzenleme Servisi

API Endpoint: PUT /products/{productId}
Görev: Admin kullanıcısının mevcut ürün bilgilerini güncelleme
İşlevler:

Mevcut ürün bilgilerini formda doldurarak gösterme
Değişiklikleri toplayıp API'ye gönderme
Görsel değiştirme seçeneği
Başarılı güncelleme sonrası bildirim gösterme


Teknik Detaylar:

Path parameter: productId
Request body: { name, brand, price, category, description, ingredients }
Partial update desteği
Authentication header (Bearer Token) + Admin rol kontrolü
Error handling (400, 401, 403, 404 Not Found)




5. Admin Paneli Üzerinden Ürün Silme Servisi

API Endpoint: DELETE /products/{productId}
Görev: Admin kullanıcısının ürünü sistemden silmesi
İşlevler:

Silme işlemi için onay dialog'u gösterme
API'ye DELETE isteği gönderme
Başarılı silme sonrası ürünü listeden kaldırma
Hata durumunda kullanıcıya bilgi verme


Teknik Detaylar:

Path parameter: productId
Authentication header (Bearer Token) + Admin rol kontrolü
Confirmation dialog (Alert.alert)
Optimistic UI update (listeden anlık kaldırma)
Error handling (401, 403 Forbidden, 404 Not Found)




6. Yapay Zeka ile Ürün Analizi Servisi

API Endpoint: POST /products/{productId}/ai-analysis
Görev: Seçilen ürünün yapay zeka destekli analiz sonuçlarını gösterme
İşlevler:

Ürün detay sayfasında "AI Analizi" butonu gösterme
API'ye POST isteği gönderme (analiz başlatma)
Analiz sonucunu (cilt uyumu, içerik değerlendirmesi) gösterme
Kullanıcının cilt profiline göre kişiselleştirilmiş öneri gösterme
Uzun analiz süresinde progress indicator


Teknik Detaylar:

Request body: { userId } (kişiselleştirilmiş analiz için)
Response model: { compatibility, ingredients, recommendation, warnings }
Authentication header (Bearer Token)
Error handling (400, 401, 500 Internal Server Error)
Loading / streaming state yönetimi




7. Ürünlerin İçerik Bilgilerini Görüntüleme Servisi

API Endpoint: GET /products/{productId}/ingredients
Görev: Ürünün içerik (ingrediënt) bilgilerini detaylı gösterme
İşlevler:

Ürün detay sayfasında içerikler sekmesini gösterme
API'den içerik listesini çekme
Her içeriğin adını ve kısa açıklamasını listeleme
Zararlı/dikkat gerektiren içerikleri vurgulama


Teknik Detaylar:

Path parameter: productId
Response model: [{ name, description, safetyLevel, isAllergen }]
Renk kodlaması (güvenli: yeşil, dikkat: sarı, zararlı: kırmızı)
Error handling (404 Not Found, 500)
Boş içerik listesi için bilgilendirme mesajı
