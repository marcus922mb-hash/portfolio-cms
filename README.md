# Portfolio CMS

Własny CMS do zarządzania projektami portfolio. Dodawaj, edytuj i udostępniaj swoje realizacje w jednym miejscu.

## Funkcje

- **Panel administracyjny** — pełny CRUD dla projektów, wpisów, stron, kategorii, tagów, komentarzy, mediów, użytkowników
- **Strona publiczna** — portfolio z galerią projektów, blogiem, stronami statycznymi
- **Autoryzacja** — logowanie, middleware chroniący API
- **Edytor Markdown** — WYSIWYG edytor treści (MDXEditor)
- **Upload plików** — przeciągnij i upuść, obsługa obrazów i dokumentów
- **Wykresy** — statystyki na pulpicie (recharts)
- **RSS, Sitemap, Robots.txt** — SEO gotowe
- **Kopia zapasowa** — eksport wszystkich danych jako JSON
- **Tryb jasny/ciemny** — przełącznik motywu
- **W pełni responsywny** — działa na desktopie i mobile

## Stack technologiczny

- **Framework**: Next.js 16 (App Router)
- **Język**: TypeScript 5
- **Baza danych**: Prisma ORM + PostgreSQL (Supabase)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York)
- **Edytor**: MDXEditor
- **Wykresy**: Recharts
- **Dodatki**: framer-motion, react-markdown, next-themes, sonner, lucide-react

## Uruchomienie lokalne

Wymagania: [Bun](https://bun.sh), PostgreSQL (lub Docker).

```bash
# 1. Instalacja zależności
bun install

# 2. Skopiuj env i skonfiguruj bazę
cp .env.example .env
# edytuj .env - ustaw DATABASE_URL dla swojego PostgreSQL

# 3. Push schemy do bazy i seed
bun run db:push
bun run db:seed

# 4. Start dev servera
bun run dev
```

Aplikacja będzie dostępna na `http://localhost:3000`.

Dane logowania (po seedzie): `admin@example.com` / `admin123`

## Deploy na Vercel + Supabase

### 1. Supabase

1. Załóż konto na [supabase.com](https://supabase.com)
2. Stwórz nowy projekt
3. Przejdź do **Project Settings > Database > Connection string**
4. Skopiuj `URI` (pooled connection)

### 2. Vercel

1. Zainstaluj CLI: `npm i -g vercel`
2. W projekcie: `vercel login` i `vercel link`
3. Dodaj zmienne środowiskowe:
   ```
   DATABASE_URL=<connection_string_z_supabase>
   NEXTAUTH_SECRET=<wygeneruj_secret: openssl rand -base64 32>
   NEXTAUTH_URL=https://twoja-domena.vercel.app
   ```
4. Deploy: `vercel --prod`

### 3. Po deployze

1. W konsoli Vercel: **Deployments** → ostatni deploy → **Redeploy** (żeby uruchomić seed)
2. Lub wywołaj `POST /api/seed-all` na swojej domenie

Aplikacja będzie dostępna na `https://twoja-domena.vercel.app`.

## API

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/projects` | Lista projektów |
| POST | `/api/projects` | Dodaj projekt |
| GET | `/api/projects/[id]` | Pobierz projekt |
| PUT | `/api/projects/[id]` | Aktualizuj projekt |
| DELETE | `/api/projects/[id]` | Usuń projekt |
| GET | `/api/posts` | Lista wpisów |
| POST | `/api/posts` | Dodaj wpis |
| GET | `/api/pages` | Lista stron |
| POST | `/api/contact` | Wyślij wiadomość |
| GET | `/api/search?q=` | Szukaj w treści |
| POST | `/api/seed-all` | Zapełnij bazę demo |

Pełna lista endpointów w `src/app/api/`.

## Struktura projektu

```
├── prisma/
│   ├── schema.prisma       # Schemat bazy danych
│   └── seed.ts             # Seed danych demo
├── src/
│   ├── app/
│   │   ├── api/            # REST API
│   │   ├── login/          # Strona logowania
│   │   ├── globals.css     # Style globalne
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Panel admina (SPA)
│   ├── components/
│   │   ├── cms/PublicSite.tsx  # Strona publiczna
│   │   └── ui/             # shadcn/ui komponenty
│   ├── lib/
│   │   ├── auth.ts         # Autoryzacja (serwer)
│   │   ├── db.ts           # Prisma client
│   │   └── utils.ts        # Helper cn()
│   └── middleware.ts       # Ochrona API routes
├── public/uploads/         # Przesłane pliki
├── .env.example            # Szablon zmiennych
├── vercel.json             # Konfiguracja Vercel
└── Caddyfile               # Reverse proxy (self-hosted)
```

## Licencja

MIT
