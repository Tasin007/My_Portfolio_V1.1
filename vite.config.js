import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, createReadStream } from "node:fs";

const publicAssets = {
  "/tasin-icon.svg": "image/svg+xml",
  "/icon-192.png": "image/png",
  "/icon-512.png": "image/png",
  "/manifest.webmanifest": "application/manifest+json",
  "/robots.txt": "text/plain; charset=utf-8",
  "/sitemap.xml": "application/xml; charset=utf-8",
  "/social-preview.png": "image/png",
  "/Alam_Md_Tasin_Resume.pdf": "application/pdf",
  "/Alam_Md_Tasin_DevOps_Engineer_CV.pdf": "application/pdf",
  "/Alam_Md_Tasin_Rirekisho.pdf": "application/pdf",
  "/Alam_Md_Tasin_Shokumu_Keirekisho.pdf": "application/pdf",
  "/api/profile.json": "application/json",
};

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [
    react({ babel: { plugins: ["./localize-plugin.cjs"] } }),
    {
      name: "public-asset-allowlist",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const path = req.url.split("?")[0];
          if (!publicAssets[path]) return next();
          res.setHeader("Content-Type", publicAssets[path]);
          createReadStream("public" + path).pipe(res);
        });
      },
      closeBundle() {
        mkdirSync("dist/api", { recursive: true });
        for (const file of Object.keys(publicAssets).map((path) =>
          path.slice(1),
        ))
          copyFileSync("public/" + file, "dist/" + file);
      },
    },
  ],
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api/assistant": "http://127.0.0.1:4174",
      "/api/translate": "http://127.0.0.1:4174",
      "/api/capabilities": "http://127.0.0.1:4174",
    },
  },
});
