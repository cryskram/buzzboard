import gql from "graphql-tag";

export const typeDefs = gql`
  type Poll {
    id: ID!
    question: String!
    author: String
    createdAt: String
    expiresAt: String
    options: [Option!]!
  }

  type Option {
    id: String!
    text: String!
    votes: [Vote!]!
  }

  type Vote {
    voterId: String!
    votedAt: String!
  }

  type Query {
    polls: [Poll!]!
    poll(id: ID!): Poll
  }

  type Mutation {
    createPoll(question: String!, author: String, options: [String!]!): Poll
    vote(pollId: ID!, optionId: String!, voterId: String!): Poll
  }
`;
