"use client";

import client from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";

export function Provider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
