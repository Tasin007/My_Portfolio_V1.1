import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialSimulation,
  simulationReducer as reduce,
  metricsFor,
} from "../src/simulation.js";
import { searchEvidence, platforms } from "../src/content.js";
function run(fault) {
  let state = reduce(initialSimulation, { type: "fault", value: fault });
  state = reduce(state, { type: "start" });
  for (let i = 0; i < 6; i++) state = reduce(state, { type: "step" });
  return state;
}
test("healthy pipeline deploys and verifies release", () => {
  const s = run("none");
  assert.equal(s.status, "healthy");
  assert.equal(s.release, "v1.8.2");
  assert.equal(s.stage, 5);
  assert.equal(metricsFor(s).latency, 142);
});
test("test and security gates leave production unchanged", () => {
  for (const fault of ["test", "security"]) {
    const s = run(fault);
    assert.equal(s.status, "blocked");
    assert.equal(s.release, "v1.8.1");
    assert.equal(metricsFor(s).error, 0.1);
    assert.equal(s.logs.at(-1).level, "ERROR");
  }
});
test("database incident changes metrics and creates diagnostic evidence", () => {
  const s = run("database");
  assert.equal(s.status, "incident");
  assert.equal(metricsFor(s).connections, 94);
  assert.equal(metricsFor(s).latency, 680);
  assert.match(s.logs.at(-1).message, /Unbounded retries/);
});
test("restart does not falsely resolve the incident", () => {
  const s = reduce(run("database"), { type: "restart" });
  assert.equal(s.status, "incident");
  assert.equal(s.history.length, 1);
});
test("inspect and rollback preserve evidence while recovering all metrics", () => {
  let s = run("database");
  for (const value of ["metrics", "logs"])
    s = reduce(s, { type: "inspect", value });
  s = reduce(s, { type: "rollback" });
  assert.equal(s.status, "recovered");
  assert.equal(s.release, "v1.8.1");
  assert.equal(s.inspected.length, 2);
  assert.equal(metricsFor(s).error, 0.1);
  assert.match(s.logs.at(-1).message, /Rollback completed/);
});
test("reset clears runs, history and evidence", () => {
  const s = reduce(run("database"), { type: "reset" });
  assert.equal(s.status, "idle");
  assert.equal(s.logs.length, 0);
  assert.equal(s.history.length, 0);
  assert.equal(s.fault, "database");
});
test("rollback before deployment does nothing", () =>
  assert.deepEqual(
    reduce(initialSimulation, { type: "rollback" }),
    initialSimulation,
  ));
test("fault cannot change mid-run", () => {
  const s = reduce(initialSimulation, { type: "start" });
  assert.equal(reduce(s, { type: "fault", value: "database" }).fault, "none");
});
test("evidence search returns supporting sources and does not invent results", () => {
  assert.ok(searchEvidence("AWS experience").some((x) => /AWS/.test(x.text)));
  assert.equal(searchEvidence("quantumfluffmadeup").length, 0);
  assert.equal(platforms.length, 6);
});
