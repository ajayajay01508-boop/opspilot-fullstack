# OpsPilot — Intelligent Incident Operations

[![Quality Gates](https://github.com/ajayajay01508-boop/opspilot-fullstack/actions/workflows/quality.yml/badge.svg)](https://github.com/ajayajay01508-boop/opspilot-fullstack/actions/workflows/quality.yml)

A full-stack incident-response workspace that brings incident coordination, service signals, response workflows and append-only audit events into one operational view.

**Live application:** [opspilot-ajay.choice-anole-9169.chatgpt.site](https://opspilot-ajay.choice-anole-9169.chatgpt.site)

## Product capabilities

- Create, search, filter, assign and resolve operational incidents
- Service-health and response-timeline views optimized for incident command
- PHP REST API for authentication and incident persistence in MongoDB
- Go ingestion service for validated telemetry events and health reporting
- Docker Compose environment for the API, event processor and MongoDB
- Responsive React/Next.js interface
- Reproducible 150,000-record synthetic telemetry benchmark

## Architecture

```text
Next.js dashboard
      │ REST
      ▼
PHP 8.3 API ─────────► MongoDB 7
                           ▲
                           │ validated events
                      Go 1.23 processor
```

The portfolio UI contains a disclosed demo snapshot so it remains explorable without credentials. The backend services provide the matching API and ingestion contracts for a local full-stack environment.

## Verified benchmark

- Dataset: **150,000 deterministic synthetic telemetry events**
- Holdout result: **142,530 / 150,000 correct (95.02%)**
- Purpose: reproducible validation of the documented threshold classifier

This is a synthetic engineering benchmark, not a production-ML accuracy claim. See [`data/README.md`](data/README.md) and regenerate the dataset with:

```bash
npm run dataset:generate
```

## Run the interface

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Run the backend stack

Requires Docker 24+ and Docker Compose v2.

```bash
JWT_SECRET="replace-with-a-long-random-value" docker compose up --build
```

- PHP API: `http://localhost:8080/health`
- Go processor: `http://localhost:8090/health`
- MongoDB: `mongodb://localhost:27017`

The fallback JWT value in `docker-compose.yml` is for local development only; set `JWT_SECRET` outside local demos.

## Quality checks

```bash
npm test
npm run lint
npm run build
cd backend/go-processor && go test ./...
```

The dependency-free Node suite covers incident validation, identifier generation, immutable resolution, operational summaries, telemetry thresholds and malformed input. GitHub Actions additionally runs the production build, dependency audit, Go tests and PHP syntax checks.

## Repository map

- `app/` — Next.js product interface
- `lib/` — deterministic incident and telemetry domain rules
- `tests/` — Node unit tests
- `backend/php-api/` — REST API and MongoDB persistence
- `backend/go-processor/` — telemetry ingestion service
- `scripts/` — reproducible dataset generator
- `data/` — benchmark result and limitations
- `docs/` — benchmark evidence graphics

## License

MIT
