# HAUSAURA

Premium E-Commerce für Haushaltsgeräte — Next.js 16, React 19, Prisma, Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Database:** PostgreSQL + Prisma 6
- **Auth:** JWT (jose + jsonwebtoken), bcrypt
- **Search:** Algolia
- **Email:** Resend
- **Images:** Cloudinary
- **State:** Zustand (cart)
- **Validation:** Zod
- **Testing:** Vitest + Playwright

## Setup

```bash
npm install
cp .env.example .env.local   # Configureer je environment variables
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Scripts

| Script | Beschreibung |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Productie build |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright) |
| `npm run db:seed` | Database seeden |
| `npm run db:studio` | Prisma Studio openen |

## Structuur

```
app/              # Next.js App Router pages + API routes
components/       # React components (admin, product, layout, ui)
lib/              # Business logic, utils, email templates
prisma/           # Database schema + seed
public/           # Static assets
e2e/              # Playwright E2E tests
tests/            # Unit tests
```

## Environment Variables

Zie `.env.example` voor alle vereiste variabelen.

## License

Proprietary — HAUSAURA GmbH
