import test from 'node:test'
import assert from 'node:assert/strict'
import { dateRange, fetchSector, normalizeHistory, SECTORS, summarize } from './market.js'

test('requests all eleven sectors over a UTC calendar range', () => {
  assert.equal(new Set(SECTORS.map(({ symbol }) => symbol)).size, 11)
  assert.deepEqual(dateRange(new Date('2026-11-15T23:59:00Z')), { startDate: '2026-10-01', endDate: '2026-11-15' })
})

test('normalizes wrapped records, sorts dates, and excludes invalid prices and dates', () => {
  const history = normalizeHistory({ body: JSON.stringify({ Items: [
    { Date: { S: '2026-11-12' }, Close: { N: '105.5' } },
    { date: '2026-11-10', close: 100 },
    { date: '2026-11-11', close: 0 },
    { date: '2026-02-30', close: 123 },
  ] }) })
  assert.deepEqual(history, [{ date: '2026-11-10', close: 100 }, { date: '2026-11-12', close: 105.5 }])
  assert.deepEqual(normalizeHistory({ error: 'unavailable' }), [])
})

test('computes change and a seven-session compounded estimate only with sufficient data', () => {
  const history = Array.from({ length: 7 }, (_, index) => ({ date: `2026-11-${String(index + 1).padStart(2, '0')}`, close: 100 * 1.01 ** index }))
  const result = summarize(history)
  assert.ok(Math.abs(result.change - 1) < 1e-10)
  assert.ok(Math.abs(result.trend - (1.01 ** 6 - 1) * 100) < 1e-10)
  assert.ok(Math.abs(result.estimate - 100 * 1.01 ** 7) < 1e-10)
  assert.equal(summarize(history.slice(0, 6)).estimate, null)
  assert.equal(summarize(history.slice(0, 1)).change, null)
  assert.equal(summarize([]), null)
})

test('uses endpoint last and previous_day_closing fields for the latest session', () => {
  const history = normalizeHistory({ symbol: 'XLK', count: 4, data: [
    { date: '2026-11-09', last: '170.88', previous_day_closing: '164.74' },
    { date: '2026-11-10', last: '168.93', previous_day_closing: '170.88' },
    { date: '2026-11-11', last: '174.37', previous_day_closing: '168.91' },
    { date: '2026-11-12', last: '173.77', previous_day_closing: '174.36' },
  ] })
  const result = summarize(history)
  assert.equal(result.last.close, 173.77)
  assert.ok(Math.abs(result.change - (173.77 / 174.36 - 1) * 100) < 1e-10)
  assert.equal(result.recent.length, 4)
  assert.equal(result.estimate, null)
  assert.ok(Math.abs(summarize(history.slice(-1)).change - result.change) < 1e-10)
})

test('falls back to the prior record when the reported previous close is invalid', () => {
  const history = normalizeHistory({ data: [
    { date: '2026-11-10', last: '100' },
    { date: '2026-11-11', last: '110', previous_day_closing: '0' },
  ] })
  assert.ok(Math.abs(summarize(history).change - 10) < 1e-10)
  assert.equal(summarize(history.slice(-1)).change, null)
})

test('fetches a symbol and rejects failed or unusable responses', async () => {
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async (url) => {
      assert.equal(url.searchParams.get('symbol'), 'XLK')
      assert.equal(url.searchParams.get('startDate'), '2026-10-01')
      return { ok: true, json: async () => ({ symbol: 'XLK', count: 1, data: [{ date: '2026-11-12', last: '173.77', previous_day_closing: '174.36' }] }) }
    }
    const result = await fetchSector({ symbol: 'XLK', name: 'Technology' }, { startDate: '2026-10-01', endDate: '2026-11-15' })
    assert.equal(result.last.close, 173.77)
    assert.ok(result.change < 0)
    globalThis.fetch = async () => ({ ok: false, status: 503 })
    await assert.rejects(fetchSector({ symbol: 'XLK' }, {}), /503/)
    globalThis.fetch = async () => ({ ok: true, json: async () => ({}) })
    await assert.rejects(fetchSector({ symbol: 'XLK' }, {}), /No usable price history/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
