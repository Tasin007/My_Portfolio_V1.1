# Alam Md Tasin — DevOps & Cloud Portfolio

[![Live portfolio](https://img.shields.io/badge/Live_Portfolio-00d4ff?style=for-the-badge&logo=vercel&logoColor=07111f)](https://my-new-portfolio-iota-two.vercel.app/)
[![CI](https://img.shields.io/github/actions/workflow/status/Tasin007/My_Portfolio_V1.1/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/Tasin007/My_Portfolio_V1.1/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=07111f)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

An interactive, evidence-grounded portfolio for **Alam Md Tasin**, a DevOps Engineer and Hiroshima University Research Student based in Japan.

The portfolio presents production experience through working browser demonstrations—not decorative skill bars. Visitors can run a release pipeline, inject failures, correlate metrics and logs, investigate an incident, explore an LLM web-agent replay, and trace every professional claim back to its context.

## Live experience

**[Open the portfolio →](https://my-new-portfolio-iota-two.vercel.app/)**

Choose a route designed for your purpose:

- **Recruiter:** impact, work history, platform case studies, résumé and contact.
- **Engineer:** architecture, CI/CD, observability, logs and incident recovery.
- **Researcher:** LLM-driven browser automation, webpage generation and limitations.

English and curated Japanese recruiter essentials are available offline. Additional languages can be enabled through the optional server-side translation integration.

## Production impact represented

- **1.5+ years** of hands-on production DevOps experience.
- **6–7 platforms** across FinTech, banking, telecom and digital services.
- **200+ containerized services**, with peak environments exceeding **300**.
- Platforms serving **more than one million users**.
- Near-daily releases; approximately **5–6 new deployments** and **7–8 updates** on active deployment days.
- Proactive SSL-expiry alerts **10–15 days** in advance.

These statements are sourced from the included professional résumé. Client diagrams, private data and invented performance results are deliberately excluded.

## Signature features

- Connected CI/CD, metrics, logs and incident-response simulation.
- Failure injection for contract tests, security scans and database retry defects.
- Searchable structured-log and trace explorer.
- Guided rollback and post-incident review.
- Six responsibility-focused platform case studies.
- Interactive CSS architecture model with a reduced-effects alternative.
- Evidence-grounded portfolio assistant with a safe local-search fallback.
- LLM web-agent replay and deterministic webpage-generation sandbox.
- Recruiter, Engineer and Researcher routes.
- English/Japanese switch, dark/light themes and saved preferences.
- Keyboard command center (`Ctrl/Cmd + K`).
- Native dialogs, focus restoration, skip navigation and reduced-motion support.
- Printable recruiter profile, downloadable résumé, vCard and JSON profile.

All lab metrics, logs and incidents are clearly labelled synthetic demonstrations.

## Architecture

```text
React interface
├── Portfolio content and evidence index
├── Delivery/incident state reducer
├── Architecture and research demonstrations
├── Local evidence-search assistant
└── Localization layer
    ├── English and curated Japanese
    └── Optional server translation

Node server
├── Static production build
├── Allowlisted public documents/assets
├── Capability discovery
├── Evidence-restricted assistant endpoint
└── Bounded translation endpoint
```

The optional AI endpoints keep credentials on the server and enforce HTTPS providers, request-size bounds, input validation, timeouts, per-IP rate limiting and evidence-only prompting.

## Technology

- **Interface:** React, Vite, React Icons, semantic HTML, CSS 3D and responsive CSS
- **Server:** Node.js HTTP server and Fetch API
- **Quality:** Node test runner, JSDOM, axe-core, ESLint and production-bundle checks
- **Deployment:** Vercel with GitHub Actions quality gates

## Run locally

Requirements: Node.js 24 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. To test the complete production server:

```bash
npm run build
npm start
```

The production server listens on `http://127.0.0.1:4174` by default.

On Windows, `START_WINDOWS.bat` installs locked dependencies, builds and starts the production server.

## Quality gates

```bash
npm run lint
npm run build
npm test
```

The automated suite covers:

- simulation state, failures, recovery and evidence search;
- recruiter routes, dialogs, theme, Japanese switch and command navigation;
- Unicode rendering regression protection;
- generated-page and research interactions;
- compiled production-bundle rendering;
- server allowlisting and unavailable-provider behavior.

GitHub Actions runs the complete quality suite on every pull request and every push to `main`.

## Optional AI and translation

Copy `.env.example` to `.env` and provide a compatible HTTPS chat-completions endpoint:

```dotenv
AI_ENDPOINT=
AI_API_KEY=
AI_MODEL=
PORT=4174
```

Never place secrets in `VITE_*` variables or commit `.env`. Without an AI provider, the portfolio remains functional and the assistant transparently uses local evidence search.

## Privacy and evidence policy

- The résumé, detailed CV, Japanese rirekisho and Japanese shokumu keirekisho are intentionally available for recruitment.
- Company identifiers are typographic references, not official logos.
- No private architecture, client data or fabricated benchmark is published.
- The assistant cannot execute commands, browse private systems or invent missing evidence.
- Contact composition opens the visitor’s email client; the site does not store messages.

## Contact

- [Portfolio](https://my-new-portfolio-iota-two.vercel.app/)
- [GitHub](https://github.com/Tasin007)
- [LinkedIn](https://www.linkedin.com/in/mdtasinalam/)
- [Email](mailto:alam.tasin.cse@gmail.com)

---

Built and maintained by **Alam Md Tasin** in Higashi-Hiroshima, Japan.
