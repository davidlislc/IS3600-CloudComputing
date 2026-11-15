# S&P 500 Sector Monitor

A static React dashboard for the 11 SPDR sector ETFs. It requests the most recent 45 calendar days of history for each symbol and shows the latest close, change from the prior close, and a seven-session trend. The next-session estimate extends the average compounded return across seven closes by one session; it is not investment advice or a guaranteed prediction.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
```

The API must permit browser requests from the deployed origin using CORS. Responses should contain an array of records with a date (`date` or `Date`, in ISO format) and a positive closing price (`last`, `close`, `Close`, `adjustedClose`, `adjClose`, or `price`). The array may be wrapped in `data`, `items`, `Items`, `results`, `history`, or a JSON-encoded `body`. When available, `previous_day_closing` is used to calculate daily change; otherwise, the preceding recorded close is used. A failed or unrecognized response is shown as unavailable rather than as fabricated data.

## Deploy to S3

Run `npm run build`, then upload the contents of `dist/` to an S3 bucket configured for static website hosting, with `index.html` as the index document. Grant public read access according to your hosting policy, or serve the bucket through CloudFront. Configure the API's CORS allowed origins to include the website's origin. The application uses relative asset paths and can also be hosted under a subdirectory.
