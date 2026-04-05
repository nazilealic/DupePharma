# Sadiye Berra Özelgül'ün Web Frontend Görevleri

**Frontend (Web Sitesi):** https://dupe-pharma-vkej.vercel.app/  
**Front-end Test Videosu:** *(Link buraya eklenecek)*

---

## 9. Kategori Filtreleme Sayfası

**API Endpoint:** `GET /products?category={categoryName}`  
**Görev:** Ürünlerin kategoriye göre filtrelenebileceği web sayfası tasarımı ve implementasyonu

**UI Bileşenleri:**
- Kategori seçim alanı (dropdown/select veya buton grubu)
- Filtrelenmiş ürün listesi (grid veya liste görünümü)
- Her ürün için kart bileşeni (ürün adı, marka, fiyat, kategori bilgisi)
- "Filtreyi Temizle" butonu
- Sonuç sayısı göstergesi ("X ürün bulundu")
- Boş durum ekranı (kategoride ürün yoksa)
- Loading spinner (veri yüklenirken)

**Kullanıcı Deneyimi:**
- Kategori seçildiğinde sayfa yenilenmeden sonuçların güncellenmesi (SPA davranışı)
- Seçili kategorinin görsel olarak vurgulanması (active state)
- Filtreleme sonuçlarının animasyonlu geçişle gösterilmesi
- URL'de kategori parametresinin güncellenmesi (deep link desteği)
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- Query string yönetimi (`?category=nemlendirici`)
- API entegrasyonu (GET /products?category={categoryName})
- State management (seçili kategori, ürün listesi, loading, error)
- URL senkronizasyonu (React Router veya benzeri)
- Hata yönetimi (API hatası durumunda kullanıcı dostu mesaj)

---

## 10. Fiyat Aralığı Filtreleme Sayfası

**API Endpoint:** `GET /products?minPrice={min}&maxPrice={max}`  
**Görev:** Ürünlerin fiyat aralığına göre filtrelenebileceği web sayfası tasarımı ve implementasyonu

**UI Bileşenleri:**
- Minimum fiyat input alanı (sayısal, para birimi göstergeli)
- Maksimum fiyat input alanı (sayısal, para birimi göstergeli)
- Fiyat aralığı kaydırıcısı (range slider, çift taraflı)
- "Filtrele" butonu
- "Filtreyi Temizle" butonu
- Filtrelenmiş ürün listesi (grid veya liste görünümü)
- Her ürün için kart bileşeni (ürün adı, marka, fiyat bilgisi)
- Sonuç sayısı göstergesi
- Boş durum ekranı (aralıkta ürün yoksa)
- Loading spinner

**Form Validasyonu:**
- Minimum fiyat maksimum fiyattan büyük olamaz kontrolü
- Negatif değer girişi engelleme
- Yalnızca sayısal değer girişine izin verme
- Hatalı aralık girildiğinde kullanıcı uyarısı

**Kullanıcı Deneyimi:**
- Slider veya input değiştiğinde otomatik senkronizasyon
- Filtreleme sonuçlarının anlık güncellenmesi (debounce ile)
- URL'de fiyat parametrelerinin güncellenmesi
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- Query string yönetimi (`?minPrice=100&maxPrice=700`)
- Debounce (kullanıcı yazarken gereksiz API çağrısını önleme)
- API entegrasyonu (GET /products?minPrice={min}&maxPrice={max})
- State management (fiyat aralığı, ürün listesi, loading, error)
- Hata yönetimi

---

## 11. Favorilere Ekle

**API Endpoint:** `POST /users/{userId}/favorites`  
**Görev:** Kullanıcının ürünleri favori listesine ekleyebileceği UI bileşeni tasarımı ve implementasyonu

**UI Bileşenleri:**
- Ürün kartı üzerinde kalp/yıldız ikonu (favori butonu)
- Favori eklendiğinde ikonun dolup renk değiştirmesi (aktif/pasif state)
- Favori ekleme butonu (ürün detay sayfasında)
- Loading indicator (işlem sırasında buton disabled)
- Başarı bildirimi (toast/snackbar: "Favorilere eklendi")
- Hata bildirimi (toast/snackbar: "Bir hata oluştu")

**Kullanıcı Deneyimi:**
- Giriş yapılmamışsa favori butonuna tıklandığında giriş sayfasına yönlendirme veya uyarı
- Optimistic update (API yanıtı beklenmeden UI'ın anında güncellenmesi)
- Zaten favoride olan ürün için butonun farklı görünmesi
- Mobil uyumlu dokunmatik alan (min 44x44px)

**Teknik Detaylar:**
- Authentication kontrolü (token yoksa işlem engelleme)
- API entegrasyonu (POST /users/{userId}/favorites)
- Request body: `{ "productId": "..." }`
- State management (favori listesi, loading, error)
- Hata yönetimi (401 Unauthorized: giriş yapılmamış, 409 Conflict: zaten favoride)

---

## 12. Favorilerden Çıkar

**API Endpoint:** `DELETE /users/{userId}/favorites/{productId}`  
**Görev:** Kullanıcının favori listesinden ürün çıkarabileceği UI bileşeni tasarımı ve implementasyonu

**UI Bileşenleri:**
- Aktif favori ikonu üzerinde kaldırma butonu (kalp/yıldız dolu → boş)
- Favori listesi sayfasında "Favorilerden Çıkar" butonu
- Silme öncesi onay dialog'u (opsiyonel, "Favorilerden kaldırmak istiyor musunuz?")
- Loading indicator (işlem sırasında)
- Başarı bildirimi (toast/snackbar: "Favorilerden kaldırıldı")
- Hata bildirimi

**Kullanıcı Deneyimi:**
- Optimistic update (kaldırma işlemi UI'da anında yansıtılır)
- Geri alma seçeneği (opsiyonel, "Geri Al" butonu ile)
- Favori listesi sayfasında kaldırılan ürünün listeden kaybolması (animasyonlu)
- Mobil uyumlu tasarım

**Teknik Detaylar:**
- Authentication kontrolü (token yoksa işlem engelleme)
- API entegrasyonu (DELETE /users/{userId}/favorites/{productId})
- Path parametresi yönetimi (userId, productId)
- State management (favori listesi güncelleme)
- Hata yönetimi (401 Unauthorized, 404 Not Found)

---

## 13. Favorileri Listele Sayfası

**API Endpoint:** `GET /users/{userId}/favorites`  
**Görev:** Kullanıcının favori ürünlerini görüntüleyebileceği sayfa tasarımı ve implementasyonu

**UI Bileşenleri:**
- Favori ürünler listesi (grid veya liste görünümü)
- Her ürün için kart bileşeni (ürün adı, marka, fiyat, kategori)
- Her kart üzerinde "Favorilerden Çıkar" butonu
- Sayfa başlığı ("Favorilerim")
- Toplam favori ürün sayısı
- Boş durum ekranı ("Henüz favori ürününüz yok" + ürünlere yönlendiren link)
- Loading skeleton ekranı (veri yüklenirken)
- Hata durumu ekranı (yeniden dene butonu ile)

**Kullanıcı Deneyimi:**
- Giriş yapılmamışsa sayfaya erişim engellenir ve giriş sayfasına yönlendirme
- Sayfa yenilendiğinde favori listesinin korunması
- Favorilerden çıkarılan ürünün listeden animasyonlu kaldırılması
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- Authentication kontrolü (route guard)
- API entegrasyonu (GET /users/{userId}/favorites)
- State management (favori listesi, loading, error)
- Favori kaldırma işlemiyle entegrasyon
- Hata yönetimi (401 Unauthorized, 404 Not Found)

---

## 14. Nöbetçi Eczane Listesini Düzenle Sayfası

**API Endpoint:** `PUT /pharmacies/on-duty`  
**Görev:** Admin kullanıcıların nöbetçi eczane listesini düzenleyebileceği sayfa tasarımı ve implementasyonu

**UI Bileşenleri:**
- Mevcut nöbetçi eczane listesi (düzenlenebilir tablo veya form)
- Her eczane için form alanları:
  - Eczane adı input alanı
  - Adres input alanı
  - Telefon numarası input alanı (format maskesi)
  - Nöbet tarihi input alanı (date picker)
- "Yeni Eczane Ekle" butonu (satır ekleme)
- Her satır için "Sil" butonu
- "Kaydet" butonu (primary button)
- "İptal" butonu (secondary button)
- Kaydedilmemiş değişiklik göstergesi
- Loading indicator (kaydetme sırasında)
- Başarı bildirimi (toast/snackbar)

**Form Validasyonu:**
- Eczane adı boş olamaz
- Telefon numarası format kontrolü
- Nöbet tarihi geçmiş tarih olamaz kontrolü
- Zorunlu alanların doldurulması kontrolü

**Kullanıcı Deneyimi:**
- Sadece admin kullanıcıların erişebildiği sayfa (route guard)
- Değişiklik yapılmadan "Kaydet" butonu disabled
- Sayfa kapatılırken kaydedilmemiş değişiklik uyarısı
- Başarılı kaydetme sonrası liste görüntüleme sayfasına yönlendirme
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- Admin authentication ve yetki kontrolü (route guard)
- API entegrasyonu (PUT /pharmacies/on-duty)
- Form state management (initial values, dirty state)
- Hata yönetimi (401 Unauthorized, 403 Forbidden)
- Browser navigation guard (unsaved changes)

---

## 15. Nöbetçi Eczane Listesini Görüntüle Sayfası

**API Endpoint:** `GET /pharmacies/on-duty`  
**Görev:** Tüm kullanıcıların nöbetçi eczane listesini görüntüleyebileceği sayfa tasarımı ve implementasyonu

**UI Bileşenleri:**
- Nöbetçi eczane listesi (tablo veya kart görünümü)
- Her eczane için bilgi alanları:
  - Eczane adı
  - Adres (harita linki ile opsiyonel)
  - Telefon numarası (tıklanabilir, tel: protokolü)
  - Nöbet tarihi (formatlanmış tarih)
- Sayfa başlığı ("Nöbetçi Eczaneler")
- Arama/filtreleme alanı (opsiyonel, eczane adı veya adrese göre)
- Boş durum ekranı ("Bugün nöbetçi eczane bulunamadı")
- Loading skeleton ekranı
- Hata durumu ekranı (yeniden dene butonu ile)
- Son güncellenme tarihi/saati göstergesi

**Kullanıcı Deneyimi:**
- Giriş yapma zorunluluğu yok, herkese açık sayfa
- Telefon numarasına tıklayınca arama başlatma (mobilde)
- Adrese tıklayınca harita uygulamasına yönlendirme (opsiyonel)
- Sayfa otomatik yenileme (opsiyonel, belirli aralıklarla)
- Print-friendly styles (eczane listesi yazdırılabilir)
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- Authentication gerektirmeyen public route
- API entegrasyonu (GET /pharmacies/on-duty)
- State management (eczane listesi, loading, error)
- `tel:` protokolü ile tıklanabilir telefon numaraları
- Hata yönetimi (500 Server Error vb.)
- SEO optimization (meta tags, public sayfa olduğu için önemli)

---

*Bu belge, DupePharma web uygulamasının frontend geliştirme görevlerini kapsamaktadır.*

