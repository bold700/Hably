# 🚀 Vercel Deployment - Quick Start

## Stappen om HABLY op Vercel te deployen:

### 1️⃣ Push naar GitHub

```bash
# Als je nog geen git repo hebt
git init
git add .
git commit -m "Initial commit: HABLY Goal Planner"

# Maak een nieuwe repository op GitHub (github.com/new)
# Dan push:
git remote add origin https://github.com/[jouw-username]/Hably.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy op Vercel

1. **Ga naar [vercel.com](https://vercel.com)**
2. **Klik "Sign Up"** en log in met GitHub
3. **Klik "Add New Project"**
4. **Selecteer je HABLY repository**
5. **Vercel detecteert automatisch:**
   - Framework: Next.js ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅
6. **Klik "Deploy"**
7. **Wacht 1-2 minuten** ⏳
8. **Klaar!** 🎉

Je krijgt een URL zoals: `https://hably-xxx.vercel.app`

### 3️⃣ Automatische Updates

- Elke push naar `main` branch = automatische deploy
- Elke pull request = preview deployment
- SSL certificaat automatisch
- Custom domain mogelijk

### 4️⃣ Custom Domain (Optioneel)

1. Ga naar je project op Vercel
2. Settings → Domains
3. Voeg je domein toe (bijv. `hably.nl`)
4. Volg de DNS instructies

## ✅ Dat was het!

Vercel is speciaal gemaakt door de makers van Next.js, dus alles werkt perfect out-of-the-box.

---

## Troubleshooting

### Build Fout?
- Check dat alle dependencies in `package.json` staan
- Check de build logs op Vercel dashboard

### Environment Variables nodig?
- Project Settings → Environment Variables
- Voeg toe en redeploy

### LocalStorage werkt niet?
- Check dat je via https:// draait (niet http://)
- LocalStorage werkt alleen op secure origins

