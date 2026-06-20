# Mersin Cumhuriyet Platformu Web Sitesi

Mersin Cumhuriyet Platformu için resmi web sitesi ve yönetim paneli.

## Özellikler

Tüm site içeriği `/admin` yönetim panelinden yönetilebilir:

- Duyurular, etkinlikler, haberler, projeler
- Basında biz, yayınlar/dokümanlar, yönetim kadrosu
- Hakkımızda sayfası içeriği
- Yönetim kadrosu fotoğraf yükleme
- Canlı duyuru bandı, ana sayfa hero metinleri, iletişim bilgileri
- Üyelik başvuruları (onaylama, reddetme, silme)

## Güvenlik

- Şifreler `scrypt` ile hashlenir, düz metin saklanmaz
- HttpOnly + SameSite=strict oturum çerezi
- HMAC imzalı oturum tokenları
- Giriş ve üyelik formlarında rate limiting
- CSRF koruması (Origin doğrulaması)
- XSS koruması (giriş sanitizasyonu)
- Güvenlik başlıkları (CSP, HSTS, X-Frame-Options vb.)
- Bot koruması (honeypot alanı)
- Admin API'leri oturum gerektirir
- Üye listesi artık herkese açık değil

## Kurulum

```bash
cp .env.example .env
# .env dosyasında ADMIN_PASSWORD ve SESSION_SECRET değerlerini güçlü değerlerle değiştirin
npm install
npm run dev
```

Site: `http://localhost:3000`  
Yönetim paneli: `http://localhost:3000/admin`

## Üretim Ortamı

`.env` dosyasında mutlaka ayarlayın:

- `ADMIN_PASSWORD` — en az 12 karakter
- `SESSION_SECRET` — en az 32 karakter rastgele anahtar

## Teknolojiler

- Next.js 15, React 19, TypeScript, Tailwind CSS
