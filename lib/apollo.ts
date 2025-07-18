import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/grahql",
  cache: new InMemoryCache(),
});

export default client;
