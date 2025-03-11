import { defineConfig } from "@graphql-hive/gateway";

// Function to fetch the OAuth token (replace with your actual OAuth logic)
async function getTravelportToken(): Promise<string> {
  // Load environment variables
  const clientId = process.env.TRAVELPORT_PROD_CLIENT_ID!;
  const clientSecret = process.env.TRAVELPORT_PROD_CLIENT_SECRET!;
  const oauthUrl = process.env.TRAVELPORT_PROD_OAUTH_URL!;
  const username = process.env.TRAVELPORT_PROD_USERNAME!;
  const password = process.env.TRAVELPORT_PROD_PASSWORD!;

  console.log(
    "Attempting to fetch OAuth token from:",
    oauthUrl ? "****" : "MISSING"
  );
  console.log("Using client ID:", clientId ? "****" : "MISSING");
  console.log("Using username:", username ? "****" : "MISSING");

  if (!oauthUrl) {
    console.warn("Missing OAuth URL");
    return "";
  }

  const oauthPayload = {
    grant_type: "password",
    username,
    password,
    client_id: clientId,
    client_secret: clientSecret,
  };

  const tokenResponse = await fetch(oauthUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(oauthPayload),
  });

  const tokenResponseJson = await tokenResponse.json();

  // Check if the response is successful
  if (!tokenResponse.ok) {
    console.warn(
      `Failed to get token: ${tokenResponse.status} ${tokenResponse.statusText}`
    );
    return "";
  }

  // Most OAuth implementations return the token directly in the response
  const accessToken = tokenResponseJson.access_token;
  if (!accessToken) {
    console.warn("No access token received in response");
    return "";
  }

  return accessToken;
}

const travelportToken = await getTravelportToken();

export const gatewayConfig = defineConfig({
  transportEntries: {
    Travelport: {
      headers: [["Authorization", `Bearer ${travelportToken}`]],
    },
  },
  graphiql: {
    defaultQuery: /* GraphQL */ `
      query MyExampleQuery {
        getWeather(
          latitude: [52.54]
          longitude: [13.41]
          current: "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m"
          hourly: "temperature_2m,precipitation"
          daily: "weather_code,temperature_2m_max,temperature_2m_min"
        ) {
          latitude
          longitude
          timezone
          current {
            temperature_2m
            wind_speed_10m
          }
        }
      }
    `,
  },
});
