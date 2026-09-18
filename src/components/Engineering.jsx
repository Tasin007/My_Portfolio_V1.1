/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  FiCloud,
  FiDatabase,
  FiGitBranch,
  FiBox,
  FiActivity,
  FiServer,
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { stages, metricsFor } from "../simulation";
const nodes = [
  [
    "Source",
    FiGitBranch,
    "A source change starts delivery. Version control records what changed and makes releases traceable.",
    "GitHub · Git",
  ],
  [
    "Delivery",
    FiBox,
    "Tests and security gates run before a container is promoted. A failed gate must leave production unchanged.",
    "Jenkins · GitHub Actions · Docker",
  ],
  [
    "Cloud",
    FiCloud,
    "Compute and traffic-routing services deliver the application. Access, configuration and health checks are part of the system.",
    "AWS · IAM · Nginx · Kong",
  ],
  [
    "Application",
    FiServer,
    "Application instances handle requests. Deployments can change their behaviour, including how they access the database.",
    "Docker · Linux",
  ],
  [
    "Data",
    FiDatabase,
    "Connection limits protect databases. Excessive retries can exhaust the pool and increase latency across the application.",
    "PostgreSQL · MySQL · MSSQL",
  ],
  [
    "Observe",
    FiActivity,
    "Metrics describe symptoms. Logs and release events help identify causes. Both are needed to verify recovery.",
    "Grafana · Prometheus · OpenSearch",
  ],
];
export function Architecture({ flat, state }) {
  const [active, setActive] = useState(0),
    [playing, setPlaying] = useState(false),
    [step, setStep] = useState(0),
    [scenario, setScenario] = useState("normal");
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setStep((v) => (v + 1) % 6), 900);
    return () => clearInterval(timer);
  }, [playing]);
  return (
    <div className="architecture panel">
      <div className="panel-toolbar">
        <span className="status-dot" />
        INTERACTIVE MODEL · SYNTHETIC
        <button
          className="text-button"
          onClick={() => {
            setStep(0);
            setPlaying(false);
          }}
        >
          Reset
        </button>
      </div>
      <div className={"spatial-world " + (flat ? "flat" : "")}>
        <div className="floor-grid" />
        <svg
          className="routes"
          viewBox="0 0 790 430"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M55 230L180 140L305 230L430 140L555 230L680 140" />
          <path
            className={playing ? "packet moving" : "packet"}
            d="M55 230L180 140L305 230L430 140L555 230L680 140"
          />
        </svg>
        {nodes.map(([name, Icon], i) => (
          <button
            key={name}
            style={{ "--i": i }}
            className={
              "world-node " +
              (active === i ? "selected " : "") +
              (playing && step === i ? "travelling " : "") +
              (i === 4 &&
              (scenario === "database" || state.status === "incident")
                ? "node-danger"
                : "")
            }
            onClick={() => setActive(i)}
            aria-pressed={active === i}
          >
            <div className="node-top">
              <Icon />
            </div>
            <strong>{name}</strong>
            <span>0{i + 1}</span>
          </button>
        ))}
      </div>
      <div className="architecture-controls">
        <button
          className="button primary"
          onClick={() => setPlaying((v) => !v)}
        >
          {playing ? <FiPause /> : <FiPlay />}
          {playing ? "Pause traffic" : "Follow one request"}
        </button>
        <label>
          Scenario
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            <option value="normal">Normal traffic</option>
            <option value="traffic">Traffic spike</option>
            <option value="database">Slow database</option>
          </select>
        </label>
        <span className="tag">
          {scenario === "normal"
            ? "142 ms · stable"
            : scenario === "traffic"
              ? "320 ms · capacity pressure"
              : "680 ms · connection bottleneck"}
        </span>
      </div>
      <div className="node-inspector" aria-live="polite">
        <span className="number">0{active + 1}</span>
        <div>
          <h3>{nodes[active][0]}</h3>
          <p>{nodes[active][2]}</p>
          <span className="mono accent">{nodes[active][3]}</span>
        </div>
      </div>
    </div>
  );
}
export function Engineering({ state, dispatch }) {
  const [query, setQuery] = useState(""),
    [level, setLevel] = useState("ALL"),
    [range, setRange] = useState(15),
    [expanded, setExpanded] = useState(null),
    [expert, setExpert] = useState(false);
  useEffect(() => {
    if (state.status !== "running") return;
    const timer = setInterval(() => dispatch({ type: "step" }), 850);
    return () => clearInterval(timer);
  }, [state.status, dispatch]);
  const metrics = metricsFor(state);
  const logs = state.logs.filter(
    (x) =>
      (level === "ALL" || x.level === level) &&
      JSON.stringify(x).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="lab-intro panel">
        <div>
          <span className="eyebrow">ONE SYSTEM. FOUR CONNECTED VIEWS.</span>
          <p>
            Deploy a release, observe the consequences, inspect the evidence and
            recover. These are working browser simulations—not connections to
            client infrastructure.
          </p>
        </div>
        <button className="button" onClick={() => dispatch({ type: "reset" })}>
          <FiRotateCcw />
          Reset all labs
        </button>
      </div>
      <div className="engineering-grid">
        <article className="panel" id="pipeline">
          <div className="panel-toolbar">
            <FiGitBranch />
            <h3>Delivery pipeline</h3>
            <span className={"tag status-" + state.status}>{state.status}</span>
          </div>
          <div className="panel-body">
            <p>
              Choose a failure, then run a release. Test and security failures
              stop before deployment. A database fault reaches production and
              triggers an incident.
            </p>
            <div className="stage-list">
              {stages.map((stage, i) => (
                <div
                  key={stage}
                  className={
                    i < state.stage
                      ? "complete"
                      : i === state.stage
                        ? "current"
                        : ""
                  }
                >
                  <span>{i < state.stage ? <FiCheck /> : i + 1}</span>
                  <small>{stage}</small>
                </div>
              ))}
            </div>
            <label className="field">
              Failure injection
              <select
                disabled={state.status === "running"}
                value={state.fault}
                onChange={(e) =>
                  dispatch({ type: "fault", value: e.target.value })
                }
              >
                <option value="none">None — healthy release</option>
                <option value="test">Fail contract test</option>
                <option value="security">Fail security scan</option>
                <option value="database">Deploy database retry defect</option>
              </select>
            </label>
            <div className="terminal-output" aria-live="polite">
              {state.logs.length ? (
                state.logs.slice(-4).map((l, i) => (
                  <p key={i}>
                    <span className={"level " + l.level}>{l.level}</span>{" "}
                    {l.message}
                  </p>
                ))
              ) : (
                <p>
                  Ready. Production v1.8.1 is healthy. No release has started.
                </p>
              )}
            </div>
            <div className="button-row">
              <button
                className="button primary"
                disabled={state.status === "running"}
                onClick={() => dispatch({ type: "start" })}
              >
                <FiPlay />
                {state.status === "blocked" ? "Retry pipeline" : "Run pipeline"}
              </button>
              <button
                className="button"
                disabled={!["incident", "healthy"].includes(state.status)}
                onClick={() => dispatch({ type: "rollback" })}
              >
                Roll back
              </button>
            </div>
          </div>
        </article>
        <article className="panel" id="observability">
          <div className="panel-toolbar">
            <FiActivity />
            <h3>Observability</h3>
            <div className="segments">
              {[5, 15, 60].map((x) => (
                <button
                  key={x}
                  aria-pressed={range === x}
                  onClick={() => setRange(x)}
                >
                  {x}m
                </button>
              ))}
            </div>
          </div>
          <div className="panel-body">
            <p>
              Every value reflects the same release state. Hover chart points
              for values. Longer ranges include more pre-release history.
            </p>
            <div className="telemetry-grid">
              {[
                [
                  "P95 latency",
                  metrics.latency,
                  "ms",
                  "95% of requests complete within this duration.",
                ],
                [
                  "Error rate",
                  metrics.error,
                  "%",
                  "Share of requests returning an error.",
                ],
                [
                  "DB connections",
                  metrics.connections,
                  "%",
                  "How much of the database connection pool is occupied.",
                ],
                [
                  "Throughput",
                  metrics.throughput,
                  "req/s",
                  "Successful requests processed each second.",
                ],
              ].map(([name, value, unit, description], mi) => (
                <div key={name} className="metric">
                  <span>{name}</span>
                  <strong
                    className={state.status === "incident" ? "danger" : ""}
                  >
                    {value}
                    <small>{unit}</small>
                  </strong>
                  <div
                    className="chart"
                    aria-label={name + " " + value + " " + unit}
                  >
                    {Array.from(
                      { length: range === 5 ? 10 : range === 15 ? 16 : 24 },
                      (_, i) => {
                        const past = i < 4;
                        const val = past ? [142, 0.1, 28, 180][mi] : value;
                        return (
                          <i
                            key={i}
                            title={`${i === 0 ? "-" + range + "m" : "Sample " + (i + 1)}: ${val} ${unit}`}
                            style={{
                              height:
                                (mi === 0
                                  ? val / 8
                                  : mi === 1
                                    ? val * 5 + 8
                                    : mi === 2
                                      ? val
                                      : val / 2) + "%",
                            }}
                          />
                        );
                      },
                    )}
                  </div>
                  <small>{description}</small>
                </div>
              ))}
            </div>
            <div className="health-line">
              <span className="status-dot" />
              {state.release} ·{" "}
              {state.status === "incident"
                ? "Degraded — investigate the release"
                : "Healthy baseline"}{" "}
              · Synthetic data
            </div>
          </div>
        </article>
        <article className="panel wide" id="logs">
          <div className="panel-toolbar">
            <FiDatabase />
            <h3>Log & trace explorer</h3>
            <span className="tag">{logs.length} events</span>
          </div>
          <div className="panel-body">
            <p>
              These events are generated by your pipeline actions. Search a
              service or the shared trace ID to follow the release across the
              system.
            </p>
            <div className="log-filters">
              <input
                aria-label="Search logs"
                placeholder="Search logs, service, trace…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                aria-label="Log severity"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {["ALL", "INFO", "WARN", "ERROR"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div className="event-list">
              {logs.map((l, i) => (
                <div key={i}>
                  <button
                    className="event-row"
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    aria-expanded={expanded === i}
                  >
                    <code>T+{l.time}s</code>
                    <span className={"level " + l.level}>{l.level}</span>
                    <strong>{l.service}</strong>
                    <span>{l.message}</span>
                    <FiArrowRight />
                  </button>
                  {expanded === i && (
                    <div className="event-detail">
                      <code>{l.trace}</code>
                      <p>
                        This event belongs to the demonstration release.
                        Correlate it with the pipeline stage and current
                        metrics.
                      </p>
                      <button
                        className="text-button"
                        onClick={() => setQuery(l.trace)}
                      >
                        Filter this trace
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {!logs.length && (
                <p className="empty-state">
                  {state.logs.length
                    ? "No matching events. Try another filter."
                    : "Run a pipeline to generate the first events."}
                </p>
              )}
            </div>
          </div>
        </article>
        <article className="panel wide" id="incident">
          <div className="panel-toolbar">
            <FiActivity />
            <h3>Incident investigation</h3>
            <button
              className="text-button"
              onClick={() => setExpert((x) => !x)}
            >
              {expert ? "Challenge mode" : "Guided mode"}
            </button>
          </div>
          <div className="panel-body">
            <div className="incident-layout">
              <div>
                <span className="eyebrow">
                  {state.status === "incident"
                    ? "DEGRADED SERVICE"
                    : state.status === "recovered"
                      ? "RECOVERY VERIFIED"
                      : "READY FOR A SCENARIO"}
                </span>
                <h3>
                  {state.status === "incident"
                    ? "A release. A connection spike. Your investigation."
                    : state.status === "recovered"
                      ? "Service restored. Evidence preserved."
                      : "Learn to recover a service safely."}
                </h3>
                <p>
                  {state.status === "incident"
                    ? "The application now returns more errors and database connections are saturated. The release timeline is the first place to investigate."
                    : "Choose “Deploy database retry defect” in the pipeline and run it to begin the incident."}
                </p>
                {!expert && (
                  <p className="callout">
                    Inspect metrics → correlate logs → choose a recovery action
                    → verify the result.
                  </p>
                )}
              </div>
              <div className="investigation-actions">
                <button
                  className="button"
                  disabled={state.status !== "incident"}
                  onClick={() =>
                    dispatch({ type: "inspect", value: "metrics" })
                  }
                >
                  1. Inspect metrics
                </button>
                <button
                  className="button"
                  disabled={state.status !== "incident"}
                  onClick={() => dispatch({ type: "inspect", value: "logs" })}
                >
                  2. Correlate logs
                </button>
                <button
                  className="button primary"
                  disabled={state.status !== "incident"}
                  onClick={() => dispatch({ type: "rollback" })}
                >
                  3. Roll back release
                </button>
                <button
                  className="text-button"
                  disabled={state.status !== "incident"}
                  onClick={() => dispatch({ type: "restart" })}
                >
                  Try restarting services
                </button>
              </div>
            </div>
            <p className="feedback" role="status">
              {state.feedback}
            </p>
            {state.history.length > 0 && (
              <details open={state.status === "recovered"}>
                <summary>Investigation record & postmortem</summary>
                <ol>
                  {state.history.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ol>
                {state.status === "recovered" && (
                  <p>
                    Cause: unbounded retries in the simulated release exhausted
                    database connections. Mitigation: restore v1.8.1.
                    Verification: latency 142 ms, errors 0.1%, pool usage 28%.
                    Prevention: bounded retries, connection-pool limits and
                    release-health gates.{" "}
                    {state.inspected.length < 2
                      ? "You recovered without inspecting all evidence; revisit both metrics and logs on another run."
                      : "Both evidence sources were inspected before recovery."}
                  </p>
                )}
              </details>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
