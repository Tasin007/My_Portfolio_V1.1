# Security policy

## Supported version

Security updates apply to the latest version on the `main` branch.

## Reporting a vulnerability

Please report potential vulnerabilities privately to **alam.tasin.cse@gmail.com**. Include the affected component, reproduction steps and expected impact where possible.

Do not open a public issue containing credentials, personal information or a working exploit. I will acknowledge a valid report and coordinate remediation before public disclosure.

## Deployment boundaries

- AI credentials belong only in server environment variables.
- Variables prefixed with `VITE_` are public and must never contain secrets.
- Recruitment documents are intentionally public; private supporting records and credentials must remain excluded.
- The browser demonstrations use synthetic data and do not connect to client infrastructure.
