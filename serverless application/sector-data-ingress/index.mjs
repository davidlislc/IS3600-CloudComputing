import https from 'https';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "SectorQuotes";

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
                        const now = new Date();
                        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD for Sort Key
                        
                        resolve({
                            symbol: q.symbol,             // Partition Key
                            date: dateStr,                // Sort Key
                            name: q.name,
                            previous_day_closing: q.previous_day_closing,
                            last: q.last,
                            open: q.open,
                            high: q.high,
                            low: q.low,
                            change_pct: q.change_pct,
                            changetype: q.changetype,
                            volume: q.volume,
                            mktcapView: q.mktcapView,
                            timestamp: now.toISOString()  // Exact execution timestamp
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
        // Query all 11 symbols concurrently
        const symbolPromises = symbols.map(symbol => fetchSymbolData(symbol));
        const results = await Promise.all(symbolPromises);
        
        // Filter out any potential nulls if a request failed or returned empty
        const sectorsData = results.filter(item => item !== null);
        
        if (sectorsData.length > 0) {
            // Map the sector records into DynamoDB WriteRequests (max 25 items per batch)
            const writeRequests = sectorsData.map(record => ({
                PutRequest: {
                    Item: record
                }
            }));

            // DynamoDB BatchWrite limit is 25 items per request. 
            // Since we have 11 items, we can send them all in a single batch chunk.
            const command = new BatchWriteCommand({
                RequestItems: {
                    [TABLE_NAME]: writeRequests
                }
            });

            await docClient.send(command);
        }
        
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Successfully batch written sector quotes to DynamoDB",
                count: sectorsData.length,
                data: sectorsData
            }, null, 2)
        };
        
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message })
        };
    }
};