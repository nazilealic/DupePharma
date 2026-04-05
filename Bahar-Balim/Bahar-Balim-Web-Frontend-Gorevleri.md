# Bahar'ın Web Frontend Görevleri

**Frontend (Web Sitesi):** https://dupe-pharma-vkej.vercel.app/  
**Front-end Test Videosu:** *https://youtu.be/KsTe1pOdWdw*

---

## 23. Üye Olma Sayfası

**API Endpoint:** `POST /auth/register`  
**Görev:** Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu

**UI Bileşenleri:**
- Responsive kayıt formu (desktop ve mobile uyumlu)
- Kullanıcı adı input alanı
- Email input alanı (type="email", autocomplete="email")
- Şifre input alanı (type="password", şifre gücü göstergesi)
- Şifre tekrar input alanı (doğrulama için)
- "Kayıt Ol" butonu (primary button style)
- "Zaten hesabınız var mı? Giriş Yap" linki
- Loading spinner (kayıt işlemi sırasında)
- Başarı ve hata bildirimleri (toast/snackbar)

**Form Validasyonu:**
- Email format kontrolü
- Şifre güvenlik kuralları (min 8 karakter, büyük/küçük harf, rakam)
- Şifre eşleşme kontrolü
- Kullanıcı adı boş olamaz kontrolü
- Tüm alanlar geçerli olmadan buton disabled
- E-posta benzersizlik kontrolü (409 Conflict: "Bu email zaten kullanılıyor")

**Kullanıcı Deneyimi:**
- Form hatalarının input altında gösterilmesi (inline validation)
- Başarılı kayıt sonrası otomatik giriş sayfasına yönlendirme
- Form submission prevention (double-click koruması)
- Keyboard navigation desteği (Tab, Enter)
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- API entegrasyonu (POST /auth/register)
- State management (form state, loading state, error state)
- Routing (kayıt sayfasından giriş sayfasına geçiş)
- Hata yönetimi (409 Conflict, 400 Bad Request)

---

## 24. Şifre Yenileme Sayfası

**API Endpoint:** `PUT /users/{userId}/password`  
**Görev:** Kullanıcının şifresini değiştirebileceği sayfa tasarımı ve implementasyonu

**UI Bileşenleri:**
- Mevcut şifre input alanı (type="password")
- Yeni şifre input alanı (type="password", şifre gücü göstergesi)
- Yeni şifre tekrar input alanı (doğrulama için)
- Şifre göster/gizle ikonu (her input için)
- "Şifreyi Güncelle" butonu (primary button)
- "İptal" butonu (secondary button)
- Loading indicator (işlem sırasında)
- Başarı bildirimi (toast/snackbar: "Şifreniz başarıyla güncellendi")
- Hata bildirimi

**Form Validasyonu:**
- Mevcut şifre boş olamaz kontrolü
- Yeni şifre güvenlik kuralları (min 8 karakter, büyük/küçük harf, rakam)
- Yeni şifre eşleşme kontrolü
- Yeni şifre mevcut şifreyle aynı olamaz kontrolü
- Tüm alanlar geçerli olmadan buton disabled

**Kullanıcı Deneyimi:**
- Giriş yapılmamışsa sayfaya erişim engellenir
- Başarılı güncelleme sonrası profil sayfasına yönlendirme
- Hata durumunda mevcut değerler korunur
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- Authentication kontrolü (route guard)
- API entegrasyonu (PUT /users/{userId}/password)
- Path parametresi yönetimi (userId)
- State management (form state, loading, error)
- Hata yönetimi (401 Unauthorized, 400 Bad Request)

---

## 25. Admin Paneli — Ürün Ekleme Sayfası

**API Endpoint:** `POST /admin/products`  
**Görev:** Admin kullanıcıların sisteme yeni ürün ekleyebileceği sayfa tasarımı ve implementasyonu

**UI Bileşenleri:**
- Ürün ekleme formu
- Ürün adı input alanı
- Marka input alanı
- Kategori seçim alanı (dropdown/select)
- Fiyat input alanı (sayısal, para birimi göstergeli)
- İçerik bilgisi alanı (textarea veya etiket tabanlı çoklu giriş)
- Stok bilgisi input alanı (sayısal)
- Ürün açıklaması textarea alanı
- Hacim/miktar input alanı
- "Ürünü Ekle" butonu (primary button)
- "İptal" butonu (secondary button)
- Loading indicator (kaydetme sırasında)
- Başarı bildirimi (toast/snackbar: "Ürün başarıyla eklendi")
- Hata bildirimi

**Form Validasyonu:**
- Zorunlu alan kontrolleri (ürün adı, marka, kategori, fiyat)
- Fiyat negatif olamaz kontrolü
- Stok negatif olamaz kontrolü
- Tüm zorunlu alanlar doldurulmadan buton disabled

**Kullanıcı Deneyimi:**
- Yalnızca admin kullanıcıların erişebildiği sayfa (route guard)
- Başarılı ekleme sonrası ürün listesine yönlendirme veya formu sıfırlama
- Sayfa kapatılırken kaydedilmemiş değişiklik uyarısı
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- Admin authentication ve yetki kontrolü (route guard)
- API entegrasyonu (POST /admin/products)
- State management (form state, loading, error)
- Hata yönetimi (401 Unauthorized, 403 Forbidden, 400 Bad Request)

---

## 26. Admin Paneli — Ürün Düzenleme Sayfası

**API Endpoint:** `PUT /admin/products/{productId}`  
**Görev:** Admin kullanıcıların mevcut ürün bilgilerini güncelleyebileceği sayfa tasarımı ve implementasyonu

**UI Bileşenleri:**
- Mevcut ürün bilgileriyle dolu düzenleme formu
- Ürün adı input alanı (mevcut değerle dolu)
- Marka input alanı (mevcut değerle dolu)
- Kategori seçim alanı (mevcut seçimle dolu)
- Fiyat input alanı (mevcut değerle dolu)
- İçerik bilgisi alanı (mevcut değerle dolu)
- Stok bilgisi input alanı (mevcut değerle dolu)
- Ürün açıklaması textarea (mevcut değerle dolu)
- "Kaydet" butonu (primary button)
- "İptal" butonu (secondary button)
- Kaydedilmemiş değişiklik göstergesi
- Loading indicator
- Başarı bildirimi (toast/snackbar: "Ürün başarıyla güncellendi")
- Hata bildirimi

**Form Validasyonu:**
- Zorunlu alan kontrolleri
- Fiyat ve stok negatif olamaz kontrolü
- Değişiklik yapılmadan "Kaydet" butonu disabled

**Kullanıcı Deneyimi:**
- Yalnızca admin kullanıcıların erişebildiği sayfa (route guard)
- Sayfa açıldığında mevcut ürün bilgilerinin otomatik yüklenmesi
- Optimistic update (kaydet butonuna basıldığında UI anında güncellenir)
- "İptal" butonuna basıldığında değişiklik kaybı için onay dialog'u
- Sayfa kapatılırken kaydedilmemiş değişiklik uyarısı
- Başarılı güncelleme sonrası ürün listesine yönlendirme
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- Admin authentication ve yetki kontrolü (route guard)
- API entegrasyonu (PUT /admin/products/{productId})
- Path parametresi yönetimi (productId)
- Sayfa yüklenirken mevcut ürün verisinin çekilmesi (GET /products/{productId})
- State management (initial values, dirty state, loading, error)
- Browser navigation guard (unsaved changes)
- Hata yönetimi (401 Unauthorized, 403 Forbidden, 404 Not Found)

---

## 27. Admin Paneli — Ürün Silme

**API Endpoint:** `DELETE /admin/products/{productId}`  
**Görev:** Admin kullanıcıların ürünleri sistemden silebileceği UI akışı tasarımı ve implementasyonu

**UI Bileşenleri:**
- Ürün listesinde her satır/kart için "Sil" butonu (danger button style)
- Silme onayı için modal dialog
- Modal içinde uyarı mesajı ("Bu işlem geri alınamaz")
- Modal içinde "Evet, Sil" butonu (danger button)
- Modal içinde "İptal" butonu (secondary button)
- Loading indicator (silme işlemi sırasında)
- Başarı bildirimi (toast/snackbar: "Ürün başarıyla silindi")
- Hata bildirimi

**Kullanıcı Deneyimi:**
- Yalnızca admin kullanıcıların erişebildiği işlem (yetki kontrolü)
- Destructive action için görsel uyarılar (kırmızı renk, warning ikonu)
- Çift onay mekanizması (silme butonu → onay modalı → silme işlemi)
- İptal seçeneği her zaman mevcut
- Başarılı silme sonrası ürünün listeden animasyonlu kaldırılması
- Mobil uyumlu tasarım

**Teknik Detaylar:**
- Admin authentication ve yetki kontrolü
- API entegrasyonu (DELETE /admin/products/{productId})
- Path parametresi yönetimi (productId)
- Modal/Dialog component kullanımı
- State management (ürün listesi güncelleme, loading, error)
- Hata yönetimi (401 Unauthorized, 403 Forbidden, 404 Not Found)

---

## 28. Yapay Zeka ile Ürün Analizi Sayfası

**API Endpoint:** `POST /ai/product-analysis`  
**Görev:** Ürün içeriklerinin yapay zeka ile analiz edilip kullanıcıya rapor olarak sunulduğu sayfa tasarımı ve implementasyonu

**UI Bileşenleri:**
- Analiz tetikleme butonu ("Yapay Zeka ile Analiz Et")
- Analiz yükleme ekranı (animasyonlu loading, "Analiz ediliyor..." mesajı)
- Analiz sonuç raporu bölümü:
  - İçerik etkileri listesi
  - Cilt tipine uygunluk bilgisi
  - Olası yan etkiler listesi
  - Genel öneri ve notlar
- Raporu yazdır / PDF olarak indir butonu (opsiyonel)
- "Yeniden Analiz Et" butonu
- Hata durumu ekranı (yeniden dene butonu ile)

**Kullanıcı Deneyimi:**
- Analiz süresi boyunca kullanıcıya animasyonlu bekleme ekranı gösterilmesi
- Analiz sonuçlarının okunabilir, bölümlere ayrılmış rapor formatında sunulması
- Pozitif etkiler yeşil, olumsuz etkiler kırmızı ile vurgulanması
- Mobil uyumlu responsive tasarım
- Analiz sonucunun paylaşılabilir olması (opsiyonel)

**Teknik Detaylar:**
- API entegrasyonu (POST /ai/product-analysis)
- Uzun süren istek yönetimi (timeout, loading state)
- State management (analiz durumu, sonuç verisi, loading, error)
- Rapor render bileşeni (markdown veya structured data)
- Hata yönetimi (500 Server Error, timeout)

---

## 29. Ürün İçerik Bilgileri Görüntüleme Sayfası

**API Endpoint:** `GET /products/{productId}/details`  
**Görev:** Seçilen ürünün detaylı içerik ve kullanım bilgilerini kullanıcıya sunan sayfa tasarımı ve implementasyonu

**UI Bileşenleri:**
- Ürün başlığı ve marka bilgisi (H1 heading)
- Ürün görseli
- Detaylı içerik listesi (her içerik için ayrı etiket/pill bileşeni)
- Kullanım amacı ve etkileri bölümü
- İçerik açıklamaları (her içeriğin işlevi)
- "Yapay Zeka ile Analiz Et" butonu (28. göreve yönlendirme)
- Rapor olarak görüntüle butonu
- Geri dönme butonu (ürün listesine)
- Loading skeleton ekranı (veri yüklenirken)
- Hata durumu ekranı (yeniden dene butonu ile)

**Kullanıcı Deneyimi:**
- İçeriklerin anlaşılır ve okunabilir şekilde listelenmesi
- Her içerik üzerine gelindiğinde kısa açıklama tooltip'i (opsiyonel)
- Sayfa yazdırılabilir format desteği
- Deep link desteği (ürün detay sayfası paylaşılabilir)
- Mobil uyumlu responsive tasarım

**Teknik Detaylar:**
- API entegrasyonu (GET /products/{productId}/details)
- Path parametresi yönetimi (productId)
- State management (ürün detay verisi, loading, error)
- SEO optimization (meta tags, ürün detay sayfası public olabilir)
- Hata yönetimi (404 Not Found, 500 Server Error)

---

*Bu belge, DupePharma web uygulamasının frontend geliştirme görevlerini kapsamaktadır.*
