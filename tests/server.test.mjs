import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
test("local server serves allowlisted build and reports missing provider honestly", async () => {
  const child = spawn(process.execPath, ["server.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: "4189",
      AI_ENDPOINT: "",
      AI_API_KEY: "",
      AI_MODEL: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    await new Promise((resolve, reject) => {
      child.stdout.once("data", resolve);
      child.once("error", reject);
      child.once("exit", (code) => reject(Error("Server exited " + code)));
    });
    const root = "http://127.0.0.1:4189";
    assert.equal((await fetch(root)).status, 200);
    const caps = await (await fetch(root + "/api/capabilities")).json();
    assert.equal(caps.ai, false);
    assert.equal(caps.translation, false);
    assert.equal((await fetch(root + "/tasin-icon.svg")).status, 200);
    for (const document of [
      "Alam_Md_Tasin_Resume.pdf",
      "Alam_Md_Tasin_DevOps_Engineer_CV.pdf",
      "Alam_Md_Tasin_Rirekisho.pdf",
      "Alam_Md_Tasin_Shokumu_Keirekisho.pdf",
    ]) {
      assert.equal((await fetch(root + "/" + document)).status, 200);
    }
    assert.equal((await fetch(root + "/Tasin_CV_2026.pdf")).status, 404);
    assert.equal((await fetch(root + "/.env")).status, 404);
    assert.equal(
      (
        await fetch(root + "/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "AWS?" }),
        })
      ).status,
      503,
    );
  } finally {
    child.kill();
  }
});
