import https from 'https';

// Helper function to query a single symbol
const fetchSymbolData = (symbol) => {
    return new Promise((resolve, reject) => {
        const url = `https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=${symbol}`;
        
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const q = data?.FormattedQuoteResult?.FormattedQuote?.[0];
                    if (q) {
                        resolve({
                            symbol: q.symbol,
                            name: q.name,
                            previous_day_closing: q.previous_day_closing,
                            last: q.last,
                            open: q.open,
                            high: q.high,
                            low: q.low,
                            change_pct: q.change_pct,
                            changetype: q.changetype,
                            volume: q.volume,
                            mktcapView: q.mktcapView
                        });
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', err => reject(err));
    });
};

export const handler = async (event) => {
    // Array of the 11 SPDR sector tickers
    const symbols = ['XLC', 'XLY', 'XLP', 'XLE', 'XLF', 'XLV', 'XLI', 'XLB', 'XLRE', 'XLK', 'XLU'];
    
    try {
        // Loop through the symbols and query data for each symbol concurrently
        const symbolPromises = symbols.map(symbol => fetchSymbolData(symbol));
        const results = await Promise.all(symbolPromises);
        
        // Filter out any potential nulls if a request failed or returned empty
        const sectorsData = results.filter(item => item !== null);
        
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sectorsData, null, 2)
        };
        
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message })
        };
    }
};