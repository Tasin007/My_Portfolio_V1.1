import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
test("React interface renders, opens evidence, searches commands and runs generation sandbox", async () => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', {
    url: "http://localhost:4174",
    pretendToBeVisual: true,
  });
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
    outfile: ".test-build/app.mjs",
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
    pathToFileURL(process.cwd() + "/.test-build/app.mjs").href +
      "?test=" +
      Date.now()
  );
  const root = createRoot(document.getElementById("root"));
  const click = async (button) =>
    act(async () =>
      button.dispatchEvent(new window.MouseEvent("click", { bubbles: true })),
    );
  const button = (text) =>
    [...document.querySelectorAll("button")].find((b) =>
      b.textContent.includes(text),
    );
  try {
    await act(async () => root.render(React.createElement(App)));
    assert.match(document.querySelector("h1").textContent, /TASIN/);
    assert.equal(document.querySelectorAll(".platform-card").length, 6);
    assert.match(
      document.querySelector(".header-talk").textContent,
      /Let’s talk/,
    );
    assert.match(
      document.querySelector(".coordinate").textContent,
      /34\.4° N \/ 132\.7° E/,
    );
    assert.doesNotMatch(
      document.body.textContent,
      /\\(?:u[0-9a-f]{4}|x[0-9a-f]{2})/i,
    );
    await click(document.querySelector(".platform-card"));
    assert.ok(document.querySelector("dialog").open);
    assert.match(
      document.querySelector("dialog").textContent,
      /My responsibilities/,
    );
    await click(document.querySelector('[aria-label="Close dialog"]'));
    await click(document.querySelector('[aria-label="Enable light mode"]'));
    assert.equal(document.documentElement.dataset.theme, "light");
    await click(document.querySelector(".command-button"));
    assert.ok(document.querySelector(".command-results"));
    await click(button("Use engineer view"));
    assert.equal(
      document.querySelector(".visitor-route .eyebrow").textContent,
      "YOUR ROUTE · ENGINEER",
    );
    await click(document.querySelector(".companion-trigger"));
    await click(button("AWS experience"));
    assert.ok(document.querySelector(".source-card"));
    assert.match(document.querySelector(".chat-messages").textContent, /AWS/);
    await click(document.querySelector('[aria-label="Close dialog"]'));
    await click(button("Webpage generation"));
    await click(button("Generate sample page"));
    assert.match(
      document.querySelector("iframe").srcdoc,
      /Ideas into working systems/,
    );
    await click(
      [...document.querySelectorAll('[role="tab"]')].find(
        (b) => b.textContent === "Browser agent",
      ),
    );
    await click(document.querySelector('[aria-label="Next agent step"]'));
    assert.match(
      document.querySelector(".research-inspector").textContent,
      /Identify actionable elements/,
    );
    await click(document.querySelector('[aria-label="Choose language"]'));
    await click(button("日本語"));
    assert.equal(document.documentElement.lang, "ja");
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }
});
