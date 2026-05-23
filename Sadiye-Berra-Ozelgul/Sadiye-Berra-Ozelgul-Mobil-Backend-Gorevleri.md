1. Kategori Filtrelemesi Servisi
API Endpoint: `GET /products?category={categoryName}`
Görev: Ürünleri kategori bazında filtreleyerek mobil uygulamada gösterme
İşlevler:
Kategori listesini API'den çekip buton/chip olarak gösterme
Seçilen kategoriye göre ürünleri filtreleme
Aktif kategoriyi vurgulayarak gösterme
Kategori seçimi değişince listeyi otomatik güncelleme
Teknik Detaylar:
Query parameter ile filtreleme (`?category=ciltBakimi`)
Response model: `[{ id, name, brand, price, category }]`
State yönetimi (seçili kategori state'i)
Error handling (400 Bad Request, 500)
---
2. Fiyat Aralığını Filtreleme Servisi
API Endpoint: `GET /products?minPrice={min}&maxPrice={max}`
Görev: Kullanıcının belirlediği fiyat aralığına göre ürünleri filtreleme
İşlevler:
Min/Max fiyat giriş alanları veya slider bileşeni
Fiyat aralığını query parameter olarak API'ye gönderme
Filtrelenmiş ürünleri listeleme
Filtreyi sıfırlama butonu
Teknik Detaylar:
Birden fazla query parameter kullanımı
Input validasyonu (min > max kontrolü)
Debounce ile gereksiz istek önleme
Error handling (400 Bad Request)
---
3. Favorilere Ekleme Servisi
API Endpoint: `POST /users/{userId}/favorites`
Görev: Kullanıcının seçtiği ürünü favorilerine ekleme
İşlevler:
Ürün kartındaki favori (kalp) ikonuna basınca API'ye istek gönderme
Başarılı ekleme sonrası ikonu dolu kalp olarak değiştirme
Zaten favoride varsa bilgilendirme mesajı gösterme
Loading durumunda ikonu devre dışı bırakma
Teknik Detaylar:
Request body: `{ productId }`
Authentication header (Bearer Token)
Optimistic UI update
Error handling (401 Unauthorized, 409 Conflict)
---
4. Favorilerden Çıkarma Servisi
API Endpoint: `DELETE /users/{userId}/favorites/{productId}`
Görev: Kullanıcının favorilerindeki ürünü kaldırma
İşlevler:
Favori ikonuna tekrar basınca API'ye DELETE isteği gönderme
Başarılı silme sonrası ikonu boş kalp olarak değiştirme
Favoriler listesinde swipe-to-delete ile silme
Onay dialog'u (isteğe bağlı)
Teknik Detaylar:
Path parameter kullanımı (`productId`)
Authentication header (Bearer Token)
Optimistic UI update (listeyi anında güncelleme)
Error handling (401, 404 Not Found)
---
5. Favorileri Listeleme Servisi
API Endpoint: `GET /users/{userId}/favorites`
Görev: Kullanıcının tüm favori ürünlerini listeleme
İşlevler:
JWT token ile kimlik doğrulama
Favori ürünleri API'den çekip gösterme
Boş favori listesi durumunda bilgilendirme gösterme
Her ürün için favoriden çıkarma butonu
Teknik Detaylar:
Authentication header (Bearer Token)
Response model: `[{ id, name, brand, price, imageUrl }]`
Pull-to-refresh
Error handling (401 Unauthorized, 404 Not Found)
---
6. Nöbetçi Eczane Listesini Düzenleme Servisi
API Endpoint: `PUT /pharmacies/{pharmacyId}`
Görev: Admin kullanıcısının nöbetçi eczane bilgilerini güncelleme
İşlevler:
Admin yetkisi kontrolü (token içindeki rol)
Eczane bilgilerini düzenleme formu gösterme
Güncellenmiş bilgileri API'ye gönderme
Başarılı güncelleme sonrası listeyi yenileme
Teknik Detaylar:
Request body: `{ name, address, phone, isOnDuty, workingHours }`
Authentication header (Bearer Token) + Admin rol kontrolü
Error handling (401 Unauthorized, 403 Forbidden, 404 Not Found)
Loading state yönetimi
---
7. Nöbetçi Eczane Listesini Görüntüleme Servisi
API Endpoint: `GET /pharmacies`
Görev: Nöbetçi eczanelerin listesini mobil uygulamada gösterme
İşlevler:
API'den eczane listesini çekme
Eczane adı, adres, telefon ve çalışma saatlerini gösterme
Telefon numarasına tıklandığında arama uygulamasını açma
Adrese tıklandığında harita uygulamasını açma
Teknik Detaylar:
Response model: `[{ id, name, address, phone, isOnDuty, workingHours }]`
`Linking.openURL` ile telefon/harita entegrasyonu
Konum bazlı sıralama (opsiyonel)
Error handling (500 Internal Server Error)
