export const SECTORS = [
  { symbol: 'XLC', name: 'Communication Services' },
  { symbol: 'XLY', name: 'Consumer Discretionary' },
  { symbol: 'XLP', name: 'Consumer Staples' },
  { symbol: 'XLE', name: 'Energy' },
  { symbol: 'XLF', name: 'Financials' },
  { symbol: 'XLV', name: 'Health Care' },
  { symbol: 'XLI', name: 'Industrials' },
  { symbol: 'XLB', name: 'Materials' },
  { symbol: 'XLRE', name: 'Real Estate' },
  { symbol: 'XLK', name: 'Technology' },
  { symbol: 'XLU', name: 'Utilities' },
]

const ENDPOINT = 'https://05gucfyj9e.execute-api.us-east-2.amazonaws.com/default/query-sector-history'

export function dateRange(now = new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 45)
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) }
}

function unwrap(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if ('S' in value) return value.S
    if ('N' in value) return value.N
  }
  return value
}

export function normalizeHistory(payload) {
  if (typeof payload === 'string') {
    try { return normalizeHistory(JSON.parse(payload)) } catch { return [] }
  }
  if (!Array.isArray(payload)) {
    if (!payload || typeof payload !== 'object') return []
    for (const key of ['data', 'items', 'Items', 'results', 'history', 'body']) {
      if (payload[key] != null) {
        const rows = normalizeHistory(payload[key])
        if (rows.length) return rows
      }
    }
    return []
  }

  const byDate = new Map()
  for (const row of payload) {
    if (!row || typeof row !== 'object') continue
    const rawDate = unwrap(row.date ?? row.Date ?? row.tradeDate ?? row.timestamp)
    const rawClose = unwrap(row.close ?? row.Close ?? row.adjustedClose ?? row.adjClose ?? row.price ?? row.last)
    const rawPreviousClose = unwrap(row.previous_day_closing)
    const date = typeof rawDate === 'string' ? rawDate.slice(0, 10) : ''
    const close = rawClose == null || rawClose === '' ? NaN : Number(rawClose)
    const previousClose = rawPreviousClose == null || rawPreviousClose === '' ? NaN : Number(rawPreviousClose)
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : null
    if (parsedDate && !Number.isNaN(parsedDate.valueOf()) && parsedDate.toISOString().slice(0, 10) === date && Number.isFinite(close) && close > 0) {
      byDate.set(date, {
        date,
        close,
        ...(Number.isFinite(previousClose) && previousClose > 0 ? { previousClose } : {}),
      })
    }
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
}

export function summarize(history) {
  if (!history.length) return null
  const last = history.at(-1)
  const previous = history.at(-2)
  const recent = history.slice(-7)
  const previousClose = last.previousClose ?? previous?.close
  const change = previousClose != null ? (last.close / previousClose - 1) * 100 : null
  const trend = recent.length === 7 ? (last.close / recent[0].close - 1) * 100 : null
  const estimate = trend == null ? null : last.close * (last.close / recent[0].close) ** (1 / (recent.length - 1))
  return { last, change, trend, estimate, recent }
}

export async function fetchSector(sector, range, signal) {
  const url = new URL(ENDPOINT)
  url.search = new URLSearchParams({ symbol: sector.symbol, ...range }).toString()
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  const history = normalizeHistory(await response.json())
  if (!history.length) throw new Error('No usable price history returned')
  return { ...sector, ...summarize(history) }
}
