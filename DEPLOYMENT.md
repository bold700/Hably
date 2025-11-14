# Deployment Guide

## HABLY Deployment Opties

### 🚀 Optie 1: Vercel (Aanbevolen - Eenvoudigst)

**Waarom Vercel?**
- ✅ Gratis hosting
- ✅ Automatische deploys bij elke Git push
- ✅ Perfect voor Next.js (gemaakt door Next.js makers)
- ✅ SSL certificaten automatisch
- ✅ Custom domain support

**Stappen:**
1. Push je code naar GitHub
2. Ga naar [vercel.com](https://vercel.com) en log in met GitHub
3. Klik "Add New Project"
4. Selecteer je HABLY repository
5. Vercel detecteert automatisch Next.js settings
6. Klik "Deploy"
7. Klaar! Je krijgt een URL zoals `hably.vercel.app`

**Updates:**
- Elke push naar `main` branch = automatische deploy
- Elke pull request = preview deployment

---

### 🌐 Optie 2: Netlify

**Stappen:**
1. Push je code naar GitHub
2. Ga naar [netlify.com](https://netlify.com) en log in met GitHub
3. Klik "Add new site" → "Import an existing project"
4. Selecteer je HABLY repository
5. Configureer:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Klik "Deploy site"
7. Klaar! Je krijgt een URL zoals `hably.netlify.app`

---

### 📄 Optie 3: GitHub Pages (Statische Site)

**Let op:** GitHub Pages host alleen statische HTML/CSS/JS. We moeten Next.js exporteren als statische site.

**Stappen:**

1. **Build statische export:**
   ```bash
   npm run build:static
   ```

2. **Push naar GitHub Pages branch:**
   ```bash
   git checkout -b gh-pages
   git add out/
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix out origin gh-pages
   ```

3. **Configureer GitHub Pages:**
   - Ga naar je repository op GitHub
   - Settings → Pages
   - Source: Branch `gh-pages` / folder `/(root)`
   - Save

4. **Je site is live op:**
   `https://[username].github.io/Hably`

**GitHub Actions Automatisering (Optioneel):**

Maak `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build:static
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

---

### 📦 Lokale Build Testen

Test je productie build lokaal:

```bash
npm run build
npm start
```

Test statische export:

```bash
npm run build:static
# Serve de /out folder met een static server
npx serve out
```

---

## Environment Variables

Momenteel gebruikt HABLY geen environment variables (alles gebruikt LocalStorage).

Als je later environment variables nodig hebt:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **GitHub Pages**: Niet beschikbaar (statische sites)

---

## Troubleshooting

### Build Fouten
- Check dat alle dependencies geïnstalleerd zijn: `npm install`
- Check TypeScript errors: `npm run lint`
- Test lokaal: `npm run build`

### GitHub Pages 404
- Check dat `basePath` in `next.config.js` correct is
- Check dat je `/out` folder correct gepusht is
- Check GitHub Pages settings → Source branch

### LocalStorage Werkt Niet
- LocalStorage werkt alleen op http/https (niet file://)
- Check dat je site via een webserver draait

---

## Aanbeveling

**Gebruik Vercel** - Het is de eenvoudigste en beste optie voor Next.js apps!

