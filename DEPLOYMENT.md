# 🚀 Deployment Guide

Deploy MALP to any of these platforms. The app is fully serverless — no database, no backend, no account system. All data lives in the browser.

---

## Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fheat-a11y%2Ferph-moe)

### Automatic Deploy (1-Click)

1. Click the **Deploy with Vercel** button above.
2. Log in with your GitHub, GitLab, or Bitbucket account.
3. Vercel will fork the repo (or connect your existing fork) and deploy automatically.
4. Once deployed, set your environment variable:
   - Go to your project dashboard → **Settings** → **Environment Variables**.
   - Add `OPENAI_API_KEY` with your OpenAI API key (optional — the app works without it).
5. Redeploy or wait for the automatic redeploy. Done.

### Manual Deploy (via Git)

1. Push the repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Keep all default settings (framework is auto-detected as Next.js).
5. Add environment variable `OPENAI_API_KEY` (optional).
6. Click **Deploy**.

Your app will be live at `https://your-project.vercel.app` within minutes. Every push to `main` triggers an automatic redeploy.

### Custom Domain

1. In your Vercel dashboard, go to your project → **Settings** → **Domains**.
2. Add your custom domain and follow the DNS instructions.

---

## Netlify

MALP can also be deployed on Netlify using the Next.js runtime.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Push the repository to GitHub.
2. Go to [app.netlify.com](https://app.netlify.com) and click **Add new site** → **Import an existing project**.
3. Connect your GitHub repository.
4. Set the following:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - **Functions directory:** `netlify/functions` (leave blank)
5. Add environment variable `OPENAI_API_KEY` (optional).
6. Click **Deploy site**.

> **Note:** Netlify does not support Next.js API routes (`/api/generate`) without additional configuration. To use AI generation on Netlify, you'll need to set up a separate serverless function or use an external API proxy. Without this, template-based generation still works locally.

---

## GitHub Pages

Since MALP outputs a fully static site (`npm run build` → `out/`), you can host it on GitHub Pages for free. Note that API routes won't work — use this option only if you don't need AI generation or plan to call a separate API.

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then enable GitHub Pages in your repository: **Settings** → **Pages** → Source: **GitHub Actions**.

---

## Docker

If you prefer containerised deployment:

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t malp .
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... malp
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | No | — | OpenAI API key for AI lesson plan generation. Without it, template-based plans are used. |
| `OPENAI_MODEL` | No | `gpt-4o` | OpenAI model to use. Options: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`. |

---

## Verifying Your Deployment

1. Visit the deployed URL.
2. Navigate to **Timetable Setup** — add a few slots.
3. Go to **Dashboard** — click **Generate Daily**.
4. If you configured `OPENAI_API_KEY`, you should receive an AI-generated plan. Without it, a template plan is created.
5. Browse the **Curriculum Reference** page — all DSKP standards and textbook units should load.
6. Check that all data persists after refreshing the page (localStorage).

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| "OPENAI_API_KEY is not configured" | Missing env var | Add `OPENAI_API_KEY` to your hosting platform's environment variables and redeploy. |
| Blank page on deploy | Build output not served correctly | Ensure the publish directory is `.next` (Vercel) or `out` (static hosts). |
| Timetable not saving | localStorage disabled or full | Check browser settings. MALP requires localStorage enabled. |
| API route returns 404 | Static hosting without server runtime | Use Vercel or a Node.js server. Static hosts can't run API routes. |
