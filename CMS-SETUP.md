# Private CMS setup

The portfolio remains a Next.js 14 App Router application. CMS content is stored in PostgreSQL through Prisma 6. The public API returns only the portfolio document; database credentials and admin sessions stay server-side.

## Local setup

1. Create a PostgreSQL database (Neon, Supabase, or another managed PostgreSQL provider).
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH`.
3. Generate a password hash without placing the password in source control:

```powershell
node -e "console.log(require('bcryptjs').hashSync('replace-this-locally', 12))"
```

4. Apply the schema:

```powershell
npx prisma db push
npx prisma generate
```

5. Start the app with `npm run dev`.

The first successful public content request creates the initial document from `lib/content/defaultContent.js`. Existing project, profile, about, skills, experience, education, and contact values are included there. The remaining rich certification content continues to use its existing public fallback until it is added through the CMS document.

## Access

Click the existing logo five times within 2.5 seconds. This only opens the login modal; it is not authentication. Sign in with `ADMIN_EMAIL` and the password used to create `ADMIN_PASSWORD_HASH`. Direct requests to `/admin` and all admin content writes require the signed HttpOnly session cookie.

## Deployment

Configure the four CMS variables as Vercel environment secrets for Preview/Production, run `npx prisma db push` against the intended database, and deploy. Use a managed PostgreSQL database for persistence; local SQLite is intentionally not used because it is not durable on Vercel serverless instances. Never add `.env.local` or real credentials to Git.
