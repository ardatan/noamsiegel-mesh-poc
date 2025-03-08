import { defineConfig } from "@graphql-hive/gateway";

// Function to fetch the OAuth token (replace with your actual OAuth logic)
async function getTravelportToken(): Promise<string> {
    // Load environment variables
    const clientId = process.env.TRAVELPORT_PROD_CLIENT_ID!;
    const clientSecret = process.env.TRAVELPORT_PROD_CLIENT_SECRET!;
    const oauthUrl = process.env.TRAVELPORT_PROD_OAUTH_URL!;
    const username = process.env.TRAVELPORT_PROD_USERNAME!;
    const password = process.env.TRAVELPORT_PROD_PASSWORD!;

    console.log("Attempting to fetch OAuth token from:",oauthUrl ? "****" : "MISSING");
    console.log("Using client ID:",clientId ? "****" : "MISSING");
    console.log("Using username:",username ? "****" : "MISSING");

    if (!oauthUrl) {
        throw new Error("Missing OAuth URL");
    }

    const oauthPayload = {
        grant_type: "password",
        username,
        password,
        client_id: clientId,
        client_secret: clientSecret,
    };

    const tokenResponse = await fetch(oauthUrl,{
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(oauthPayload),
    });

    const tokenResponseJson = await tokenResponse.json();

    // Check if the response is successful
    if (!tokenResponse.ok) {
        throw new Error(`Failed to get token: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    // Most OAuth implementations return the token directly in the response
    const accessToken = tokenResponseJson.access_token;
    if (!accessToken) {
        throw new Error("No access token received in response");
    }

    return accessToken;
}

const travelportToken = await getTravelportToken();

export const gatewayConfig = defineConfig({
    transportEntries: {
        Travelport: {
            headers: [
                ['Authorization',`Bearer ${travelportToken}`],
            ]
        }
    }
});
