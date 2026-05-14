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

## Per-variable arrow tracking

Practice mode tracks both full-card accuracy and individual variable accuracy.

Example: if a card has five arrows and you miss only `CO2`, the card is marked as not fully correct, but the app also records that the specific `CO2` variable was missed.

The Practice sidebar shows variable history for the current card:

```text
CO2: 2/4 correct · 2 wrong
ACTH: 3/3 correct · 0 wrong
```

The Dashboard shows the most missed variables across modules so you can identify patterns like:

- CO2 compensation mistakes
- ACTH feedback mistakes
- urine osmolality mistakes
- radioiodine uptake mistakes
- potassium exceptions

## Weak card graduation

Weak mode behaves like a queue.

- A card enters weak mode after any missed arrow.
- A weak card graduates to `good for now` after the whole card is answered correctly.
- When no weak cards remain, the app shows an empty-state message instead of forcing a random fallback question.

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
