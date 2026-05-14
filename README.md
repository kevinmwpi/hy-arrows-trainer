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

## Adding more questions

Open `src/App.jsx` and add more objects to the `QUESTIONS` array.

Use this schema:

```js
{
  id: 21,
  module: "Module Name",
  difficulty: "Core",
  diagnosis: "Short diagnosis label",
  stem: "Brief vignette or direct question.",
  variables: [
    ["Variable A", "up"],
    ["Variable B", "down"],
    ["Variable C", "same"]
  ],
  rule: "One-sentence rule.",
  why: "Mechanism in your own words.",
  trap: "Common wrong assumption."
}
```

Allowed arrow values:

```js
"up"
"down"
"same"
```
