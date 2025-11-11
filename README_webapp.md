RYOE Explorer — Frontend-only webapp

This simple static UI streams `team_data_combined/plays.csv` in the browser and shows per-rusher aggregates.

How to run:

1. From the repo root run a simple static server (Python built-in):

   python3 -m http.server 8000

2. Open http://localhost:8000/ in your browser.

Notes:
- The page at `/index.html` expects `team_data_combined/plays.csv` to be reachable at `/team_data_combined/plays.csv`.
- The app uses PapaParse from a CDN to stream and parse the CSV without uploading it anywhere.
- The RYOE formula used is the same as in `queries.sql`:

  expected = 0.12588674 * ydstogo + 3.47336519
