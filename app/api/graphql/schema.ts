import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Poll {
    id: ID!
    author: String
    question: String!
    createdAt: String!
    options: [Option!]!
  }

  type Option {
    id: String!
    text: String!
    votes: [Vote!]!
  }

  type Vote {
    id: ID!
    pollId: String!
    optionId: String!
    voterId: String!
    votedAt: String
  }

  type Query {
    polls: [Poll!]!
    poll(id: ID!): Poll
  }

  type Mutation {
    createPoll(question: String!, author: String, options: [String!]!): Poll!
    vote(pollId: ID!, optionId: String!, voterId: String!): Vote!
    deletePoll(id: ID!): Poll
  }
`;
