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
                        field: 'searchHotels',
                        path: '/searchcomplete',
                        method: 'POST',
                        requestTypeName: 'CoordinatesHotelSearchRequest',
                        requestSchema: './travelport/models/coordinates/request_schema.json',
                        responseSchema: './travelport/models/coordinates/response_schema.json',
                    }
                ],
            }),
        },
    ]
})
