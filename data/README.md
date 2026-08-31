# Telemetry benchmark dataset

Run `npm run dataset:generate` to reproduce `telemetry-150k.jsonl.gz`, containing **150,000 labeled observability events**.

The benchmark is deterministic and synthetic. Its reported accuracy validates the risk-rule implementation against the generated holdout labels; it is not a real-world machine-learning claim. Production use requires validation against real incident outcomes.
