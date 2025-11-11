RYOE Explorer — frontend-only

What this is
- A small static frontend (no framework) that reads `team_data_combined/plays.csv` in the browser, computes per-rusher aggregates, and displays them with a search box.

How it works
- `index.html` loads `app.js` and PapaParse (from CDN). `app.js` streams `team_data_combined/plays.csv` using PapaParse and computes: total plays, average yards, and average RYOE using the formula in `queries.sql` (expected = 0.12588674 * ydstogo + 3.47336519).

Run locally
1. Serve the repository root with a simple static server so the browser can fetch the CSV. From the repo root run:

```bash
# from workspace root (/workspaces/RYOE-CLASS)
python3 -m http.server 8000
```

2. Open the app in a browser:

http://localhost:8000/webapp/index.html

Notes & caveats
- The app parses the full CSV in the browser; for very large files this can be slow or memory-heavy. The code uses PapaParse chunking to reduce memory spikes and updates the UI incrementally.
- If your CSV has different column names, update `app.js` to match (e.g., `rusher_player_id`, `rusher_player_name`, `ydstogo`, `yards_gained`, `rush_attempt`).
- This is intentionally minimal and frontend-only; there is no server-side indexing or databases.
