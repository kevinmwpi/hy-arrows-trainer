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

## Recommended study flow

1. Use **Mechanism** mode first.
2. Type the diagnosis, initial driver, mechanism, final arrows, and trap from memory.
3. Reveal expected reasoning and self-grade as `Got it`, `Partial`, or `Missed`.
4. Use **Practice** mode to select exact arrows.
5. Review **Dashboard** to see the variables you miss most often.
6. Use `Weak cards or variables` mode to target either fully missed cards or specific variable-level weaknesses.

## Per-variable mistake tracking

The app now tracks each arrow variable separately. A card can be mostly correct while still exposing a repeated weakness, such as `CO2`, `urine osmolality`, `ACTH`, or `radioiodine uptake`.

The dashboard shows:

- global full-card accuracy
- module mastery
- most missed variables
- mechanism-first self-grades

## Mechanism-first mode

Mechanism mode forces the reasoning chain before arrow selection:

```text
vignette → diagnosis/state → driver → mechanism/compensation → arrows → trap
```

This mode is self-graded because the app is fully local and does not use an AI grader.

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
