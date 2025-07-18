import { createSchema, createYoga } from "graphql-yoga";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

export const config = {
  api: {
    bodyParser: false,
  },
};

const yoga = createYoga<{ request: NextRequest }>({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response, Request, Headers },
  graphiql: process.env.NODE_ENV === "development",
});

export async function GET(request: NextRequest) {
  return yoga.fetch(request);
}

export async function POST(request: NextRequest) {
  return yoga.fetch(request);
}
