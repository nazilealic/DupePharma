
# Menekşe Nazik'in Web Frontend Görevleri

**Front-end Test Videosu:** https://youtu.be/hT2pw2x252A 

---

## 1. Kullanıcı Giriş Sayfası

* **API Endpoint:** `POST /auth/login`
* **Görev:** Kullanıcı giriş işlemi için web sayfası tasarımı ve implementasyonu

* **UI Bileşenleri:**
  + Responsive giriş formu (desktop ve mobile uyumlu)
  + Email input alanı (type="email", autocomplete="email")
  + Şifre input alanı (type="password", şifreyi göster/gizle toggle)
  + "Giriş Yap" butonu (primary button style)
  + "Hesabınız yok mu? Kayıt Ol" linki
  + "Şifremi Unuttum" linki
  + Loading spinner (giriş işlemi sırasında)
  + Form container (card veya centered layout)

* **Form Validasyonu:**
  + HTML5 form validation (required attributes)
  + JavaScript real-time validation
  + Email format kontrolü (regex pattern)
  + Şifre boş olamaz kontrolü
  + Tüm alanlar geçerli olmadan buton disabled
  + Client-side ve server-side validation

* **Kullanıcı Deneyimi:**
  + Form hatalarını input altında gösterilmesi (inline validation)
  + Başarılı giriş sonrası JWT token localStorage'a kaydedilmesi ve ana sayfaya yönlendirme
  + Hata durumlarında kullanıcı dostu mesajlar (401 Unauthorized: "E-posta veya şifre hatalı")
  + Form submission prevention (double-click koruması)
  + Accessible form labels ve ARIA attributes
  + Keyboard navigation desteği (Tab, Enter)

* **Teknik Detaylar:**
  + Framework: React/Vue/Angular veya Vanilla JS
  + JWT token yönetimi (localStorage/sessionStorage)
  + State management (form state, loading state, error state)
  + Routing (giriş sayfasından ana sayfaya geçiş)
  + Protected route kontrolü (zaten giriş yapılmışsa yönlendirme)
  + Accessibility (WCAG 2.1 AA compliance)

---

## 2. Kullanıcı Çıkış İşlemi

* **API Endpoint:** `POST /auth/logout`
* **Görev:** Kullanıcı oturumunu sonlandırma UI akışının tasarımı ve implementasyonu

* **UI Bileşenleri:**
  + Navbar veya profil menüsünde "Çıkış Yap" butonu/linki
  + Onay dialog'u (opsiyonel — "Çıkış yapmak istediğinize emin misiniz?")
  + Loading indicator (çıkış işlemi sırasında)

* **Kullanıcı Deneyimi:**
  + Çıkış sonrası JWT token'ının localStorage/sessionStorage'dan temizlenmesi
  + Başarılı çıkış sonrası giriş sayfasına yönlendirme
  + Hata durumunda kullanıcı dostu mesaj
  + Çıkış yapıldıktan sonra korumalı sayfalara erişimin engellenmesi

* **Teknik Detaylar:**
  + JWT token temizleme (localStorage/sessionStorage)
  + Global auth state sıfırlama
  + Browser history management (geri tuşu ile korumalı sayfaya dönüşün engellenmesi)
  + Routing (login sayfasına yönlendirme)

---

## 3. Ürün Yorumlarını Listeleme Bileşeni

* **API Endpoint:** `GET /products/{productId}/reviews`
* **Görev:** Ürün detay sayfasında yorumların listelenmesi bileşeninin tasarımı ve implementasyonu

* **UI Bileşenleri:**
  + Responsive yorum listesi (ürün detay sayfasının alt bölümü)
  + Her yorum kartında: kullanıcı adı, puan (yıldız gösterimi), yorum metni, tarih
  + Ortalama puan göstergesi (yıldız + sayısal değer + toplam yorum sayısı)
  + Pagination veya "Daha fazla yükle" butonu
  + Yorumu düzenle butonu (yorumun sahibine özel)
  + Yorumu sil butonu (yorumun sahibine veya admin'e özel)
  + "Yorum ekle" butonu (giriş yapmış kullanıcıya özel)
  + Boş durum mesajı ("Henüz yorum yapılmamış")

* **Kullanıcı Deneyimi:**
  + Loading skeleton screen (yorumlar yüklenirken)
  + Error state (yükleme hatası durumunda retry butonu)
  + Yorumlar tarihe göre sıralı (en yeni en üstte)
  + Kullanıcı kendi yorumunu görselde vurgulama

* **Teknik Detaylar:**
  + Lazy loading (pagination ile)
  + State management (reviews data, loading, error states)
  + JWT token ile yetkilendirme kontrolü (düzenle/sil butonlarının görünürlüğü)
  + Accessibility (WCAG 2.1 AA compliance)

---

## 4. Ürüne Yorum Ekleme Formu

* **API Endpoint:** `POST /products/{productId}/reviews`
* **Görev:** Kullanıcıların ürüne yorum ekleyebileceği form bileşeninin tasarımı ve implementasyonu

* **UI Bileşenleri:**
  + Responsive yorum ekleme formu (modal dialog veya sayfa içi form)
  + Puan seçici (1-5 yıldız, tıklanabilir yıldız bileşeni)
  + Yorum metni textarea alanı (max 1000 karakter, karakter sayacı)
  + "Gönder" butonu (primary button style)
  + "İptal" butonu (secondary button style)
  + Loading spinner (gönderim sırasında)
  + Giriş yapılmamışsa "Yorum yapmak için giriş yapın" uyarısı ve giriş linki

* **Form Validasyonu:**
  + Puan seçimi zorunlu kontrolü
  + Yorum metni min/max karakter kontrolü (opsiyonel alan, ancak girilmişse min 10 karakter)
  + Kullanıcı bu ürüne zaten yorum yapmışsa form gösterilmez, uyarı mesajı gösterilir (409 Conflict)
  + Tüm zorunlu alanlar dolmadan "Gönder" butonu disabled

* **Kullanıcı Deneyimi:**
  + Başarılı yorum ekleme sonrası yorum listesine anlık ekleme (optimistic update)
  + Başarılı işlem sonrası success notification (toast/snackbar)
  + Hata durumunda kullanıcı dostu mesajlar
  + Hover'da yıldız önizleme efekti (yıldız seçicide)
  + Keyboard navigation desteği

* **Teknik Detaylar:**
  + Star rating bileşeni (custom veya kütüphane)
  + Form state management
  + JWT token ile kimlik doğrulama (giriş yapılmamışsa form erişimi engellenir)
  + State güncelleme (yorum listesine anlık ekleme)

---

## 5. Yorum Düzenleme Akışı

* **API Endpoint:** `PUT /products/{productId}/reviews/{reviewId}`
* **Görev:** Kullanıcının mevcut yorumunu düzenleyebileceği UI akışının tasarımı ve implementasyonu

* **UI Bileşenleri:**
  + Yorum kartındaki "Düzenle" butonu (sadece yorum sahibine görünür)
  + Düzenleme formu (mevcut puan ve yorum metniyle dolu — modal veya inline)
  + Puan seçici (mevcut puan seçili)
  + Yorum metni textarea (mevcut metinle dolu)
  + "Güncelle" butonu (primary button)
  + "İptal" butonu (secondary button)
  + Unsaved changes indicator

* **Form Validasyonu:**
  + Puan seçimi zorunlu kontrolü
  + Değişiklik yoksa "Güncelle" butonu disabled
  + Yorum metni karakter sınırı kontrolü

* **Kullanıcı Deneyimi:**
  + Optimistic update (güncelleme anında UI'ya yansır)
  + Başarılı güncelleme sonrası success notification (toast/snackbar)
  + Hata durumunda değişiklikler geri alınır
  + "İptal" butonuna basıldığında değişiklik kaybı için confirmation dialog

* **Teknik Detaylar:**
  + Form state management (initial values, dirty state)
  + JWT token ile yetkilendirme (sadece yorum sahibi düzenleyebilir)
  + Optimistic UI update ve rollback mekanizması

---

## 6. Yorum Silme Akışı

* **API Endpoint:** `DELETE /products/{productId}/reviews/{reviewId}`
* **Görev:** Kullanıcının kendi yorumunu silebileceği UI akışının tasarımı ve implementasyonu

* **UI Bileşenleri:**
  + Yorum kartındaki "Sil" butonu (yorum sahibine veya admin'e özel, danger button style)
  + Onay modal dialog'u ("Bu yorumu silmek istediğinize emin misiniz?")
  + "Evet, Sil" butonu (danger button)
  + "İptal" butonu (secondary button)
  + Loading indicator (silme işlemi sırasında)

* **Kullanıcı Deneyimi:**
  + Destructive action için görsel uyarılar (kırmızı renk, warning icon)
  + İptal seçeneği her zaman mevcut (modal close, cancel button)
  + Başarılı silme sonrası yorum listesinden anlık kaldırma (optimistic update)
  + Başarılı işlem sonrası success notification (toast/snackbar)
  + Hata durumunda error mesajı ve yorum listesi geri yüklenir

* **Teknik Detaylar:**
  + Modal/Dialog component kullanımı
  + JWT token ile yetkilendirme (sadece yorum sahibi veya admin silebilir)
  + Optimistic UI update ve rollback mekanizması
  + State güncelleme (yorumun listeden anlık kaldırılması)

---

## 7. Ürün Puanlama Bileşeni

* **API Endpoint:** `POST /products/{productId}/ratings`
* **Görev:** Kullanıcıların ürünü 1-5 arasında puanlayabileceği bileşenin tasarımı ve implementasyonu

* **UI Bileşenleri:**
  + Tıklanabilir yıldız puanlama bileşeni (1-5 yıldız)
  + Kullanıcının mevcut puanı gösterimi (daha önce puan vermişse)
  + Ürün detay sayfasında ortalama puan + toplam puanlayan sayısı gösterimi
  + Giriş yapılmamışsa "Puan vermek için giriş yapın" uyarısı

* **Kullanıcı Deneyimi:**
  + Hover'da yıldız önizleme efekti
  + Başarılı puanlama sonrası ortalama puanın anlık güncellenmesi
  + Kullanıcı daha önce puan vermişse mevcut puanı vurgulu gösterme
  + Başarılı işlem sonrası success notification (toast/snackbar)
  + Hata durumunda kullanıcı dostu mesaj

* **Teknik Detaylar:**
  + Star rating bileşeni (custom veya kütüphane)
  + JWT token ile kimlik doğrulama
  + State güncelleme (ortalama puanın anlık güncellenmesi)
  + Accessibility (keyboard ile puan verme desteği, ARIA attributes)
