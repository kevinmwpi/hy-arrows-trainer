import React, { useEffect, useMemo, useState } from "react";

const ARROWS = [
  { key: "up", label: "↑", name: "Up" },
  { key: "down", label: "↓", name: "Down" },
  { key: "same", label: "↔", name: "No change" },
];

const STARTER_QUESTIONS = [
  {
    id: 1,
    module: "RAAS / Aldosterone",
    difficulty: "Core",
    diagnosis: "High aldosterone",
    stem: "A patient has high aldosterone. Predict serum Na+, K+, pH, bicarbonate, and CO2.",
    variables: [["Na+", "up"], ["K+", "down"], ["pH", "up"], ["HCO3-", "up"], ["CO2", "up"]],
    rule: "All listed arrows move with aldosterone except potassium, which moves opposite.",
    why: "Aldosterone increases sodium reabsorption and potassium/proton secretion. Proton loss causes metabolic alkalosis, and CO2 rises as respiratory compensation.",
    trap: "Potassium is the exception to the aldosterone direction rule."
  },
  {
    id: 2,
    module: "RAAS / Aldosterone",
    difficulty: "Core",
    diagnosis: "Low aldosterone",
    stem: "A patient has low aldosterone. Predict serum Na+, K+, pH, bicarbonate, and CO2.",
    variables: [["Na+", "down"], ["K+", "up"], ["pH", "down"], ["HCO3-", "down"], ["CO2", "down"]],
    rule: "Low aldosterone reverses the high-aldosterone pattern.",
    why: "Less aldosterone means less sodium reabsorption and less potassium/proton secretion. Retained protons cause metabolic acidosis, and CO2 falls as compensation.",
    trap: "Low aldosterone causes normal-anion-gap metabolic acidosis."
  },
  {
    id: 3,
    module: "RAAS / Drugs",
    difficulty: "Core",
    diagnosis: "ACE inhibitor",
    stem: "A patient starts lisinopril. Predict renin, angiotensin I, angiotensin II, and aldosterone.",
    variables: [["Renin", "up"], ["Angiotensin I", "up"], ["Angiotensin II", "down"], ["Aldosterone", "down"]],
    rule: "ACE inhibitors block Ang I to Ang II, so left-side substrates rise and right-side products fall.",
    why: "Lower Ang II lowers aldosterone and effective volume, so renin rises and creates more Ang I.",
    trap: "ACE inhibitors lower Ang II synthesis; ARBs do not."
  },
  {
    id: 4,
    module: "RAAS / Drugs",
    difficulty: "Core",
    diagnosis: "ARB",
    stem: "A patient starts valsartan. Predict renin, angiotensin I, angiotensin II, and aldosterone.",
    variables: [["Renin", "up"], ["Angiotensin I", "up"], ["Angiotensin II", "up"], ["Aldosterone", "down"]],
    rule: "ARBs block the receptor, not Ang II production.",
    why: "Receptor blockade lowers aldosterone effect. Renin rises, increasing Ang I and Ang II.",
    trap: "Do not treat ARBs like ACE inhibitors. Ang II rises with ARBs."
  },
  {
    id: 5,
    module: "Adrenal Insufficiency",
    difficulty: "Core",
    diagnosis: "Primary adrenal insufficiency",
    stem: "Fatigue, hypotension, hyperpigmentation, and eosinophilia. Predict Na+, K+, pH, bicarbonate, CO2, and ACTH.",
    variables: [["Na+", "down"], ["K+", "up"], ["pH", "down"], ["HCO3-", "down"], ["CO2", "down"], ["ACTH", "up"]],
    rule: "Primary adrenal failure lowers aldosterone and cortisol; ACTH rises.",
    why: "Low aldosterone causes hyponatremia, hyperkalemia, and metabolic acidosis. Low cortisol removes negative feedback, raising ACTH.",
    trap: "Hyperpigmentation means high ACTH from primary, not secondary, adrenal failure."
  },
  {
    id: 6,
    module: "Adrenal / Cushing",
    difficulty: "Core",
    diagnosis: "Exogenous glucocorticoids",
    stem: "A rheumatoid arthritis patient takes chronic prednisone and appears Cushingoid. Predict ACTH and endogenous cortisol.",
    variables: [["ACTH", "down"], ["Endogenous cortisol", "down"]],
    rule: "Prednisone suppresses ACTH, but it is not measured as endogenous cortisol.",
    why: "Exogenous glucocorticoid creates negative feedback. Low ACTH under-stimulates the adrenal cortex, lowering endogenous cortisol.",
    trap: "Cushingoid appearance does not automatically mean measured cortisol is high."
  },
  {
    id: 7,
    module: "ADH / Water Balance",
    difficulty: "Core",
    diagnosis: "High ADH",
    stem: "ADH is elevated. Predict serum sodium, urine osmolality, and urine specific gravity.",
    variables: [["Serum Na+", "down"], ["Urine osmolality", "up"], ["Urine specific gravity", "up"]],
    rule: "ADH dilutes serum and concentrates urine.",
    why: "ADH inserts aquaporins, increasing free-water reabsorption.",
    trap: "High urine specific gravity means concentrated urine."
  },
  {
    id: 8,
    module: "ADH / Water Balance",
    difficulty: "Core",
    diagnosis: "Central diabetes insipidus",
    stem: "Head trauma followed by very high urine output. Predict serum sodium, urine osmolality, and urine specific gravity.",
    variables: [["Serum Na+", "up"], ["Urine osmolality", "down"], ["Urine specific gravity", "down"]],
    rule: "Central DI is a low-ADH-effect state with dilute urine.",
    why: "Low ADH prevents collecting-duct water reabsorption. Serum concentrates and urine dilutes.",
    trap: "Head trauma can also cause SIADH; massive urine output points to DI."
  },
  {
    id: 9,
    module: "ADH / Water Balance",
    difficulty: "Core",
    diagnosis: "Psychogenic polydipsia",
    stem: "Psychotic symptoms with compulsive water drinking. Predict serum sodium, urine osmolality, and urine specific gravity.",
    variables: [["Serum Na+", "down"], ["Urine osmolality", "down"], ["Urine specific gravity", "down"]],
    rule: "Too much water lowers serum sodium and appropriately suppresses ADH.",
    why: "The kidney tries to excrete excess free water, producing dilute urine.",
    trap: "Low sodium does not always mean SIADH. Urine concentration distinguishes them."
  },
  {
    id: 10,
    module: "Thyroid Basics",
    difficulty: "Core",
    diagnosis: "Primary hyperthyroidism",
    stem: "Predict TSH, T3, and T4 in primary hyperthyroidism.",
    variables: [["TSH", "down"], ["T3", "up"], ["T4", "up"]],
    rule: "Primary gland overproduction raises thyroid hormone and suppresses TSH.",
    why: "High thyroid hormone creates negative feedback at the pituitary.",
    trap: "Secondary hyperthyroidism has high TSH too."
  },
  {
    id: 11,
    module: "Thyroid Basics",
    difficulty: "Core",
    diagnosis: "Primary hypothyroidism",
    stem: "Predict TSH, T3, and T4 in primary hypothyroidism.",
    variables: [["TSH", "up"], ["T3", "down"], ["T4", "down"]],
    rule: "Primary gland failure lowers thyroid hormone and raises TSH.",
    why: "Low T3/T4 removes negative feedback, so pituitary TSH rises.",
    trap: "Secondary hypothyroidism has low TSH."
  },
  {
    id: 12,
    module: "Thyroid / Uptake",
    difficulty: "Core",
    diagnosis: "Graves disease",
    stem: "Exophthalmos, tremor, and autoimmune background. Predict TSH, T3, T4, and radioiodine uptake.",
    variables: [["TSH", "down"], ["T3", "up"], ["T4", "up"], ["Radioiodine uptake", "up"]],
    rule: "Graves has high thyroid hormone with high uptake.",
    why: "TSI activates the TSH receptor. TSH is low from feedback, but the gland is still stimulated.",
    trap: "Low TSH does not mean low uptake if the gland is antibody-stimulated."
  },
  {
    id: 13,
    module: "Thyroid / Uptake",
    difficulty: "Core",
    diagnosis: "Subacute thyroiditis",
    stem: "Tender thyroid with tremor and heat intolerance. Predict TSH, T3, T4, and radioiodine uptake.",
    variables: [["TSH", "down"], ["T3", "up"], ["T4", "up"], ["Radioiodine uptake", "down"]],
    rule: "Thyroiditis can look hyperthyroid, but uptake is low.",
    why: "Inflammation releases preformed hormone. The gland is not actively increasing synthesis.",
    trap: "Tender thyroid is subacute thyroiditis, not Graves."
  },
  {
    id: 14,
    module: "Thyroid / Uptake",
    difficulty: "Hard",
    diagnosis: "Factitious T3",
    stem: "A patient secretly injects T3. Predict TSH, T3, T4, and radioiodine uptake.",
    variables: [["TSH", "down"], ["T3", "up"], ["T4", "down"], ["Radioiodine uptake", "down"]],
    rule: "Injected T3 suppresses the gland; T3 does not convert back to T4.",
    why: "High T3 suppresses TSH. The thyroid makes less T4 and takes up less iodine.",
    trap: "T4 converts to T3; T3 does not convert to T4."
  },
  {
    id: 15,
    module: "Thyroid Binding / Sick Euthyroid",
    difficulty: "Hard",
    diagnosis: "Euthyroid sick syndrome",
    stem: "Critically ill patient recovering from ARDS is being weaned from a ventilator. Predict TSH, T4, T3, and reverse T3.",
    variables: [["TSH", "same"], ["T4", "same"], ["T3", "down"], ["Reverse T3", "up"]],
    rule: "Severe illness reduces T4 to T3 conversion and increases reverse T3.",
    why: "The thyroid axis is not truly failing. Stress physiology shifts peripheral metabolism away from active T3.",
    trap: "Do not confuse this with subclinical hypothyroidism."
  },
  {
    id: 16,
    module: "Calcium / PTH",
    difficulty: "Core",
    diagnosis: "Primary hyperparathyroidism",
    stem: "Predict calcium, phosphate, and PTH in primary hyperparathyroidism.",
    variables: [["Ca2+", "up"], ["PO4^3-", "down"], ["PTH", "up"]],
    rule: "PTH raises calcium and wastes phosphate.",
    why: "PTH increases bone resorption, renal calcium reabsorption, and vitamin D activation while decreasing proximal tubular phosphate reabsorption.",
    trap: "Vitamin D raises both calcium and phosphate; PTH raises calcium but lowers phosphate."
  }
];

const LESSONS = [
  {
    title: "Convert the disease into a hormone state",
    body: "Most misses happen before the arrows. First decide whether aldosterone, cortisol, ADH, TSH, PTH, or thyroid hormone effect is high or low.",
    example: "Fibromuscular dysplasia → low renal perfusion → high renin → high aldosterone → high Na+, low K+, metabolic alkalosis."
  },
  {
    title: "Separate hormone level from hormone effect",
    body: "Nephrogenic DI has high ADH level but low ADH effect. Spironolactone can raise aldosterone level while blocking aldosterone effect.",
    example: "Lithium nephrogenic DI → high serum Na+, dilute urine, high ADH level, low collecting-duct response."
  },
  {
    title: "For thyroid uptake, ask whether the gland is producing hormone",
    body: "High serum T3/T4 can come from true production, leakage, or ingestion. Uptake is high only when the gland is actively making hormone.",
    example: "Graves → high uptake. Thyroiditis or factitious thyroid hormone → low uptake."
  },
  {
    title: "Add acid-base compensation last",
    body: "Aldosterone affects H+ secretion. High aldosterone causes metabolic alkalosis, so CO2 rises. Low aldosterone causes metabolic acidosis, so CO2 falls.",
    example: "Addison → low aldosterone → low HCO3-/pH → compensatory low CO2."
  }
];

function normalizeStats(raw) {
  const base = {
    attempts: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    byId: {},
    byVariable: {},
    mechanism: { attempts: 0, got: 0, partial: 0, missed: 0 }
  };
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...base,
      ...parsed,
      byId: parsed.byId || {},
      byVariable: parsed.byVariable || {},
      mechanism: { ...base.mechanism, ...(parsed.mechanism || {}) }
    };
  } catch {
    return base;
  }
}

function normalizeQuestion(question, index) {
  return {
    id: question.id ?? `imported-${index + 1}`,
    module: question.module || "Imported",
    difficulty: question.difficulty || "Core",
    diagnosis: question.diagnosis || `Imported card ${index + 1}`,
    stem: question.stem || question.question || "",
    variables: Array.isArray(question.variables) ? question.variables : [],
    rule: question.rule || "",
    why: question.why || question.explanation || "",
    trap: question.trap || "",
  };
}

function validateQuestionBank(value) {
  const list = Array.isArray(value) ? value : value?.questions;
  if (!Array.isArray(list)) throw new Error("JSON must be an array or an object with a questions array.");

  const normalized = list.map(normalizeQuestion);
  const invalid = normalized.find((q) => !q.stem || !Array.isArray(q.variables) || q.variables.length === 0);
  if (invalid) throw new Error("Every question needs a stem and at least one variable.");

  for (const q of normalized) {
    for (const variable of q.variables) {
      if (!Array.isArray(variable) || variable.length !== 2) throw new Error("Each variable must look like [\"Name\", \"up|down|same\"].");
      if (!ARROWS.some((a) => a.key === variable[1])) throw new Error("Arrow values must be up, down, or same.");
    }
  }

  return normalized;
}

function arrowLabel(value) {
  return ARROWS.find((a) => a.key === value)?.label ?? "?";
}

function getQuestionId(question) {
  return String(question.id);
}

function getVariableKey(question, variableName) {
  return `${question.module}::${variableName}`;
}

function getArrowPattern(question) {
  return question.variables.map(([name, value]) => `${name} ${arrowLabel(value)}`).join(" · ");
}

function getMechanismPrompts(question) {
  return [
    {
      key: "diagnosis",
      label: "1. Diagnosis or physiologic state",
      prompt: "What condition or physiologic state is the vignette testing?",
      expected: question.diagnosis
    },
    {
      key: "driver",
      label: "2. Initial driver",
      prompt: "What hormone, receptor effect, organ system, or feedback loop changes first?",
      expected: question.rule || "Use the core rule for this card."
    },
    {
      key: "mechanism",
      label: "3. Mechanism and compensation",
      prompt: "Why do the downstream arrows move that way? Include feedback or compensation if relevant.",
      expected: question.why || "No mechanism note provided for this card."
    },
    {
      key: "arrows",
      label: "4. Final arrow pattern",
      prompt: "Predict the final arrows before using arrow buttons.",
      expected: getArrowPattern(question)
    },
    {
      key: "trap",
      label: "5. Trap check",
      prompt: "What common wrong assumption would make you miss this?",
      expected: question.trap || "No trap note provided for this card."
    }
  ];
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("practice");
  const [module, setModule] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [mode, setMode] = useState("all");
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [mechanismAnswers, setMechanismAnswers] = useState({});
  const [mechanismRevealed, setMechanismRevealed] = useState(false);
  const [mechanismGrade, setMechanismGrade] = useState(null);
  const [stats, setStats] = useState(() => normalizeStats(localStorage.getItem("hy-arrows-stats")));
  const [importedQuestions, setImportedQuestions] = useState(() => {
    try {
      const raw = localStorage.getItem("hy-arrows-imported-questions");
      return raw ? validateQuestionBank(JSON.parse(raw)) : [];
    } catch {
      return [];
    }
  });
  const [importStatus, setImportStatus] = useState("");

  const questions = useMemo(() => [...STARTER_QUESTIONS, ...importedQuestions], [importedQuestions]);

  useEffect(() => {
    localStorage.setItem("hy-arrows-stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("hy-arrows-imported-questions", JSON.stringify(importedQuestions));
  }, [importedQuestions]);

  const modules = useMemo(() => ["All", ...Array.from(new Set(questions.map((q) => q.module)))], [questions]);
  const difficulties = ["All", "Core", "Medium", "Hard"];

  const filtered = useMemo(() => {
    const textQuery = query.trim().toLowerCase();
    let pool = questions.filter((q) => {
      const matchesModule = module === "All" || q.module === module;
      const matchesDifficulty = difficulty === "All" || q.difficulty === difficulty;
      const searchText = `${q.module} ${q.diagnosis} ${q.stem} ${q.rule}`.toLowerCase();
      const matchesQuery = !textQuery || searchText.includes(textQuery);
      return matchesModule && matchesDifficulty && matchesQuery;
    });

    if (mode === "weak") {
      pool = pool.filter((q) => {
        const item = stats.byId[getQuestionId(q)];
        const cardWeak = item && item.wrong > 0 && item.wrong >= item.correct;
        const variableWeak = q.variables.some(([name]) => {
          const variable = item?.variables?.[name];
          return variable && variable.wrong > 0 && variable.wrong >= variable.correct;
        });
        return cardWeak || variableWeak;
      });
    }

    if (mode === "unseen") {
      pool = pool.filter((q) => !stats.byId[getQuestionId(q)]?.attempts);
    }

    return pool.length ? pool : questions;
  }, [module, difficulty, mode, query, stats.byId, questions]);

  const safeFiltered = filtered.length ? filtered : questions;
  const current = safeFiltered[index % safeFiltered.length];
  const currentId = getQuestionId(current);
  const allAnswered = current.variables.every(([name]) => answers[name]);
  const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0;
  const mechanismPrompts = getMechanismPrompts(current);
  const mechanismCompletion = mechanismPrompts.filter((prompt) => mechanismAnswers[prompt.key]?.trim()).length;
  const variableStats = Object.values(stats.byVariable || {})
    .map((item) => ({ ...item, accuracy: item.attempts ? Math.round((item.correct / item.attempts) * 100) : 0 }))
    .sort((a, b) => b.wrong - a.wrong || a.accuracy - b.accuracy || b.attempts - a.attempts);
  const currentVariableHistory = current.variables.map(([name]) => {
    const cardVariable = stats.byId[currentId]?.variables?.[name];
    return { name, attempts: cardVariable?.attempts || 0, correct: cardVariable?.correct || 0, wrong: cardVariable?.wrong || 0 };
  });

  const moduleStats = useMemo(() => {
    return modules
      .filter((m) => m !== "All")
      .map((m) => {
        const qs = questions.filter((q) => q.module === m);
        const attempts = qs.reduce((sum, q) => sum + (stats.byId[getQuestionId(q)]?.attempts || 0), 0);
        const correct = qs.reduce((sum, q) => sum + (stats.byId[getQuestionId(q)]?.correct || 0), 0);
        return { module: m, attempts, correct, pct: attempts ? Math.round((correct / attempts) * 100) : 0, total: qs.length };
      })
      .sort((a, b) => a.pct - b.pct || b.attempts - a.attempts);
  }, [modules, stats.byId, questions]);

  function resetQuestion(newIndex = index) {
    setIndex((newIndex + safeFiltered.length) % safeFiltered.length);
    setAnswers({});
    setChecked(false);
    setRevealed(false);
    setMechanismAnswers({});
    setMechanismRevealed(false);
    setMechanismGrade(null);
  }

  function checkAnswer() {
    if (!allAnswered || checked) return;
    const variableResults = current.variables.map(([name, correct]) => ({ name, correct, selected: answers[name], isCorrect: answers[name] === correct }));
    const isCorrect = variableResults.every((item) => item.isCorrect);
    setChecked(true);

    setStats((prev) => {
      const prior = prev.byId[currentId] || { attempts: 0, correct: 0, wrong: 0, variables: {} };
      const nextVariablesForCard = { ...(prior.variables || {}) };
      const nextByVariable = { ...(prev.byVariable || {}) };

      for (const result of variableResults) {
        const existingCardVariable = nextVariablesForCard[result.name] || { attempts: 0, correct: 0, wrong: 0 };
        nextVariablesForCard[result.name] = {
          attempts: existingCardVariable.attempts + 1,
          correct: existingCardVariable.correct + (result.isCorrect ? 1 : 0),
          wrong: existingCardVariable.wrong + (result.isCorrect ? 0 : 1),
          last: result.isCorrect ? "correct" : "wrong"
        };

        const variableKey = getVariableKey(current, result.name);
        const existingGlobalVariable = nextByVariable[variableKey] || {
          module: current.module,
          name: result.name,
          attempts: 0,
          correct: 0,
          wrong: 0
        };
        nextByVariable[variableKey] = {
          ...existingGlobalVariable,
          attempts: existingGlobalVariable.attempts + 1,
          correct: existingGlobalVariable.correct + (result.isCorrect ? 1 : 0),
          wrong: existingGlobalVariable.wrong + (result.isCorrect ? 0 : 1),
          lastQuestion: current.diagnosis
        };
      }

      const streak = isCorrect ? prev.streak + 1 : 0;
      return {
        ...prev,
        attempts: prev.attempts + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        streak,
        bestStreak: Math.max(prev.bestStreak || 0, streak),
        byVariable: nextByVariable,
        byId: {
          ...prev.byId,
          [currentId]: {
            ...prior,
            attempts: prior.attempts + 1,
            correct: prior.correct + (isCorrect ? 1 : 0),
            wrong: prior.wrong + (isCorrect ? 0 : 1),
            variables: nextVariablesForCard,
            last: isCorrect ? "correct" : "wrong"
          },
        },
      };
    });
  }

  function gradeMechanism(grade) {
    if (mechanismGrade) return;
    setMechanismGrade(grade);
    setStats((prev) => {
      const prior = prev.byId[currentId] || { attempts: 0, correct: 0, wrong: 0, variables: {} };
      const priorMechanism = prior.mechanism || { attempts: 0, got: 0, partial: 0, missed: 0 };
      return {
        ...prev,
        mechanism: {
          attempts: (prev.mechanism?.attempts || 0) + 1,
          got: (prev.mechanism?.got || 0) + (grade === "got" ? 1 : 0),
          partial: (prev.mechanism?.partial || 0) + (grade === "partial" ? 1 : 0),
          missed: (prev.mechanism?.missed || 0) + (grade === "missed" ? 1 : 0),
        },
        byId: {
          ...prev.byId,
          [currentId]: {
            ...prior,
            mechanism: {
              attempts: priorMechanism.attempts + 1,
              got: priorMechanism.got + (grade === "got" ? 1 : 0),
              partial: priorMechanism.partial + (grade === "partial" ? 1 : 0),
              missed: priorMechanism.missed + (grade === "missed" ? 1 : 0),
              last: grade
            }
          }
        }
      };
    });
  }

  function resetStats() {
    setStats(normalizeStats(null));
    resetQuestion(0);
  }

  async function importQuestionBank(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const normalized = validateQuestionBank(parsed);
      setImportedQuestions(normalized);
      setImportStatus(`Imported ${normalized.length} private cards from ${file.name}.`);
      setModule("All");
      setMode("all");
      resetQuestion(0);
    } catch (error) {
      setImportStatus(`Import failed: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  }

  function clearImportedQuestions() {
    setImportedQuestions([]);
    localStorage.removeItem("hy-arrows-imported-questions");
    setImportStatus("Cleared imported private cards.");
    resetQuestion(0);
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="eyebrow">HY Arrows Trainer</div>
          <h1>Learn the arrow logic, not just the answer key.</h1>
          <p>Practice arrows, type the mechanism first, and track exactly which variables you miss most often.</p>
        </div>
        <div className="hero-stats">
          <StatCard label="Total cards" value={questions.length} />
          <StatCard label="Imported" value={importedQuestions.length} />
          <StatCard label="Accuracy" value={`${accuracy}%`} />
        </div>
      </header>

      <nav className="tabs">
        {["practice", "mechanism", "learn", "flashcards", "dashboard", "import", "builder"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item[0].toUpperCase() + item.slice(1)}</button>
        ))}
      </nav>

      <section className="filters">
        <label>Module<select value={module} onChange={(e) => { setModule(e.target.value); resetQuestion(0); }}>{modules.map((m) => <option key={m}>{m}</option>)}</select></label>
        <label>Difficulty<select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); resetQuestion(0); }}>{difficulties.map((d) => <option key={d}>{d}</option>)}</select></label>
        <label>Mode<select value={mode} onChange={(e) => { setMode(e.target.value); resetQuestion(0); }}><option value="all">All matching</option><option value="weak">Weak cards or variables</option><option value="unseen">Unseen</option></select></label>
        <label>Search<input value={query} onChange={(e) => { setQuery(e.target.value); resetQuestion(0); }} placeholder="ADH, Cushing, uptake..." /></label>
      </section>

      {tab === "practice" && (
        <main className="practice-grid">
          <section className="card">
            <div className="card-header">
              <div><div className="muted">Question {index % safeFiltered.length + 1} of {safeFiltered.length}</div><h2>{current.diagnosis}</h2></div>
              <div className="badges"><span>{current.module}</span><span>{current.difficulty}</span></div>
            </div>
            <div className="stem">{current.stem}</div>
            <div className="variables">
              {current.variables.map(([name, correct]) => (
                <div key={name} className="variable-card">
                  <div className="variable-title"><strong>{name}</strong>{checked && <span>Correct: {arrowLabel(correct)}</span>}</div>
                  <div className="arrow-buttons">
                    {ARROWS.map((arrow) => {
                      const chosen = answers[name] === arrow.key;
                      const right = checked && correct === arrow.key;
                      const wrong = checked && chosen && correct !== arrow.key;
                      return <button key={arrow.key} className={[chosen && !checked ? "chosen" : "", right ? "right" : "", wrong ? "wrong" : ""].filter(Boolean).join(" ")} disabled={checked} onClick={() => setAnswers((prev) => ({ ...prev, [name]: arrow.key }))}>{arrow.label}</button>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="actions"><button className="primary" disabled={!allAnswered || checked} onClick={checkAnswer}>Check answer</button><button onClick={() => resetQuestion(index + 1)}>Next</button><button onClick={() => resetQuestion(index - 1)}>Previous</button></div>
            {checked && <div className="explanation"><div><strong>Rule:</strong> {current.rule}</div><div><strong>Mechanism:</strong> {current.why}</div><div><strong>Trap:</strong> {current.trap}</div></div>}
          </section>
          <aside className="side">
            <StatCard label="Attempts" value={stats.attempts || 0} sub={`${stats.correct || 0} fully correct`} />
            <StatCard label="Best streak" value={stats.bestStreak || 0} />
            <div className="card small"><h3>Variable history for this card</h3>{currentVariableHistory.map((item) => <div key={item.name} className="key-row"><span>{item.name}</span><strong>{item.correct}/{item.attempts} · {item.wrong} wrong</strong></div>)}</div>
            <div className="card small"><h3>Hidden answer key</h3>{current.variables.map(([name, answer]) => <div key={name} className="key-row"><span>{name}</span><strong>{checked ? arrowLabel(answer) : "hidden"}</strong></div>)}</div>
          </aside>
        </main>
      )}

      {tab === "mechanism" && (
        <main className="practice-grid">
          <section className="card">
            <div className="card-header">
              <div><div className="muted">Mechanism-first card {index % safeFiltered.length + 1} of {safeFiltered.length}</div><h2>{current.diagnosis}</h2></div>
              <div className="badges"><span>{current.module}</span><span>{current.difficulty}</span></div>
            </div>
            <div className="stem">{current.stem}</div>
            <div className="mechanism-prompts">
              {mechanismPrompts.map((prompt) => (
                <label key={prompt.key} className="mechanism-prompt">
                  <span>{prompt.label}</span>
                  <small>{prompt.prompt}</small>
                  <textarea value={mechanismAnswers[prompt.key] || ""} onChange={(e) => setMechanismAnswers((prev) => ({ ...prev, [prompt.key]: e.target.value }))} placeholder="Type your reasoning before revealing the expected answer." />
                  {mechanismRevealed && <div className="expected"><strong>Expected:</strong> {prompt.expected}</div>}
                </label>
              ))}
            </div>
            <div className="actions"><button className="primary" onClick={() => setMechanismRevealed(true)}>Reveal expected reasoning</button><button onClick={() => resetQuestion(index + 1)}>Next</button></div>
            {mechanismRevealed && (
              <div className="explanation">
                <div><strong>Self-grade the mechanism, not the arrows:</strong></div>
                <div className="grade-buttons"><button disabled={!!mechanismGrade} onClick={() => gradeMechanism("got")}>Got it</button><button disabled={!!mechanismGrade} onClick={() => gradeMechanism("partial")}>Partial</button><button disabled={!!mechanismGrade} onClick={() => gradeMechanism("missed")}>Missed</button></div>
                {mechanismGrade && <div className="pill">Recorded as: {mechanismGrade}</div>}
              </div>
            )}
          </section>
          <aside className="side">
            <StatCard label="Mechanism attempts" value={stats.mechanism?.attempts || 0} sub={`${stats.mechanism?.got || 0} got · ${stats.mechanism?.partial || 0} partial · ${stats.mechanism?.missed || 0} missed`} />
            <StatCard label="Prompts filled" value={`${mechanismCompletion}/${mechanismPrompts.length}`} />
            <div className="card small"><h3>Final arrows</h3>{current.variables.map(([name, answer]) => <div key={name} className="key-row"><span>{name}</span><strong>{mechanismRevealed ? arrowLabel(answer) : "hidden"}</strong></div>)}</div>
          </aside>
        </main>
      )}

      {tab === "learn" && <main className="lesson-grid">{LESSONS.map((lesson, i) => <section className="card" key={lesson.title}><div className="lesson-num">{i + 1}</div><h2>{lesson.title}</h2><p>{lesson.body}</p><div className="example"><strong>Example:</strong> {lesson.example}</div></section>)}</main>}

      {tab === "flashcards" && <main className="card flashcard"><div className="muted">Flashcard {index % safeFiltered.length + 1} of {safeFiltered.length}</div><h2>{current.diagnosis}</h2><div className="stem">{current.stem}</div>{revealed && <div className="flash-answer">{current.variables.map(([name, answer]) => <div className="key-row" key={name}><span>{name}</span><strong>{arrowLabel(answer)}</strong></div>)}<div className="example"><strong>Rule:</strong> {current.rule}</div></div>}<div className="actions"><button className="primary" onClick={() => setRevealed((x) => !x)}>{revealed ? "Hide" : "Reveal"}</button><button onClick={() => resetQuestion(index + 1)}>Next</button></div></main>}

      {tab === "dashboard" && <main className="dashboard"><section className="stat-grid"><StatCard label="Attempts" value={stats.attempts || 0} /><StatCard label="Fully correct" value={stats.correct || 0} /><StatCard label="Accuracy" value={`${accuracy}%`} /><StatCard label="Mechanism attempts" value={stats.mechanism?.attempts || 0} /></section><section className="card"><div className="card-header"><h2>Module mastery</h2><button onClick={resetStats}>Reset stats</button></div>{moduleStats.map((m) => <div key={m.module} className="mastery"><div><strong>{m.module}</strong><span>{m.pct}% · {m.attempts} attempts · {m.total} cards</span></div><div className="bar"><div style={{ width: `${m.pct}%` }} /></div></div>)}</section><section className="card"><h2>Most missed variables</h2><p className="muted">This catches partial misses that full-card accuracy hides.</p><div className="table-list">{variableStats.slice(0, 12).map((item) => <div key={`${item.module}-${item.name}`} className="variable-stat-row"><div><strong>{item.name}</strong><span>{item.module}</span></div><div>{item.correct}/{item.attempts} correct</div><div>{item.wrong} wrong</div><div>{item.accuracy}%</div></div>)}{variableStats.length === 0 && <div className="muted">No variable-level attempts recorded yet.</div>}</div></section><section className="card"><h2>Mechanism-first performance</h2><div className="grade-summary"><StatCard label="Got it" value={stats.mechanism?.got || 0} /><StatCard label="Partial" value={stats.mechanism?.partial || 0} /><StatCard label="Missed" value={stats.mechanism?.missed || 0} /></div></section></main>}

      {tab === "import" && <main className="card"><h2>Import a private question bank</h2><p>This loads cards from a JSON file into your browser local storage. The imported cards are not committed to GitHub and are not uploaded anywhere by the app.</p><div className="import-box"><input type="file" accept="application/json,.json" onChange={importQuestionBank} /><button onClick={clearImportedQuestions}>Clear imported cards</button></div>{importStatus && <div className="example">{importStatus}</div>}<h3>Expected JSON shape</h3><pre>{`{
  "questions": [
    {
      "id": "q017",
      "module": "Adrenal / Cushing",
      "difficulty": "Medium",
      "diagnosis": "Pituitary Cushing disease",
      "stem": "Paraphrased vignette or direct prompt.",
      "variables": [["ACTH", "down"], ["Cortisol", "down"]],
      "rule": "One-sentence rule.",
      "why": "Mechanism in your own words.",
      "trap": "Common wrong assumption."
    }
  ]
}`}</pre></main>}

      {tab === "builder" && <main className="card"><h2>Add more cards</h2><p>Convert each remaining arrow question into this compact schema. Mechanism-first mode uses diagnosis, rule, why, trap, and variables, so fill those fields carefully.</p><pre>{`{
  id: "q017",
  module: "Module Name",
  difficulty: "Core",
  diagnosis: "Short diagnosis",
  stem: "Question or vignette.",
  variables: [["Variable A", "up"], ["Variable B", "down"], ["Variable C", "same"]],
  rule: "One-sentence rule.",
  why: "Mechanism in your own words.",
  trap: "Common wrong assumption."
}`}</pre></main>}
    </div>
  );
}
