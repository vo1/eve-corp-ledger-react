import { gql, createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const GQLHost = 'http://localhost:4000/';

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

export const GQLGetCorporationMiningObservers = gql`
    query($corporationId: ID!) {
        getCorporationMiningObservers(corporationId: $corporationId) {
            lastUpdated
            observerId
            observerType
            structure {
                name
            }
        }
    }
`;

export const GQLGetSelfWithCorporationMiningObservers = gql`{
    getSelf {
        name
        corporationId
        miningObservers {
            observerId
            lastUpdated
            structure {
                name
            }
        }
    }
}`;


export const GQLGetSelf = gql`{
    getSelf {
        id
        name
        corporationId
    }
}`;

export const GQLGetLoginUrl = gql`
    query($callbackUrl: String!) {
        getLoginUrl(callbackUrl: $callbackUrl)
    }
`;

export const GQLGetCorporationMiningObserverEntries = gql`
    query($corporationId: ID!, $observerId: ID!) {
        getCorporationMiningObserverEntries(corporationId: $corporationId, observerId: $observerId) {
          characterId
          quantity
          typeId
          type {
              name
              volume
              portionSize
          }
          character {
              name
          }
        }
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

export default Client;
