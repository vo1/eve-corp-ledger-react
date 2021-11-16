import { gql, createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const GQLHost = process.env.REACT_APP_ESI_GRAPHQL_ADDR;
export const CallbackURL = process.env.REACT_APP_ESI_FRONTEND_CALLBACK;

const httpLink = createHttpLink({ uri: GQLHost });
const authLink = setContext((_, { headers }) => {
    let token = JSON.parse(sessionStorage.getItem('ESIToken'));
    if (token) {
        token = token.accessToken;
    }
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});


const Client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export function isLoggedIn()
{
    let token = JSON.parse(sessionStorage.getItem('ESIToken'));
    if (token && token.accessToken) {
        return true;
    }
    return false;
}

export const GQLMe = gql`{
    me {
        id
        name
        corporationId
        structures {
            name
            fuelExpires
            state
            stateTimerEnd
            services {
                name
                state
            }
            miningExtraction {
                chunkArrivalTime
                naturalDecayTime    
            }
        }
        miningObservers {
            observerId
            lastUpdated
            structure {
                name
            }
        }
    }
}`;

export const GQLGetLoginUrl = gql`
    query($scopes: [String]!, $callbackUrl: String!) {
        loginUrl(scopes: $scopes, callbackUrl: $callbackUrl)
    }
`;

export const GQLGetAuthorizationToken = gql`
    query($code: String!) {
        getAuthorizationToken(code: $code) {
            accessToken
            expires
            expiresIn
            refreshToken
            tokenType
        }
    }
`;

export const GQLGetCorporationMiningObserverEntries = gql`
    query($corporationId: ID!, $observerId: ID!, $dateRange: DateRange) {
        getCorporationMiningObserverEntries(corporationId: $corporationId, observerId: $observerId, dateRange: $dateRange) {
          characterId
          quantity
          typeId
          type {
              id
              name
              volume
              portionSize
              marketGroup {
                  name
              }
          }
          refine {
              quantity
              type {
                  id
                  name
              }
          }
          character {
              name
          }
        }
    }
`;

export default Client;
