// Minimal frontend-only app to parse plays.csv and show per-rusher aggregates.
// It uses PapaParse to stream-parse the CSV in the browser so the file can be large.

const CSV_PATH = '../team_data_combined/plays.csv'; // relative path when served
const EXPECT_A = 0.12588674; // coefficient from queries.sql
const EXPECT_B = 3.47336519;  // intercept from queries.sql

const searchInput = document.getElementById('search');
const clearBtn = document.getElementById('clear');
const statusEl = document.getElementById('status');
const resultsBody = document.querySelector('#results tbody');

// Aggregation map: playerId -> stats
const players = new Map();
let rowsProcessed = 0;

function toNum(v){
  if (v === undefined || v === null || v === '') return NaN;
  // remove commas and parse
  const n = parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : NaN;
}

function processRow(row){
  // only consider rush attempts (CSV uses 1/0 or truthy strings)
  const rush = row['rush_attempt'];
  if (!rush || rush === '0' || rush.toLowerCase() === 'false') return;

  const id = row['rusher_player_id'] || row['rusher_id'] || row['rusher'];
  const name = row['rusher_player_name'] || row['rusher_name'] || 'UNKNOWN';
  const ydstogo = toNum(row['ydstogo']);
  const yards_gained = toNum(row['yards_gained']);

  // store minimal stats only when numeric values available
  const key = id || name;
  if (!players.has(key)) players.set(key, {id, name, n:0, sum_yards:0, sum_ryoe:0});
  const s = players.get(key);
  s.n += 1;
  if (!Number.isNaN(yards_gained)) s.sum_yards += yards_gained;
  // compute RYOE only if ydstogo and yards_gained numeric
  if (!Number.isNaN(ydstogo) && !Number.isNaN(yards_gained)){
    const expected = EXPECT_A * ydstogo + EXPECT_B;
    s.sum_ryoe += (yards_gained - expected);
  }
}

function render(searchTerm){
  // prepare array of players sorted by total plays desc
  let arr = Array.from(players.values()).map(p => ({
    id: p.id, name: p.name,
    total_plays: p.n,
    avg_yards: p.sum_yards / (p.n || 1),
    avg_ryoe: p.sum_ryoe / (p.n || 1)
  }));

  if (searchTerm) {
    const s = searchTerm.toLowerCase();
    arr = arr.filter(p => (p.name||'').toLowerCase().includes(s));
  }

  // sort: most plays first
  arr.sort((a,b) => b.total_plays - a.total_plays);

  // render top 200 to keep DOM small
  const top = arr.slice(0, 200);
  resultsBody.innerHTML = top.map(p => `
    <tr>
      <td>${escapeHtml(p.name || p.id || 'UNKNOWN')}</td>
      <td class="numeric">${p.total_plays}</td>
      <td class="numeric">${isFinite(p.avg_yards)?p.avg_yards.toFixed(2):'N/A'}</td>
      <td class="numeric">${isFinite(p.avg_ryoe)?p.avg_ryoe.toFixed(3):'N/A'}</td>
    </tr>
  `).join('');
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function startParse(){
  statusEl.textContent = 'Parsing CSV — this may take a while for large files';

  Papa.parse(CSV_PATH, {
    download: true,
    header: true,
    skipEmptyLines: true,
    chunk: function(results, parser){
      const data = results.data;
      for (let r of data){ processRow(r); }
      rowsProcessed += data.length;
      statusEl.textContent = `Parsed rows: ${rowsProcessed}`;
      // update UI incrementally
      render(searchInput.value.trim());
    },
    complete: function(){
      statusEl.textContent = `Done — parsed ${rowsProcessed} rows. Showing top results.`;
      render(searchInput.value.trim());
    },
    error: function(err){
      statusEl.textContent = 'Error parsing CSV: ' + err.message;
    }
  });
}

searchInput.addEventListener('input', () => render(searchInput.value.trim()));
clearBtn.addEventListener('click', () => { searchInput.value=''; render(''); });

// start
startParse();
