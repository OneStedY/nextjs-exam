# Movies App (Next.js)

Перероблено з Vite+React на **Next.js (App Router)** відповідно до ТЗ:
- Проєкт **виключно на Next.js**
- Сторінки виконані як **Server Components** (не client-only)
- Клієнтські компоненти використані тільки там, де потрібна інтерактивність (пошук, active nav, зірочки рейтингу)

## Запуск

1. Встанови залежності:

```bash
npm i
```

2. Створи `.env.local` на основі `.env.example` і додай ключ:

```bash
TMDB_API_KEY=...YOUR_KEY...
```

3. Запусти dev:

```bash
npm run dev
```

## Архітектура

- `app/page.tsx` — список фільмів (server), читає `searchParams` (`page`, `genre`, `q`)
- `app/movies/[id]/page.tsx` — деталі фільму (server)
- `lib/tmdb.ts` — server-side fetch до TMDB (із `revalidate`)
- `components/SearchBar.tsx` — client (debounce + `router.replace` для зміни URL)
- `components/Header.tsx` — client (active link)
- `components/RatingStars.tsx` — client (react-star-ratings)

