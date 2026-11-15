import { useEffect, useState } from 'react'
import { dateRange, fetchSector, SECTORS } from './market'
import './App.css'

const money = (value) => value == null ? '—' : `$${value.toFixed(2)}`
const percent = (value) => value == null ? '—' : `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
const tone = (value) => value == null ? '' : value >= 0 ? 'positive' : 'negative'
const displayDate = (date) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

function Sparkline({ points }) {
  if (points.length < 2) return <div className="spark-placeholder">Not enough data</div>
  const values = points.map((point) => point.close)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const coords = values.map((value, index) => `${index * 100 / (values.length - 1)},${max === min ? 20 : 37 - (value - min) / (max - min) * 34}`).join(' ')
  return <svg className={values.at(-1) >= values[0] ? 'positive' : 'negative'} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points={coords} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>
}

function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const range = dateRange()
    Promise.allSettled(SECTORS.map((sector) => fetchSector(sector, range, controller.signal))).then((settled) => {
      if (controller.signal.aborted) return
      setResults(settled.map((result, index) => result.status === 'fulfilled'
        ? result.value
        : { ...SECTORS[index], error: result.reason?.message || 'Request failed' }))
      setLoading(false)
    })
    return () => controller.abort()
  }, [refresh])

  const available = results.filter((result) => !result.error)
  const withChange = available.filter((result) => result.change != null)
  const ranked = [...withChange].sort((a, b) => b.change - a.change)
  const latestDate = available.map((result) => result.last.date).sort().at(-1)
  const rising = withChange.filter((result) => result.change > 0).length
  const failed = results.length - available.length

  function reload() {
    setLoading(true)
    setResults([])
    setRefresh((value) => value + 1)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">◈</span> SECTOR<span> / </span>MONITOR</div>
        <div className="topbar-right"><span className="live-dot" /> MARKET DASHBOARD <span className="topbar-divider">/</span> S&amp;P 500</div>
      </header>
      <main>
        <section className="intro">
          <div>
            <div className="eyebrow"><span className="live-dot" /> THE BIG PICTURE</div>
            <h1>Sector <span>intelligence.</span></h1>
            <p>A clearer view of the market, one sector at a time.</p>
          </div>
          <button className="refresh" onClick={reload} disabled={loading}><span>↻</span> {loading ? 'Updating…' : 'Refresh data'}</button>
        </section>

        <section className="summary-grid" aria-label="Market overview">
          <div className="summary-card"><span className="label">LATEST SESSION</span><strong>{latestDate ? displayDate(latestDate) : '—'}</strong><small>Most recent available close</small></div>
          <div className="summary-card"><span className="label">SECTORS ADVANCING</span><strong>{withChange.length ? `${rising} / ${withChange.length}` : '—'}</strong><small>Compared with previous close</small></div>
          <div className="summary-card"><span className="label">TOP PERFORMER</span><strong>{ranked[0]?.symbol || '—'} <em className={tone(ranked[0]?.change)}>{percent(ranked[0]?.change)}</em></strong><small>{ranked[0]?.name || 'Awaiting market data'}</small></div>
          <div className="summary-card"><span className="label">SECTORS TRACKED</span><strong>{loading ? '—' : `${available.length} / 11`}</strong><small>SPDR sector ETFs</small></div>
        </section>

        <section className="section-heading">
          <div><div className="eyebrow">MARKET OVERVIEW <span className="slash">/</span> 01</div><h2>Sector snapshot</h2><p>Latest closing prices and recent momentum across all 11 sectors.</p></div>
          <div className="legend"><span className="legend-dot" /> LAST 7 SESSIONS</div>
        </section>

        {loading && <div className="notice" role="status">Loading sector histories…</div>}
        {!loading && failed > 0 && <div className="notice warning" role="status">{failed === 11 ? 'Unable to load sector data.' : `${failed} sector${failed === 1 ? '' : 's'} could not be loaded.`} Check the connection and try refreshing. The API must allow requests from this site (CORS).</div>}
        {!loading && <div className="sector-grid">
          {results.map((sector) => <article className={`sector-card ${sector.error ? 'unavailable' : ''}`} key={sector.symbol}>
            <div className="card-top"><div><span className="ticker">{sector.symbol}</span><h3>{sector.name}</h3></div><span className="card-arrow">↗</span></div>
            {sector.error ? <div className="card-error">Data unavailable <small>{sector.error}</small></div> : <>
              <div className="price-row"><strong>{money(sector.last.close)}</strong><span className={`change ${tone(sector.change)}`}>{percent(sector.change)}</span></div>
              <div className="chart-row"><div><span className="label">7-SESSION TREND</span><div className={`trend ${tone(sector.trend)}`}>{percent(sector.trend)}</div></div><Sparkline points={sector.recent} /></div>
              <div className="card-footer"><span>Next session estimate <span className="info" title="Based on the average compounded return across the last seven closes.">ⓘ</span></span><strong>{money(sector.estimate)}</strong></div>
              <div className="as-of">Close as of {displayDate(sector.last.date)}</div>
            </>}
          </article>)}
        </div>}

        <aside className="methodology"><div className="method-icon">✳</div><div><h2>A note on the estimate</h2><p>The next-session estimate extends the average compounded return between the first and last of the most recent 7 trading-session closes by one session. At least 7 closes are required. This simple historical trend is not a forecast guarantee or investment advice; markets can move differently.</p></div></aside>
      </main>
      <footer><span>◈ &nbsp; SECTOR / MONITOR</span><span>Built for a clearer market view.</span><span>DATA: SPDR SECTOR ETFs</span></footer>
    </div>
  )
}

export default App
