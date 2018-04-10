# web-pony-slaystation
Repozitář týmu Pony Slaystation na soutěži UnIT Brno 2018

# Run locally

Navigate to project root and run
```bash
make backend
```

Script will check needed dependencies (npm, node, angular-cli, python3 and docker) and provide
feedback. If backend spins up on localhost:5000 (or 0.0.0.0:5000), then open new tab in project root and run
```bash
make fill-db
make frontend
```

# Filling DB with data manually

```bash
./post_records.py <path-to-json>
```

Script outputs count of successfully uploaded records and creates new dump filled with only
malformed records. Fix them and upload again.