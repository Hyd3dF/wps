# PLATFORM SPEC — Topic-First Social Network
> Bu belge, AI mühendise (Cursor / Claude Code) verilmek üzere hazırlanmıştır.
> Türkçe-English karma yazılmıştır; kod ve teknik terimler İngilizce, açıklamalar Türkçe'dir.

---

## 1. VİZYON & FARK

### Ne İnşa Ediyoruz?
Tweet değil **Konu** açılan, gerçek tartışmaların yaşandığı, geliştiriciler ve teknik insanlar için tasarlanmış bir web platformu.

### Twitter/X'ten Farkı
| Twitter / X | Bu Platform |
|---|---|
| Tweet = anlık, kaybolur | Konu = kalıcı, aranabilir, büyüyen |
| Feed odaklı, algoritmik | Konu odaklı, chronological & trending |
| 280 karakter limiti | Markdown destekli, sınırsız derinlik |
| Yorum = düz thread | Yorumlar = nested, oylanabilir |
| Oda/topluluk yok | Odalar = real-time grup iletişimi |
| Profil = vanity | Profil = katkı geçmişi, itibar |

### Hedef Kitle
Geliştiriciler, teknik kurucular, indie hackerlar, startup topluluğu — özellikle Türkiye/MENA bölgesindeki teknik kullanıcılar.

### Slogan (opsiyonel)
> "Düşüncen tweet olmasın. Konu açsın."

---

## 2. TEKNİK STACK

```
Frontend : Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend  : Node.js (Express veya Next.js API Routes)
Database : PostgreSQL (Supabase veya self-hosted)
Realtime : Supabase Realtime (WebSocket based)
Storage  : Self-hosted (NexusDB veya S3-compatible)
Auth     : JWT (RS256) — kendi auth sistemi
Cache    : Redis (opsiyonel, rate limiting & session)
Deploy   : Docker + kendi sunucu (Coolify veya PM2)
```

---

## 3. VERİTABANI ŞEMASI

### `users`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
username      VARCHAR(32) UNIQUE NOT NULL
email         VARCHAR(255) UNIQUE NOT NULL
password_hash TEXT NOT NULL  -- scrypt
display_name  VARCHAR(64)
bio           TEXT
avatar_url    TEXT
website_url   TEXT
github_url    TEXT
twitter_url   TEXT
reputation    INTEGER DEFAULT 0
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

### `topics`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
title         VARCHAR(200) NOT NULL
body          TEXT NOT NULL  -- Markdown
category      VARCHAR(50)    -- 'general' | 'dev' | 'design' | 'startup' | 'offtopic'
tags          TEXT[]         -- ['javascript', 'react', ...]
upvotes       INTEGER DEFAULT 0
downvotes     INTEGER DEFAULT 0
view_count    INTEGER DEFAULT 0
comment_count INTEGER DEFAULT 0
is_pinned     BOOLEAN DEFAULT FALSE
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

### `comments`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
topic_id      UUID REFERENCES topics(id) ON DELETE CASCADE
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
parent_id     UUID REFERENCES comments(id) ON DELETE CASCADE  -- NULL = root comment
body          TEXT NOT NULL  -- Markdown
upvotes       INTEGER DEFAULT 0
depth         INTEGER DEFAULT 0  -- max 3
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

### `votes`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
target_type   VARCHAR(10) NOT NULL  -- 'topic' | 'comment'
target_id     UUID NOT NULL
value         SMALLINT NOT NULL  -- 1 (up) veya -1 (down)
created_at    TIMESTAMPTZ DEFAULT NOW()
UNIQUE (user_id, target_type, target_id)
```

### `saves`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
topic_id      UUID REFERENCES topics(id) ON DELETE CASCADE
created_at    TIMESTAMPTZ DEFAULT NOW()
UNIQUE (user_id, topic_id)
```

### `rooms`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
owner_id      UUID REFERENCES users(id) ON DELETE CASCADE
name          VARCHAR(64) NOT NULL
description   TEXT
slug          VARCHAR(64) UNIQUE NOT NULL
is_private    BOOLEAN DEFAULT FALSE
member_count  INTEGER DEFAULT 1
created_at    TIMESTAMPTZ DEFAULT NOW()
```

### `room_members`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
room_id       UUID REFERENCES rooms(id) ON DELETE CASCADE
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
role          VARCHAR(20) DEFAULT 'member'  -- 'owner' | 'admin' | 'member'
joined_at     TIMESTAMPTZ DEFAULT NOW()
UNIQUE (room_id, user_id)
```

### `room_messages`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
room_id       UUID REFERENCES rooms(id) ON DELETE CASCADE
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
type          VARCHAR(20) DEFAULT 'text'  -- 'text' | 'image' | 'file'
content       TEXT
file_url      TEXT   -- eğer type = 'image' veya 'file'
file_name     TEXT
file_size     INTEGER
created_at    TIMESTAMPTZ DEFAULT NOW()
```

### `follows`
```sql
follower_id   UUID REFERENCES users(id) ON DELETE CASCADE
following_id  UUID REFERENCES users(id) ON DELETE CASCADE
created_at    TIMESTAMPTZ DEFAULT NOW()
PRIMARY KEY (follower_id, following_id)
```

### `notifications`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
type          VARCHAR(50) NOT NULL  -- 'comment_reply' | 'topic_vote' | 'mention' | 'room_message' | 'follow'
title         TEXT NOT NULL
body          TEXT
link          TEXT
is_read       BOOLEAN DEFAULT FALSE
actor_id      UUID REFERENCES users(id)
created_at    TIMESTAMPTZ DEFAULT NOW()
```

---

## 4. API ROUTES (REST)

### Auth
```
POST   /api/auth/register       -- kayıt
POST   /api/auth/login          -- giriş, JWT döner
POST   /api/auth/refresh        -- token yenile
POST   /api/auth/logout         -- çıkış
GET    /api/auth/me             -- mevcut kullanıcı bilgisi
```

### Users
```
GET    /api/users/:username     -- profil sayfası
PUT    /api/users/me            -- profil güncelle
POST   /api/users/me/avatar     -- avatar yükle (multipart)
GET    /api/users/:username/topics    -- kullanıcının konuları
GET    /api/users/:username/saved     -- kaydedilmiş konular (sadece kendi)
GET    /api/users/:username/comments  -- kullanıcı yorumları
POST   /api/users/:username/follow    -- takip et
DELETE /api/users/:username/follow    -- takibi bırak
```

### Topics
```
GET    /api/topics              -- liste (query: ?sort=trending|new|top&tag=&category=&page=)
POST   /api/topics              -- yeni konu oluştur
GET    /api/topics/:id          -- konu detayı
PUT    /api/topics/:id          -- güncelle (sadece yazar)
DELETE /api/topics/:id          -- sil (sadece yazar)
POST   /api/topics/:id/vote     -- oy ver/kaldır (body: { value: 1 | -1 })
POST   /api/topics/:id/save     -- kaydet
DELETE /api/topics/:id/save     -- kaydı kaldır
GET    /api/topics/:id/comments -- yorumlar (nested)
POST   /api/topics/:id/comments -- yorum ekle (body: { body, parent_id? })
PUT    /api/comments/:id        -- yorum güncelle
DELETE /api/comments/:id        -- yorum sil
POST   /api/comments/:id/vote   -- yorum oylaması
```

### Rooms
```
GET    /api/rooms               -- odalar listesi (public)
POST   /api/rooms               -- oda oluştur
GET    /api/rooms/:slug         -- oda detayı + son mesajlar
POST   /api/rooms/:slug/join    -- odaya katıl
DELETE /api/rooms/:slug/leave   -- odadan ayrıl
GET    /api/rooms/:slug/members -- üyeler
GET    /api/rooms/:slug/messages?before=<cursor>&limit=50  -- sayfalı mesajlar
POST   /api/rooms/:slug/messages -- mesaj gönder (text veya file)
DELETE /api/rooms/:slug/messages/:id -- mesaj sil (sadece yazar/admin)
```

### Search
```
GET    /api/search?q=&type=topics|users|rooms
```

### Notifications
```
GET    /api/notifications
POST   /api/notifications/read-all
PATCH  /api/notifications/:id/read
```

---

## 5. REAL-TIME (WebSocket / Supabase Realtime)

Şu kanallar realtime olmalı:

```
room:{slug}        → yeni mesaj, mesaj silme, üye katılımı/ayrılımı
notifications:{userId} → yeni bildirim push
topic:{id}         → yorum sayısı, oy sayısı anlık güncelleme (opsiyonel)
```

---

## 6. SAYFALAR & ROUTING

### Public Sayfalar
```
/                      → Ana sayfa: trending konular + featured odalar
/explore               → Keşif: tüm konular, filtreli
/topics/[id]           → Konu detay sayfası
/rooms                 → Tüm odalar listesi
/rooms/[slug]          → Oda detay + real-time sohbet
/u/[username]          → Kullanıcı profil sayfası
/search?q=             → Arama sonuçları
/login                 → Giriş
/register              → Kayıt
```

### Protected Sayfalar (auth gerekli)
```
/new-topic             → Yeni konu oluştur
/settings              → Profil & hesap ayarları
/notifications         → Bildirimler
/saved                 → Kaydedilen konular
/new-room              → Yeni oda oluştur
```

---

## 7. COMPONENT TREE (UI)

```
<Layout>
  ├── <Navbar>
  │     ├── Logo
  │     ├── SearchBar
  │     ├── [Giriş yapmış] NotificationBell | AvatarMenu
  │     └── [Giriş yapmamış] Login | Register buttons
  │
  ├── <Sidebar> (masaüstü)
  │     ├── NavLinks (Ana Sayfa, Keşif, Odalar)
  │     ├── Kategoriler
  │     └── Popüler Etiketler
  │
  └── <PageContent />

```

### TopicCard (liste görünümü)
```
[Avatar] [Kullanıcı adı] [Tarih]   [Kaydet butonu]
[Başlık - büyük]
[Body preview - 2 satır, markdown stripped]
[Etiketler] [Kategori]
[⬆ 42] [💬 18 yorum] [👁 312 görüntülenme]
```

### TopicDetail Sayfası
```
[Geri]
[Başlık - h1]
[Yazar avatarı + adı + tarih + kategori + etiketler]
[Markdown Body - tam render]
[⬆ Oy ver | ⬇ | Kaydet | Paylaş]
─────────────────────────────────
[Yorum Yaz textarea]
[Yorumlar - nested, threaded]
  └─ [Avatar] [Ad] [Tarih]
       [Body]
       [⬆ Oy] [Yanıtla]
       └─ [Alt yorumlar - max 3 seviye]
```

### Room Sayfası (sol: mesajlar, sağ: üyeler)
```
┌──────────────────────────────────┬─────────────┐
│ #oda-adı                         │ Üyeler (12) │
│ ─────────────────────────────── │             │
│ [Mesaj Akışı - scroll to bottom] │ [Avatar+Ad] │
│                                  │ [Avatar+Ad] │
│ ─────────────────────────────── │ ...         │
│ [📎] [Mesaj yaz...        ] [➤] │             │
└──────────────────────────────────┴─────────────┘
```

### Profil Sayfası
```
[Banner alanı - opsiyonel]
[Büyük Avatar] [Ad] [Kullanıcı adı] [@username]
[Bio] [Website] [GitHub] [Twitter]
[Konuları: X] [Yorumları: Y] [Takipçi: Z] [Takip: W]
[Takip Et butonu - başkası görüyorsa]
─────────────────────────────────
[Tabs: Konular | Yorumlar | Kaydedilenler*]
  * Kaydedilenler sadece profil sahibine görünür
[İçerik listesi]
```

---

## 8. UI & TASARIM SİSTEMİ

### Renk Paleti (Dark Theme — zorunlu)
```
--bg-primary:    #0C0C0E   (ana arkaplan)
--bg-secondary:  #141417   (card/panel arkaplanı)
--bg-tertiary:   #1C1C21   (hover, input)
--border:        #2A2A32   (sınırlar)
--text-primary:  #F0F0F5   (başlık)
--text-secondary:#9999AA   (ikincil metin)
--accent:        #6C63FF   (mor/indigo — primary action)
--accent-hover:  #8B85FF
--success:       #22C55E
--danger:        #EF4444
--warning:       #F59E0B
```

### Typography
```
Display  : "Cal Sans" veya "Plus Jakarta Sans" (bold, başlıklar)
Body     : "Inter" (14px-16px, normal okuma)
Mono     : "JetBrains Mono" (kod blokları)
```

### Spacing & Border Radius
```
Border radius: 8px (card), 6px (button), 4px (badge), 9999px (pill)
Padding card: 20px
Gap between elements: 16px
```

### Animasyonlar
```
Tüm hover: transition 150ms ease
Modal/drawer: 200ms ease-out
Toast notification: slide-in from right, 300ms
```

---

## 9. MARKDOWN EDITOR

Konu yazarken ve yorumlarda kullanılan editör:

- **Kütüphane:** `@uiw/react-md-editor` veya `tiptap`
- **Preview:** Markdown anlık önizleme (split view veya toggle)
- **Desteklenen özellikler:**
  - Bold, italic, strikethrough
  - Başlıklar (h1-h3)
  - Kod blokları (syntax highlighting — `highlight.js`)
  - Bağlantılar
  - Resim ekleme (URL veya upload)
  - Liste (sıralı/sırasız)
  - Alıntı (blockquote)
  - Mention: `@kullanıcı` → autocomplete açılır

---

## 10. DOSYA YÜKLEMELERİ

- **Avatar:** JPEG/PNG, max 2MB, sunucuda 256x256'ya resize
- **Oda mesajı - fotoğraf:** JPEG/PNG/GIF/WebP, max 10MB
- **Oda mesajı - dosya:** Herhangi, max 50MB
- **Konu içi resim:** URL embed veya upload, max 5MB
- **Upload endpoint:** `POST /api/upload` — multipart/form-data
- **Storage:** Kendi NexusDB veya S3-compatible (MinIO)

---

## 11. GÜVENLİK

```
- JWT RS256 (access: 15dk, refresh: 7gün)
- Rate limiting: 
    POST /api/topics → max 10/saat/kullanıcı
    POST /api/comments → max 30/saat/kullanıcı
    POST /api/auth/login → max 5/dakika/IP
- Input sanitization: DOMPurify (markdown render öncesi)
- File type validation: magic bytes check (sadece uzantıya güvenme)
- CORS: sadece kendi domain
- Helmet.js: HTTP header güvenliği
- XSS: markdown renderer sandbox
```

---

## 12. TRENDING ALGORİTMASI

```
score = (upvotes - downvotes) + (comment_count * 1.5) + (view_count * 0.1)
age_factor = 1 / ((hours_since_creation + 2) ^ 1.8)
trending_score = score * age_factor
```

Hacker News algoritmasından ilham alınmıştır. Her 10 dakikada bir background job ile güncellenir.

---

## 13. DEVELOPMENT ORTAMI & KURULUM

```bash
# Gerekli servisler
- Node.js 20+
- PostgreSQL 15+
- Redis (opsiyonel)
- Docker (opsiyonel)

# Env değişkenleri
DATABASE_URL=postgresql://user:pass@localhost:5432/platform
JWT_PRIVATE_KEY=<RS256 private key>
JWT_PUBLIC_KEY=<RS256 public key>
STORAGE_URL=http://localhost:3001  # NexusDB veya MinIO
STORAGE_API_KEY=<key>
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

---

## 14. FAZLAR (MVP → V1)

### Faz 1 — MVP (2-3 hafta)
- [ ] Auth (register, login, JWT)
- [ ] Profil sayfası (görüntüleme + düzenleme + avatar)
- [ ] Konu oluştur / listele / detay
- [ ] Yorum sistemi (nested, 3 seviye)
- [ ] Oy verme (konu + yorum)
- [ ] Kaydetme
- [ ] Temel arama
- [ ] Dark UI — tam responsive

### Faz 2 — V1 (1-2 hafta)
- [ ] Odalar (create, join, real-time mesaj)
- [ ] Oda dosya/fotoğraf paylaşımı
- [ ] Bildirim sistemi
- [ ] Takip et/bırak
- [ ] Tag bazlı filtreleme + keşif sayfası
- [ ] Trending algoritması

### Faz 3 — V2 (gelecek)
- [ ] Mention sistemi (@kullanıcı)
- [ ] Dark/light mode toggle
- [ ] Moderasyon araçları
- [ ] API key sistemi (developer erişimi)
- [ ] Mobile PWA
- [ ] Mobile uygulama (React Native veya Flutter)

---

## 15. AI MÜHENDİSE SYSTEM PROMPT

> Aşağıdaki metni doğrudan Cursor, Claude Code veya benzeri bir AI kodlama aracına kopyalayıp yapıştırabilirsin.

---

```
You are an expert full-stack engineer. Your task is to build a modern, dark-themed topic-first social platform.

TECH STACK:
- Next.js 14 with App Router and TypeScript
- Tailwind CSS for styling
- PostgreSQL with raw SQL queries (no ORM — use pg library)
- JWT authentication (RS256) — build from scratch, no next-auth
- Supabase Realtime for WebSocket-based room messaging
- Self-hosted file storage (multipart upload to /api/upload)

DESIGN SYSTEM:
- Background: #0C0C0E (primary), #141417 (cards), #1C1C21 (hover/input)
- Border: #2A2A32
- Text: #F0F0F5 (primary), #9999AA (secondary)
- Accent: #6C63FF (primary action color)
- Font: Inter (body), Cal Sans or Plus Jakarta Sans (headings), JetBrains Mono (code)
- Border radius: 8px cards, 6px buttons
- All transitions: 150ms ease

CORE CONCEPT:
This is NOT a tweet-based platform. Users open TOPICS (like forum threads) with titles and markdown bodies. Topics are permanent, searchable, and support nested comments (max 3 levels). Real-time Rooms exist separately for live chat.

KEY FEATURES TO BUILD:
1. Auth: register/login with email+password, JWT access (15min) + refresh (7 days)
2. Topics: create (title + markdown body + tags + category), list (trending/new/top), detail with nested comments, upvote/downvote, save
3. Comments: nested up to 3 levels, upvote/downvote, markdown support
4. Rooms: create room, join/leave, real-time text messages via WebSocket, file/image sharing
5. Profiles: avatar upload, bio, website/github links, list of user's topics/comments
6. Notifications: comment replies, votes, follows, room messages
7. Search: full-text search on topics

DATABASE: Use the exact schema provided in the platform spec document. All UUIDs, all timestamps as TIMESTAMPTZ.

TRENDING SCORE: score = (upvotes - downvotes) + (comments * 1.5) + (views * 0.1), multiplied by age decay: 1 / ((hours_since_creation + 2) ^ 1.8). Run in background every 10 minutes.

SECURITY:
- Rate limit: 10 topic creates/hour, 30 comments/hour, 5 login attempts/minute/IP
- Sanitize all markdown with DOMPurify before rendering
- Validate file uploads by magic bytes, not just extension
- CORS: own domain only
- Use Helmet.js for HTTP headers

FOLDER STRUCTURE:
/app — Next.js App Router pages
/app/api — API route handlers
/components — Reusable UI components
/lib — Database client, auth utilities, validators
/types — TypeScript interfaces
/styles — Global CSS (Tailwind base)

Start by building the database migration file, then the auth system, then topics CRUD, then the UI components.

Always write clean, typed TypeScript. No 'any' types. Comment complex logic. Handle all errors with proper HTTP status codes and JSON error responses.
```

---

*Bu belge versiyon 1.0'dır. Platformun adı henüz belirlenmemiştir — ürün ismi kararı ayrıca verilecektir.*
