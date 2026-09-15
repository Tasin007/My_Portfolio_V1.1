import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import axe from "axe-core";

test("primary interface has no detectable accessibility violations", async () => {
  const dom = new JSDOM(
    '<!doctype html><html lang="en"><head><title>Alam Md Tasin portfolio</title></head><body><div id="root"></div></body></html>',
    {
      url: "http://localhost:4174",
      pretendToBeVisual: true,
      runScripts: "outside-only",
    },
  );
  const { window } = dom;
  for (const key of [
    "window",
    "document",
    "navigator",
    "HTMLElement",
    "HTMLDialogElement",
    "localStorage",
    "history",
    "location",
    "FormData",
  ])
    Object.defineProperty(globalThis, key, {
      value: window[key],
      configurable: true,
      writable: true,
    });
  globalThis.matchMedia = () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
  window.matchMedia = globalThis.matchMedia;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  window.HTMLElement.prototype.scrollIntoView = function () {};
  window.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ ai: false, translation: false }),
  });
  await mkdir(".test-build", { recursive: true });
  await build({
    entryPoints: ["src/Portfolio.jsx"],
    outfile: ".test-build/accessibility.mjs",
    bundle: true,
    format: "esm",
    platform: "node",
    jsx: "automatic",
    external: ["react", "react-dom"],
    banner: {
      js: "import {createRequire} from 'node:module'; const require=createRequire(import.meta.url);",
    },
    loader: { ".jpeg": "dataurl", ".jpg": "dataurl" },
  });
  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { act } = await import("react-dom/test-utils");
  const { default: App } = await import(
    pathToFileURL(process.cwd() + "/.test-build/accessibility.mjs").href +
      "?test=" +
      Date.now()
  );
  const root = createRoot(document.getElementById("root"));
  try {
    await act(async () => root.render(React.createElement(App)));
    window.eval(axe.source);
    const results = await window.axe.run(document, {
      rules: { "color-contrast": { enabled: false } },
    });
    const violations = results.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    }));
    assert.equal(violations.length, 0, JSON.stringify(violations));
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }
});
