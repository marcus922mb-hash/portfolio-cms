# my-project

Projekt zarządzany przez **Super Z** (asystenta AI). Repozytorium służy do deployowania kodu wygenerowanego w sesji na GitHub.

## Stack

- **Runtime**: Node.js + Next.js (do aplikacji webowych)
- **Python**: skrypty pomocnicze (`/scripts`)
- **Deliverables**: pliki wynikowe trafiają do `/download`

## Struktura

```
.
├── .github/           # CI/CD workflows (opcjonalnie)
├── .local/            # Lokalne binarki (gitignored, np. gh CLI)
├── download/          # Pliki do pobrania przez użytkownika
├── scripts/           # Skrypty generujące dokumenty/wykresy
└── src/               # Kod aplikacji (jeśli istnieje)
```

## Setup GitHub CLI

GitHub CLI jest zainstalowany lokalnie:

```bash
export PATH="/home/z/my-project/.local/bin:$PATH"
gh --version
gh auth status
```

## Deploy

```bash
# Po zbudowaniu aplikacji:
git add .
git commit -m "feat: initial commit"
gh repo create <nazwa> --source=. --push --public
```
