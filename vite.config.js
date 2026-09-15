import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, createReadStream } from "node:fs";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [
    react({ babel: { plugins: ["./localize-plugin.cjs"] } }),
    {
      name: "public-asset-allowlist",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const assets = {
            "/tasin-icon.svg": "image/svg+xml",
            "/icon-192.png": "image/png",
            "/icon-512.png": "image/png",
            "/manifest.webmanifest": "application/manifest+json",
            "/Alam_Md_Tasin_Resume.pdf": "application/pdf",
            "/api/profile.json": "application/json",
          };
          const path = req.url.split("?")[0];
          if (!assets[path]) return next();
          res.setHeader("Content-Type", assets[path]);
          createReadStream("public" + path).pipe(res);
        });
      },
      closeBundle() {
        mkdirSync("dist/api", { recursive: true });
        for (const file of [
          "tasin-icon.svg",
          "icon-192.png",
          "icon-512.png",
          "manifest.webmanifest",
          "Alam_Md_Tasin_Resume.pdf",
          "api/profile.json",
        ])
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
