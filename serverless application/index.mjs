import https from 'https';

export const handler = async (event) => {
    // All 11 SPDR sector tickers combined with commas
    const symbols = "XLC,XLY,XLP,XLE,XLF,XLV,XLI,XLB,XLRE,XLK,XLU";
    const url = `https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=${symbols}`;
    
    try {
        const data = await new Promise((resolve, reject) => {
            const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', err => reject(err));
        });
            
        const quoteResults = data?.FormattedQuoteResult?.FormattedQuote;
        if (!quoteResults || quoteResults.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "No symbols found" })
            };
        }
            
        // Map and extract the requested fields for each sector
        const sectorsData = quoteResults.map(q => ({
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
        }));
        
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