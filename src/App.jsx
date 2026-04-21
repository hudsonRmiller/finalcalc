import { useState, useEffect, useRef } from "react";

const GRADE_THRESHOLDS = [
  { letter: "A+", min: 97, color: "#22c55e" },
  { letter: "A", min: 93, color: "#22c55e" },
  { letter: "A-", min: 90, color: "#4ade80" },
  { letter: "B+", min: 87, color: "#a3e635" },
  { letter: "B", min: 83, color: "#facc15" },
  { letter: "B-", min: 80, color: "#fbbf24" },
  { letter: "C+", min: 77, color: "#fb923c" },
  { letter: "C", min: 73, color: "#f97316" },
  { letter: "C-", min: 70, color: "#ef4444" },
  { letter: "D+", min: 67, color: "#dc2626" },
  { letter: "D", min: 63, color: "#b91c1c" },
  { letter: "D-", min: 60, color: "#991b1b" },
  { letter: "F", min: 0, color: "#7f1d1d" },
];

function getLetterGrade(pct) {
  for (const g of GRADE_THRESHOLDS) if (pct >= g.min) return g;
  return GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1];
}

function AnimatedNumber({ value, suffix = "", prefix = "", color }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(start + (end - start) * ease);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prev.current = value;
  }, [value]);
  return (
    <span style={{ color: color || "inherit", fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {display === Infinity || display === -Infinity ? "∞" : display.toFixed(1)}
      {suffix}
    </span>
  );
}

/* AdSense ad slot component — renders once AdSense is loaded */
function AdSlot({ style = {}, slot = "AUTO", format = "auto" }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }, []);
  return (
    <div style={{ textAlign: "center", margin: "20px 0", ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default function App() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Homework", weight: 20, earned: 92 },
    { id: 2, name: "Midterm 1", weight: 20, earned: 85 },
    { id: 3, name: "Midterm 2", weight: 20, earned: 78 },
  ]);
  const [finalWeight, setFinalWeight] = useState(40);
  const [desiredGrade, setDesiredGrade] = useState(90);
  const [nextId, setNextId] = useState(4);
  const [showScenarios, setShowScenarios] = useState(false);

  const totalCatWeight = categories.reduce((s, c) => s + (c.weight || 0), 0);
  const totalWeight = totalCatWeight + (finalWeight || 0);
  const weightError = Math.abs(totalWeight - 100) > 0.01;
  const currentWeightedSum = categories.reduce(
    (s, c) => s + (c.earned || 0) * ((c.weight || 0) / 100), 0
  );
  const currentGradeSoFar = totalCatWeight > 0 ? (currentWeightedSum / totalCatWeight) * 100 : 0;
  const neededOnFinal = finalWeight > 0 ? ((desiredGrade - currentWeightedSum) / finalWeight) * 100 : Infinity;
  const gradeIfAce = currentWeightedSum + (finalWeight || 0);
  const gradeIfSkip = totalCatWeight > 0 ? currentWeightedSum : 0;
  const currentLetterGrade = getLetterGrade(currentGradeSoFar);
  const desiredLetterGrade = getLetterGrade(desiredGrade);

  const addCategory = () => {
    setCategories([...categories, { id: nextId, name: "", weight: 0, earned: 0 }]);
    setNextId(nextId + 1);
  };
  const removeCategory = (id) => {
    if (categories.length > 1) setCategories(categories.filter((c) => c.id !== id));
  };
  const updateCategory = (id, field, value) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const parseNum = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

  const scenarios = [
    { label: "A+ (97%)", target: 97 },
    { label: "A  (93%)", target: 93 },
    { label: "A- (90%)", target: 90 },
    { label: "B+ (87%)", target: 87 },
    { label: "B  (83%)", target: 83 },
    { label: "B- (80%)", target: 80 },
    { label: "C+ (77%)", target: 77 },
    { label: "C  (73%)", target: 73 },
  ];

  let verdict = "", verdictColor = "";
  if (neededOnFinal <= 0) { verdict = "You've already locked this in. Skip the final and you're good."; verdictColor = "#22c55e"; }
  else if (neededOnFinal <= 60) { verdict = "Very doable. Relax, review lightly, you've got this."; verdictColor = "#4ade80"; }
  else if (neededOnFinal <= 80) { verdict = "Solid study session and you're there."; verdictColor = "#a3e635"; }
  else if (neededOnFinal <= 90) { verdict = "You'll need to study hard, but it's within reach."; verdictColor = "#facc15"; }
  else if (neededOnFinal <= 100) { verdict = "Tough but not impossible. Lock in."; verdictColor = "#fb923c"; }
  else if (neededOnFinal <= 110) { verdict = "You'd need extra credit or a miracle. Consider a lower target."; verdictColor = "#ef4444"; }
  else { verdict = "Mathematically impossible. Time to recalibrate."; verdictColor = "#dc2626"; }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,300&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#0c0c0f;--surface:#16161a;--surface2:#1e1e24;--border:#2a2a32;--text:#e8e6e3;--text2:#94929d;--accent:#f0c040;--accent2:#e8a820;--danger:#ef4444;--radius:12px}
        body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased}
        .app{max-width:640px;margin:0 auto;padding:32px 20px 80px}
        .hero{text-align:center;margin-bottom:48px;padding-top:20px}
        .hero-badge{display:inline-block;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent);border:1px solid var(--accent);border-radius:100px;padding:6px 16px;margin-bottom:20px;opacity:.9}
        .hero h1{font-family:'Fraunces',serif;font-weight:800;font-size:42px;line-height:1.1;letter-spacing:-1px;margin-bottom:12px;background:linear-gradient(135deg,#f0c040 0%,#f7e08a 50%,#e8a820 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hero p{color:var(--text2);font-size:16px;line-height:1.5;max-width:420px;margin:0 auto}
        .section{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:16px}
        .section-title{font-family:'Fraunces',serif;font-weight:700;font-size:18px;margin-bottom:20px;display:flex;align-items:center;gap:10px}
        .section-title .num{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--accent);color:var(--bg);font-family:'DM Sans',sans-serif;font-weight:700;font-size:13px}
        .cat-row{display:grid;grid-template-columns:1fr 90px 90px 36px;gap:8px;align-items:center;margin-bottom:8px}
        .cat-header{display:grid;grid-template-columns:1fr 90px 90px 36px;gap:8px;margin-bottom:8px}
        .cat-header span{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:1px;color:var(--text2)}
        input[type="text"],input[type="number"]{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s}
        input:focus{border-color:var(--accent)}
        input[type="number"]{text-align:center;-moz-appearance:textfield}
        input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none}
        .remove-btn{width:36px;height:40px;display:flex;align-items:center;justify-content:center;background:none;border:1px solid transparent;border-radius:8px;color:var(--text2);cursor:pointer;font-size:18px;transition:all .15s}
        .remove-btn:hover{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:var(--danger)}
        .add-btn{width:100%;padding:10px;background:none;border:1px dashed var(--border);border-radius:8px;color:var(--text2);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .15s;margin-top:4px}
        .add-btn:hover{border-color:var(--accent);color:var(--accent)}
        .final-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:4px}
        .field-group label{display:block;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:1px;color:var(--text2);margin-bottom:8px}
        .weight-bar{height:6px;background:var(--surface2);border-radius:100px;margin-top:16px;overflow:hidden}
        .weight-bar-fill{height:100%;border-radius:100px;transition:width .4s cubic-bezier(.16,1,.3,1),background .3s}
        .weight-note{font-size:12px;margin-top:6px;text-align:right}
        .result-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:32px 24px;text-align:center;margin-bottom:16px;position:relative;overflow:hidden}
        .result-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2))}
        .result-label{font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:var(--text2);margin-bottom:12px;font-weight:500}
        .result-number{font-family:'Fraunces',serif;font-weight:900;font-size:72px;line-height:1;margin-bottom:8px}
        .result-letter{font-family:'Fraunces',serif;font-weight:700;font-size:20px;margin-bottom:16px}
        .verdict{font-size:15px;font-style:italic;font-weight:300;line-height:1.5;max-width:360px;margin:0 auto}
        .stats-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}
        .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 12px;text-align:center}
        .stat-card .stat-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text2);margin-bottom:6px;font-weight:500}
        .stat-card .stat-value{font-family:'Fraunces',serif;font-weight:700;font-size:22px}
        .scenarios-toggle{width:100%;padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s;margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:8px}
        .scenarios-toggle:hover{border-color:var(--accent)}
        .scenario-table{width:100%;border-collapse:collapse}
        .scenario-table th{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text2);font-weight:500;padding:8px 12px;text-align:left;border-bottom:1px solid var(--border)}
        .scenario-table td{padding:10px 12px;font-size:14px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums}
        .scenario-table tr:last-child td{border-bottom:none}
        .scenario-table .needed-cell{font-weight:700;font-family:'Fraunces',serif;font-size:16px}
        .difficulty-pill{display:inline-block;font-size:11px;font-weight:500;padding:3px 10px;border-radius:100px;letter-spacing:.3px}
        .footer{text-align:center;margin-top:48px;color:var(--text2);font-size:12px;opacity:.6}
        @media(max-width:500px){.hero h1{font-size:32px}.result-number{font-size:56px}.cat-row{grid-template-columns:1fr 72px 72px 32px;gap:6px}.cat-header{grid-template-columns:1fr 72px 72px 32px;gap:6px}.stats-row{grid-template-columns:1fr}.final-row{grid-template-columns:1fr}}
      `}</style>

      <div className="app">
        <div className="hero">
          <div className="hero-badge">Finals Season 2026</div>
          <h1>What Do I Need on My Final?</h1>
          <p>Enter your grades, set your target, and find out exactly what you need to score.</p>
        </div>

        {/* GRADES INPUT */}
        <div className="section">
          <div className="section-title"><span className="num">1</span>Your grades so far</div>
          <div className="cat-header">
            <span>Category</span>
            <span style={{ textAlign: "center" }}>Weight %</span>
            <span style={{ textAlign: "center" }}>Grade %</span>
            <span></span>
          </div>
          {categories.map((cat) => (
            <div className="cat-row" key={cat.id}>
              <input type="text" placeholder="e.g. Homework" value={cat.name} onChange={(e) => updateCategory(cat.id, "name", e.target.value)} />
              <input type="number" min="0" max="100" value={cat.weight || ""} onChange={(e) => updateCategory(cat.id, "weight", parseNum(e.target.value))} placeholder="0" />
              <input type="number" min="0" max="200" value={cat.earned || ""} onChange={(e) => updateCategory(cat.id, "earned", parseNum(e.target.value))} placeholder="0" />
              <button className="remove-btn" onClick={() => removeCategory(cat.id)} title="Remove">×</button>
            </div>
          ))}
          <button className="add-btn" onClick={addCategory}>+ Add category</button>
        </div>

        {/* AD SLOT 1 — between input sections */}
        <AdSlot slot="AUTO" />

        {/* FINAL DETAILS */}
        <div className="section">
          <div className="section-title"><span className="num">2</span>Final exam details</div>
          <div className="final-row">
            <div className="field-group">
              <label>Final exam weight %</label>
              <input type="number" min="0" max="100" value={finalWeight || ""} onChange={(e) => setFinalWeight(parseNum(e.target.value))} placeholder="0" />
            </div>
            <div className="field-group">
              <label>Desired course grade %</label>
              <input type="number" min="0" max="100" value={desiredGrade || ""} onChange={(e) => setDesiredGrade(parseNum(e.target.value))} placeholder="0" />
            </div>
          </div>
          <div className="weight-bar">
            <div className="weight-bar-fill" style={{ width: `${Math.min(totalWeight, 100)}%`, background: weightError ? "var(--danger)" : "var(--accent)" }} />
          </div>
          <div className="weight-note" style={{ color: weightError ? "var(--danger)" : "var(--text2)" }}>
            {totalWeight.toFixed(1)}% / 100%{weightError ? (totalWeight > 100 ? " — weights exceed 100%" : " — weights don't add up") : " ✓"}
          </div>
        </div>

        {/* RESULT */}
        <div className="result-card">
          <div className="result-label">You need to score</div>
          <div className="result-number">
            <AnimatedNumber value={Math.max(neededOnFinal, 0)} suffix="%" color={neededOnFinal > 100 ? "#ef4444" : neededOnFinal <= 0 ? "#22c55e" : "var(--text)"} />
          </div>
          <div className="result-letter" style={{ color: getLetterGrade(neededOnFinal).color }}>
            on your final to get a {desiredLetterGrade.letter} ({desiredGrade}%)
          </div>
          <div className="verdict" style={{ color: verdictColor }}>{verdict}</div>
        </div>

        {/* CONTEXT STATS */}
        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Current Grade</div><div className="stat-value" style={{ color: currentLetterGrade.color }}>{currentGradeSoFar.toFixed(1)}%</div></div>
          <div className="stat-card"><div className="stat-label">If You Ace It</div><div className="stat-value" style={{ color: getLetterGrade(gradeIfAce).color }}>{gradeIfAce.toFixed(1)}%</div></div>
          <div className="stat-card"><div className="stat-label">If You Skip It</div><div className="stat-value" style={{ color: getLetterGrade(gradeIfSkip).color }}>{gradeIfSkip.toFixed(1)}%</div></div>
        </div>

        {/* AD SLOT 2 — between result and scenarios */}
        <AdSlot slot="AUTO" />

        {/* SCENARIOS */}
        <button className="scenarios-toggle" onClick={() => setShowScenarios(!showScenarios)}>
          {showScenarios ? "Hide" : "Show"} all grade scenarios
          <span style={{ fontSize: 12 }}>{showScenarios ? "▲" : "▼"}</span>
        </button>

        {showScenarios && (
          <div className="section" style={{ padding: 0, overflow: "hidden" }}>
            <table className="scenario-table">
              <thead><tr><th>Target</th><th>Need on Final</th><th>Difficulty</th></tr></thead>
              <tbody>
                {scenarios.map((s) => {
                  const need = finalWeight > 0 ? ((s.target - currentWeightedSum) / finalWeight) * 100 : Infinity;
                  let diff, diffColor, diffBg;
                  if (need <= 0) { diff = "Locked in"; diffColor = "#22c55e"; diffBg = "rgba(34,197,94,.1)"; }
                  else if (need <= 60) { diff = "Easy"; diffColor = "#4ade80"; diffBg = "rgba(74,222,128,.1)"; }
                  else if (need <= 80) { diff = "Doable"; diffColor = "#a3e635"; diffBg = "rgba(163,230,53,.1)"; }
                  else if (need <= 90) { diff = "Hard"; diffColor = "#facc15"; diffBg = "rgba(250,204,21,.1)"; }
                  else if (need <= 100) { diff = "Very hard"; diffColor = "#fb923c"; diffBg = "rgba(251,146,60,.1)"; }
                  else { diff = "Impossible"; diffColor = "#ef4444"; diffBg = "rgba(239,68,68,.1)"; }
                  return (
                    <tr key={s.label}>
                      <td>{s.label}</td>
                      <td className="needed-cell" style={{ color: need > 100 ? "#ef4444" : "var(--text)" }}>
                        {need <= 0 ? "0%" : need === Infinity ? "—" : need.toFixed(1) + "%"}
                      </td>
                      <td><span className="difficulty-pill" style={{ color: diffColor, background: diffBg }}>{diff}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* AD SLOT 3 — bottom of page */}
        <AdSlot slot="AUTO" />

        <div className="footer">built during finals week · good luck out there</div>
      </div>
    </>
  );
}
