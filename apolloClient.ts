// lib/apolloClient.ts o donde configures el cliente
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react'; // Solo si usas next-auth

const httpLink = new HttpLink({
  uri: 'http://localhost:4000', // tu endpoint de GraphQL
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession(); // ← obtiene el token desde next-auth

  return {
    headers: {
      ...headers,
      Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
