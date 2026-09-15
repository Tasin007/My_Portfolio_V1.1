import { useEffect, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiArrowLeft,
  FiArrowRight,
  FiRotateCcw,
  FiCode,
  FiCpu,
} from "react-icons/fi";
const steps = [
  [
    "Observe",
    "Capture the page and goal",
    "The browser captures the current page state. A screenshot and the visible document provide complementary evidence.",
    '{"goal":"Enter Tasin and submit","page":"local demonstration"}',
  ],
  [
    "Parse",
    "Identify actionable elements",
    "The DOM parser assigns stable indexes to inputs and buttons. Labels and element types provide context for a valid action.",
    '[{"id":0,"tag":"input","label":"Name"},{"id":1,"tag":"button","text":"Submit"}]',
  ],
  [
    "Plan",
    "Choose a structured action",
    "A planner can select a typed action. This replay displays an illustrative action—not a live inference or private reasoning transcript.",
    '{"type":"TYPE","target":0,"value":"Tasin"}',
  ],
  [
    "Act",
    "Execute and observe again",
    "The executor types into the selected input. A subsequent action submits the form. Real research uses Playwright; this demonstration is a local interactive model.",
    '{"type":"CLICK","target":1}',
  ],
  [
    "Validate",
    "Check the outcome",
    "Submission produces a confirmation. Validation checks observable success instead of assuming that a click completed the goal.",
    '{"confirmation":"Thanks, Tasin","goal_complete":true}',
  ],
  [
    "Remember",
    "Record useful state",
    "Store the action, result and new state for later planning. Failed or stale targets should trigger a fresh observation.",
    '{"last_action":"submit","result":"success","next":"stop"}',
  ],
];
export default function Research() {
  const [tab, setTab] = useState("navigation"),
    [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false),
    [kind, setKind] = useState("Research studio"),
    [accent, setAccent] = useState("#35d7ff"),
    [generated, setGenerated] = useState(false),
    [view, setView] = useState("preview");
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setStep((s) => {
          if (s === 5) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      1300,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const html = `<!doctype html><html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;padding:40px;font-family:system-ui;background:#0a1825;color:#eff8ff}small{color:${accent};letter-spacing:3px}h1{font-size:44px;line-height:1.1;max-width:500px}p{line-height:1.7;color:#b1c4d5}a{display:inline-block;padding:14px 24px;background:${accent};color:#06101d;border-radius:10px;text-decoration:none}.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:30px}.cards article{border:1px solid #284456;padding:20px;border-radius:16px}@media(max-width:420px){body{padding:20px}h1{font-size:32px}.cards{grid-template-columns:1fr}}</style><small>INDEPENDENT ${kind.toUpperCase()}</small><h1>Ideas into working systems.</h1><p>A responsive ${kind.toLowerCase()} page created by a deterministic template demonstration. No model inference is claimed.</p><a href="#work">Explore work</a><div class="cards" id="work"><article><h2>Build</h2><p>Clear structure and accessible content.</p></article><article><h2>Learn</h2><p>Observe, evaluate and improve.</p></article></div></html>`;
  const download = () => {
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-demo.html";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <div className="research-story">
        <article>
          <h3>Why this research?</h3>
          <p>
            Dynamic webpages change after actions. An agent must connect what it
            sees, what it can interact with and whether its last action actually
            worked. My research explores this observation–action loop using
            local language models.
          </p>
        </article>
        <article>
          <h3>What exists today?</h3>
          <p>
            The résumé describes a Python prototype with browser, DOM parser,
            action executor, planner and memory modules. No benchmark scores,
            conference acceptance or completed multimodal-generation results are
            claimed here.
          </p>
        </article>
        <article>
          <h3>Where it goes next</h3>
          <p>
            Multimodal webpage understanding and webpage generation: connecting
            visual layout, structured page content, generated code and rendered
            output. The goal is to study both navigation and creation, with
            explicit evaluation.
          </p>
        </article>
      </div>
      <div className="panel research-lab">
        <div className="panel-toolbar">
          <FiCpu />
          <h3>Explore the research</h3>
          <span className="tag">Illustrative demos</span>
        </div>
        <div
          className="tabs"
          role="tablist"
          aria-label="Research demonstrations"
        >
          {[
            ["navigation", "Browser agent"],
            ["generation", "Webpage generation"],
            ["method", "Method & limitations"],
          ].map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => {
                setTab(id);
                setPlaying(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "navigation" && (
          <div className="research-demo">
            <div>
              <div className="browser-chrome">
                <i />
                <i />
                <i />
                <span>Local demonstration · no external browsing</span>
              </div>
              <div className="sample-browser">
                <span className="eyebrow">A SMALL TASK. A COMPLETE LOOP.</span>
                <h3>Say hello.</h3>
                <p>Goal: enter Tasin as the name and submit this form.</p>
                <label>
                  Name
                  <input
                    readOnly
                    value={step >= 3 ? "Tasin" : ""}
                    placeholder="Your name"
                    className={step === 1 ? "target-outline" : ""}
                  />
                </label>
                <button
                  className={
                    "button primary " + (step === 3 ? "target-outline" : "")
                  }
                  onClick={() => {
                    setStep(4);
                    setPlaying(false);
                  }}
                >
                  {step >= 4 ? "Submitted ✓" : "Submit sample form"}
                </button>
                {step >= 4 && (
                  <p className="success" role="status">
                    Thanks, Tasin. The observable goal is complete.
                  </p>
                )}
              </div>
              <div className="button-row replay-controls">
                <button
                  className="button"
                  aria-label="Previous agent step"
                  disabled={step === 0}
                  onClick={() => {
                    setPlaying(false);
                    setStep((s) => s - 1);
                  }}
                >
                  <FiArrowLeft />
                </button>
                <button
                  className="button primary"
                  onClick={() => {
                    if (step === 5) setStep(0);
                    setPlaying((v) => !v);
                  }}
                >
                  {playing ? <FiPause /> : <FiPlay />}
                  {playing ? "Pause" : "Play replay"}
                </button>
                <button
                  className="button"
                  aria-label="Next agent step"
                  disabled={step === 5}
                  onClick={() => {
                    setPlaying(false);
                    setStep((s) => s + 1);
                  }}
                >
                  <FiArrowRight />
                </button>
                <button
                  className="button"
                  aria-label="Reset agent"
                  onClick={() => {
                    setPlaying(false);
                    setStep(0);
                  }}
                >
                  <FiRotateCcw />
                </button>
              </div>
            </div>
            <div className="research-inspector">
              <div className="step-tabs">
                {steps.map(([s], i) => (
                  <button
                    key={s}
                    aria-current={step === i ? "step" : undefined}
                    onClick={() => {
                      setStep(i);
                      setPlaying(false);
                    }}
                  >
                    <span>{i + 1}</span>
                    {s}
                  </button>
                ))}
              </div>
              <span className="eyebrow">STEP {step + 1} / 6</span>
              <h3>{steps[step][1]}</h3>
              <p>{steps[step][2]}</p>
              <pre>{steps[step][3]}</pre>
              <p className="muted">
                Replay, not recorded experimental evidence. The browser
                interactions here do not invoke an LLM.
              </p>
            </div>
          </div>
        )}
        {tab === "generation" && (
          <div className="generation-demo panel-body">
            <div className="generation-options">
              <div>
                <h3>From a specification to a rendered page.</h3>
                <p>
                  This functional template sandbox illustrates the input → code
                  → render workflow. It is not the research model and does not
                  evaluate screenshot similarity.
                </p>
              </div>
              <label className="field">
                Page type
                <select
                  value={kind}
                  onChange={(e) => {
                    setKind(e.target.value);
                    setGenerated(false);
                  }}
                >
                  <option>Research studio</option>
                  <option>Engineering portfolio</option>
                  <option>Product lab</option>
                </select>
              </label>
              <label className="field">
                Accent
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => {
                    setAccent(e.target.value);
                    setGenerated(false);
                  }}
                />
              </label>
              <button
                className="button primary"
                onClick={() => setGenerated(true)}
              >
                <FiCode />
                Generate sample page
              </button>
            </div>
            {generated ? (
              <>
                <div className="button-row">
                  <button
                    className="button"
                    onClick={() =>
                      setView(view === "preview" ? "code" : "preview")
                    }
                  >
                    {view === "preview"
                      ? "View generated HTML"
                      : "View rendered page"}
                  </button>
                  <button className="button" onClick={download}>
                    Download HTML
                  </button>
                </div>
                {view === "preview" ? (
                  <iframe
                    title="Generated page preview"
                    sandbox=""
                    srcDoc={html}
                  />
                ) : (
                  <pre>{html}</pre>
                )}
              </>
            ) : (
              <div className="generation-empty">
                <FiCode />
                <p>
                  Choose the page type and accent, then generate. The HTML and
                  rendered preview will be available here.
                </p>
              </div>
            )}
          </div>
        )}
        {tab === "method" && (
          <div className="research-story panel-body">
            <article>
              <h3>Navigation evaluation</h3>
              <p>
                Candidate measures: task success, invalid actions, recovery
                after stale elements and number of interaction steps. Results
                require actual repeated experiments and a defined task set.
              </p>
            </article>
            <article>
              <h3>Generation evaluation</h3>
              <p>
                Proposed measures: render validity, structural fidelity, visual
                similarity and functional interaction checks. A generated
                preview alone does not demonstrate research quality.
              </p>
            </article>
            <article>
              <h3>Responsible scope</h3>
              <p>
                Keep private pages and credentials out of demos. Use bounded
                tasks, allowlisted actions and reproducible records. Publish
                verified findings, including failures and limitations.
              </p>
            </article>
          </div>
        )}
      </div>
    </>
  );
}
