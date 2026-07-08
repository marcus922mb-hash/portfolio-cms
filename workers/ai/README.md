# Braided Digital Workers AI

Oddzielny Worker udostępniający natywny binding Cloudflare Workers AI dla
serwerowego AI Routera aplikacji Next.js.

Architektura została wyodrębniona z projektu `woo-saas-cloudflare`:

- binding `AI` z konfiguracji Wrangler,
- typ `Env.AI`,
- wywołanie `env.AI.run(model, { messages, temperature, max_tokens })`,
- lista używanych modeli tekstowych.

Pliki domenowe WooCommerce, D1, KV, R2, Queue oraz sekrety projektu źródłowego
nie są wymagane i nie zostały skopiowane.

Lista modeli została zaktualizowana względem projektu źródłowego. Modele Llama
3.1 bez aktywnego wariantu zostały wycofane przez Cloudflare 30 maja 2026.

## Konfiguracja

1. Skopiuj `.dev.vars.example` do `.dev.vars`.
2. Ustaw `AI_ROUTER_SHARED_SECRET`.
3. W aplikacji Next.js ustaw:

   ```env
   CLOUDFLARE_WORKERS_AI_URL=https://braided-digital-ai.<subdomain>.workers.dev
   CLOUDFLARE_WORKERS_AI_SECRET=<ten-sam-sekret>
   ```

4. Dla produkcji zapisz sekret przez Wrangler:

   ```bash
   npm run workers:ai:secret
   ```

## Polecenia

```bash
npm run workers:ai:types
npm run workers:ai:check
npm run workers:ai:dev
npm run workers:ai:deploy
```

Binding AI zawsze korzysta z infrastruktury zdalnej Cloudflare i może naliczać
zużycie także podczas developmentu.
