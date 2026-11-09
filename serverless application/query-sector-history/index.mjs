import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "SectorQuotes";

export const handler = async (event) => {
    // Extract query parameters from API Gateway (e.g., ?symbol=XLK&startDate=2026-01-01&endDate=2026-11-08)
    const queryParams = event.queryStringParameters || {};
    const { symbol, startDate, endDate } = queryParams;

    if (!symbol) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Missing required query parameter: 'symbol' (e.g., ?symbol=XLK)" })
        };
    }

    try {
        let keyConditionExpression = "#sym = :symVal";
        let expressionAttributeNames = {
            "#sym": "symbol",
            "#dt": "date"
        };
        let expressionAttributeValues = {
            ":symVal": symbol.toUpperCase()
        };

        // Handle optional date range filtering using the Sort Key ('date')
        if (startDate && endDate) {
            keyConditionExpression += " AND #dt BETWEEN :startDate AND :endDate";
            expressionAttributeValues[":startDate"] = startDate;
            expressionAttributeValues[":endDate"] = endDate;
        } else if (startDate) {
            keyConditionExpression += " AND #dt >= :startDate";
            expressionAttributeValues[":startDate"] = startDate;
        } else if (endDate) {
            keyConditionExpression += " AND #dt <= :endDate";
            expressionAttributeValues[":endDate"] = endDate;
        }

        const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ScanIndexForward: true // true sorts records chronologically (oldest to newest)
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: symbol.toUpperCase(),
                count: response.Items.length,
                data: response.Items
            }, null, 2)
        };

    } catch (e) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: e.message })
        };
    }
};