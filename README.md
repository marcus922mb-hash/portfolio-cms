# Portfolio CMS

Własny CMS do zarządzania projektami portfolio. Dodawaj, edytuj i udostępniaj swoje realizacje w jednym miejscu.

## ✨ Funkcje

- 📋 **Galeria projektów** — responsywna siatka (1/2/3 kolumny)
- ✏️ **Panel admina** — dodawanie / edycja / usuwanie projektów przez dialog
- 📝 **Markdown** — opisy projektów renderowane przez `react-markdown`
- 🏷️ **Tagi technologii** — stack technologiczny z kolorowymi badges
- 🔗 **Linki zewnętrzne** — demo, repozytorium, obrazek
- ⭐ **Wyróżnione projekty** — baner na górze dla głównego projektu
- 🔍 **Wyszukiwarka i filtry** — po tytule, opisie, technologii, statusie
- 📊 **Statystyki** — liczba projektów, opublikowane, szkice, wyróżnione
- 🌓 **Tryb jasny/ciemny** — przełącznik motywu
- 🎬 **Animacje** — framer-motion, toasty sonner, skeleton loading

## 🛠️ Stack technologiczny

- **Framework**: Next.js 16 (App Router)
- **Język**: TypeScript 5
- **Baza danych**: Prisma ORM + SQLite
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York)
- **Dodatki**: framer-motion, react-markdown, next-themes, sonner, lucide-react

## 🚀 Uruchomienie lokalne

```bash
# 1. Instalacja zależności
bun install

# 2. Skopiuj env
cp .env.example .env

# 3. Push schemy do bazy
bun run db:push

# 4. Start dev servera
bun run dev
```

Aplikacja będzie dostępna na `http://localhost:3000`.

Przy pierwszym uruchomieniu baza zapełni się 3 przykładowymi projektami (TaskFlow, WeatherCast, DevNotes).

## 📁 Struktura projektu

```
.
├── prisma/
│   └── schema.prisma           # Schema bazy (model Project)
├── src/
│   ├── app/
│   │   ├── api/projects/       # REST API (GET/POST/PUT/DELETE)
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Główna strona (galeria + panel admina)
│   │   └── globals.css         # Style globalne + Tailwind
│   ├── components/ui/          # shadcn/ui komponenty
│   └── lib/
│       ├── db.ts               # Prisma client
│       └── utils.ts            # Helper cn()
├── .env.example                # Szablon zmiennych środowiskowych
└── package.json
```

## 📡 API

| Metoda  | Endpoint                 | Opis                          |
|---------|--------------------------|-------------------------------|
| GET     | `/api/projects`          | Lista projektów (`?status=`)  |
| POST    | `/api/projects`          | Dodaj nowy projekt            |
| GET     | `/api/projects/[id]`     | Pobierz pojedynczy projekt    |
| PUT     | `/api/projects/[id]`     | Zaktualizuj projekt           |
| DELETE  | `/api/projects/[id]`     | Usuń projekt                  |
| POST    | `/api/projects/seed`     | Zapełnij bazę demo danymi     |

## 📝 Pola modelu Project

- `title` (string) — tytuł projektu
- `summary` (string) — krótki opis (1 zdanie)
- `description` (string, Markdown) — pełny opis
- `techStack` (JSON array) — lista technologii
- `demoUrl` (string, optional) — link do działającego demo
- `repoUrl` (string, optional) — link do repozytorium
- `imageUrl` (string, optional) — URL obrazka okładki
- `status` (`'draft'` | `'published'`) — status publikacji
- `featured` (boolean) — czy wyróżniony
- `order` (int) — kolejność wyświetlania

## 📄 Licencja

MIT — używaj dowolnie.
