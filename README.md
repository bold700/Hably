# HABLY - High Performance Goal Planner

Een digitale High Performance Goal Planner gebouwd met Next.js en Material Design 3.

## Features

- 🎯 Goal Wizard - Stel grote doelen op met een begeleide wizard
- 📝 Check In - Gecombineerde dagelijkse, wekelijkse en maandelijkse reviews
- 📊 Progress Dashboard - Visuele voortgangsweergave met statistieken
- 📈 Mijlpaal Tracking - Volg je voortgang met duidelijke mijlpalen
- 🔄 Gewoontes - Vertaal je doelen naar dagelijkse gewoontes

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Material UI v6 met Material Design 3
- LocalStorage voor data persistentie

## Installatie

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Build voor Productie

```bash
npm run build
npm start
```

## Deployment

### Optie 1: Vercel (Aanbevolen)

1. Push je code naar GitHub
2. Ga naar [vercel.com](https://vercel.com)
3. Import je GitHub repository
4. Vercel detecteert automatisch Next.js en configureert alles

**Gratis hosting met automatische deploys bij elke push!**

### Optie 2: Netlify

1. Push je code naar GitHub
2. Ga naar [netlify.com](https://netlify.com)
3. Nieuwe site → Import from Git
4. Selecteer je repository
5. Build command: `npm run build`
6. Publish directory: `.next`

### Optie 3: GitHub Pages (Statische Export)

GitHub Pages host alleen statische sites. Voor Next.js moet je een statische export gebruiken:

```bash
npm run build:static
```

Dit exporteert een statische versie in de `/out` folder die je kunt pushen naar GitHub Pages.

**Let op**: Statische export heeft beperkingen - geen server-side features, maar werkt goed voor deze app omdat alles client-side is met LocalStorage.

## Project Structuur

```
/app          - Next.js app router pages
/components   - Herbruikbare React componenten
/types        - TypeScript type definities
/utils        - Helper functies en services
```

## Licentie

MIT

