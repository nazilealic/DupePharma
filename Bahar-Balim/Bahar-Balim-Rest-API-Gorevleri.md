Bahar Balım'ın REST API Metotları

API Test Videosu: https://youtu.be/q4fH0qk1iWM

1. Üye Olma
Endpoint: POST /auth/register
Request Body:
{
  "fullName": "Bahar Balım",
  "email": "bahar@123test.com",
  "password": "12345678"
}
Authentication: Gerekli değil
Response: 201 Created - Kullanıcı başarıyla oluşturuldu.

2. Kullanıcı Giriş (Login)
Endpoint: POST /auth/login
Request Body:
{
  "email": "bahar@123test.com",
  "password": "12345678"
}
Authentication: Gerekli değil
Response: 200 OK - Kullanıcı giriş yaptı ve JWT token alındı.

3. Ürün Güncelleme (Admin)
Endpoint: PUT /products/{productId}
Path Parameters:
productId (string, required) - Güncellenecek ürünün ID’si
Request Body:
{
  "price": 820,
  "description": "Güncellenmiş açıklama"
}
Authentication: Bearer Token gerekli
Response: 200 OK - Ürün başarıyla güncellendi.

4. Ürün Silme (Admin)
Endpoint: DELETE /admin/products/{productId}
Path Parameters:
productId (string, required) - Silinecek ürünün ID’si
Authentication: Bearer Token gerekli
Response: 204 No Content - Ürün başarıyla silindi.

5. Ürün Detaylarını Getirme
Endpoint: GET /products/{id}/details
Path Parameters:
id (string, required) - Detayı getirilecek ürünün ID’si
Authentication: Bearer Token gerekli
Response: 200 OK - Ürün detay bilgileri başarıyla getirildi.

6. Yapay Zeka Ürün Analizi
Endpoint: POST /ai/product-analysis
Authentication: Bearer Token gerekli
Response: 200 OK - Ürün için yapay zeka analiz sonucu başarıyla döndürüldü.

7. Şifre Güncelleme
Endpoint: PUT /users/{id}/password
Path Parameters:
id (string, required) - Şifresi güncellenecek kullanıcı ID’si
Request Body:
{
  "newPassword": "12345678"
}
Authentication: Bearer Token gerekli
Response: 200 OK - Kullanıcı şifresi başarıyla güncellendi.

 
