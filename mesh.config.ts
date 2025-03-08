import {
    defineConfig,
} from '@graphql-mesh/compose-cli'
import { loadJSONSchemaSubgraph } from '@omnigraph/json-schema';

export const composeConfig = defineConfig({
    subgraphs: [
        {
            sourceHandler: loadJSONSchemaSubgraph('Travelport',{
                endpoint: 'https://api.travelport.com/12/hotel/search/',
                operationHeaders: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'XAUTH_TRAVELPORT_ACCESSGROUP': '{env.TRAVELPORT_PROD_ACCESS_GROUP}'
                },
                operations: [
                    {
                        type: 'Query',
                        field: 'searchHotelsByCoordinates',
                        path: '/searchcomplete',
                        method: 'POST',
                        requestTypeName: 'CoordinatesHotelSearchRequest',
                        requestSchema: './travelport/models/coordinates/request.json',
                        responseSchema: './travelport/models/coordinates/response_schema.json',
                    }
                ],
            }),
        },
        {
            sourceHandler: loadJSONSchemaSubgraph('Weather',{
                endpoint: 'https://api.open-meteo.com/v1/forecast',
                operationHeaders: {
                    'Content-Type': 'application/json',
                },
                operations: [
                    {
                        type: 'Query',
                        field: 'getWeather',
                        path: '/',
                        method: 'GET',
                        requestTypeName: 'getWeather',
                        requestSchema: './weather/schemas/request.json',
                        responseSchema: './weather/schemas/response.json',
                    }
                ],
            }),
        }
    ]
})
