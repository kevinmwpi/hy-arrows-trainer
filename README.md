# HY Arrows Trainer

Interactive React study app for practicing arrow-style physiology questions.

This project is intentionally small and dependency-light:

- React
- Vite
- Plain CSS
- No Tailwind setup required
- No icon library
- No CDN imports

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Build for production

```bash
npm run build
npm run preview
```

## Private question banks

The public repo contains the platform and a starter set of cards. Do **not** commit a full question bank derived from copyrighted study material into this public repo.

Use the **Import** tab in the app to load a local JSON question bank into browser local storage. The imported cards stay local to your browser and are not pushed to GitHub by the app.

Ignored private file patterns include:

```text
private/
*.questions.local.json
questions.local.json
src/questions.local.json
public/questions.local.json
```

## Adding more questions locally

Use this schema:

```js
{
  "questions": [
    {
      "id": "q021",
      "module": "Module Name",
      "difficulty": "Core",
      "diagnosis": "Short diagnosis label",
      "stem": "Brief vignette or direct question.",
      "variables": [
        ["Variable A", "up"],
        ["Variable B", "down"],
        ["Variable C", "same"]
      ],
      "rule": "One-sentence rule.",
      "why": "Mechanism in your own words.",
      "trap": "Common wrong assumption."
    }
  ]
}
```

Allowed arrow values:

```js
"up"
"down"
"same"
```
