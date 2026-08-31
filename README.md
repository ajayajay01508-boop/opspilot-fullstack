# OpsPilot — Intelligent Incident Operations

[Live application](https://opspilot-ajay.choice-anole-9169.chatgpt.site)

Full-stack incident-response SaaS using Next.js, React, TypeScript, PHP 8.3, MongoDB 7, Go 1.23, JWT, REST APIs, and Docker.

## Verified benchmark
- **150,000** deterministic synthetic labeled telemetry events
- **95.02%** synthetic holdout accuracy (**142,530 / 150,000**)
- This is a reproducible synthetic validation benchmark, not a production ML claim.

## Run
```bash
npm install
npm run dataset:generate
npm test
docker compose up --build
```
