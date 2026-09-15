export const stages = [
  "Source",
  "Test",
  "Build",
  "Security scan",
  "Deploy",
  "Verify",
];
export const initialSimulation = {
  status: "idle",
  stage: -1,
  fault: "none",
  release: "v1.8.1",
  logs: [],
  tick: 0,
  history: [],
  inspected: [],
  feedback: "",
};
const event = (state, level, service, message) => ({
  time: state.tick,
  level,
  service,
  message,
  trace: "demo-release-182",
});
export function simulationReducer(s, a) {
  switch (a.type) {
    case "reset":
      return { ...initialSimulation, fault: s.fault };
    case "fault":
      return s.status === "running" ? s : { ...s, fault: a.value };
    case "start":
      return {
        ...initialSimulation,
        fault: s.fault,
        status: "running",
        stage: 0,
        logs: [
          event(
            s,
            "INFO",
            "pipeline",
            "Release v1.8.2 queued. Stable release v1.8.1 is still serving traffic.",
          ),
        ],
      };
    case "step": {
      if (s.status !== "running") return s;
      const next = s.stage + 1;
      const tick = s.tick + 1;
      if (
        (s.fault === "test" && next === 1) ||
        (s.fault === "security" && next === 3)
      )
        return {
          ...s,
          tick,
          stage: next,
          status: "blocked",
          logs: [
            ...s.logs,
            event(
              { ...s, tick },
              "ERROR",
              "pipeline",
              s.fault === "test"
                ? "Contract test failed. Deployment blocked; production unchanged."
                : "Critical dependency detected. Security gate blocks deployment. Production unchanged.",
            ),
          ],
        };
      if (next === 6) {
        const unhealthy = s.fault === "database";
        return {
          ...s,
          tick,
          stage: 5,
          release: "v1.8.2",
          status: unhealthy ? "incident" : "healthy",
          logs: [
            ...s.logs,
            event(
              { ...s, tick },
              unhealthy ? "ERROR" : "INFO",
              unhealthy ? "database" : "health-check",
              unhealthy
                ? "Connection pool 94%. Unbounded retries began after v1.8.2. P95 latency 680 ms."
                : "Health verification passed. Stable latency and error rate.",
            ),
          ],
        };
      }
      return {
        ...s,
        tick,
        stage: next,
        release: next >= 5 ? "v1.8.2" : s.release,
        logs: [
          ...s.logs,
          event(
            { ...s, tick },
            "INFO",
            "pipeline",
            stages[s.stage] + " completed. " + stages[next] + " started.",
          ),
        ],
      };
    }
    case "inspect":
      return {
        ...s,
        inspected: [...new Set([...s.inspected, a.value])],
        feedback:
          a.value === "metrics"
            ? "Connections jumped to 94% while CPU stayed normal. Check the deployment and matching logs."
            : "Trace demo-release-182 links the connection retries to v1.8.2. Rollback is available.",
        history: [...s.history, "Inspected " + a.value],
      };
    case "rollback":
      if (!["incident", "healthy"].includes(s.status)) return s;
      return {
        ...s,
        status: "recovered",
        release: "v1.8.1",
        tick: s.tick + 1,
        feedback:
          "Previous stable release restored. Confirm recovery in the shared metrics and logs.",
        history: [...s.history, "Rolled back to v1.8.1"],
        logs: [
          ...s.logs,
          event(
            s,
            "INFO",
            "deployment",
            "Rollback completed. Connections 28%, P95 latency 142 ms, errors 0.1%.",
          ),
        ],
      };
    case "restart":
      return {
        ...s,
        feedback:
          "Restarting does not remove the faulty release. Retry traffic adds pressure; inspect the release evidence first.",
        history: [...s.history, "Tried restart; faulty release remains"],
        logs: [
          ...s.logs,
          event(
            s,
            "WARN",
            "operator",
            "Restart attempted; retry defect persists.",
          ),
        ],
      };
    default:
      return s;
  }
}
export function metricsFor(s) {
  const bad = s.status === "incident";
  return {
    latency: bad ? 680 : 142,
    error: bad ? 12.4 : 0.1,
    connections: bad ? 94 : 28,
    throughput: bad ? 74 : 180,
  };
}
