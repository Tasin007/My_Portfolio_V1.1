import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { JSDOM, VirtualConsole } from "jsdom";
test("compiled production bundle renders and opens interactive research", async () => {
  const errors = [];
  const console = new VirtualConsole();
  console.on("jsdomError", (e) => errors.push(e.message));
  const dom = new JSDOM('<!doctype html><div id="root"></div>', {
    url: "http://localhost:4174",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: console,
    beforeParse(w) {
      w.fetch = async () => ({
        json: async () => ({ ai: false, translation: false }),
      });
      w.matchMedia = () => ({ matches: false });
      w.HTMLElement.prototype.scrollIntoView = function () {};
      w.HTMLDialogElement.prototype.showModal = function () {
        this.open = true;
      };
    },
  });
  try {
    const filename = (await readdir("dist/assets")).find((f) =>
      f.endsWith(".js"),
    );
    dom.window.eval(await readFile("dist/assets/" + filename, "utf8"));
    await new Promise((r) => setTimeout(r, 80));
    const d = dom.window.document;
    assert.match(d.querySelector("h1").textContent, /TASIN/);
    assert.equal(d.querySelectorAll(".platform-card").length, 6);
    assert.doesNotMatch(d.body.textContent, /\\(?:u[0-9a-f]{4}|x[0-9a-f]{2})/i);
    d.querySelector('[aria-label="Choose language"]').click();
    await new Promise((r) => setTimeout(r, 30));
    [...d.querySelectorAll("button")]
      .find((b) => b.textContent.includes("日本語"))
      .click();
    await new Promise((r) => setTimeout(r, 30));
    assert.equal(d.documentElement.lang, "ja");
    assert.match(d.querySelector(".header-talk").textContent, /お問い合わせ/);
    [...d.querySelectorAll('[role="tab"]')]
      .find((b) => b.textContent === "Webpage generation")
      .click();
    await new Promise((r) => setTimeout(r, 30));
    [...d.querySelectorAll("button")]
      .find((b) => b.textContent.includes("Generate sample page"))
      .click();
    await new Promise((r) => setTimeout(r, 30));
    assert.match(
      d.querySelector("iframe").srcdoc,
      /Ideas into working systems/,
    );
    assert.deepEqual(errors, []);
  } finally {
    dom.window.close();
  }
});
