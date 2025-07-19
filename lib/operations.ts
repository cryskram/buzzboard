import { gql } from "@apollo/client";

export const CREATE_POLL = gql`
  mutation CreatePoll(
    $question: String!
    $author: String
    $options: [String!]!
  ) {
    createPoll(question: $question, author: $author, options: $options) {
      id
      question
      author
      createdAt
      options {
        id
        text
        votes {
          voterId
          votedAt
        }
      }
    }
  }
`;

export const VOTE_MUTATION = gql`
  mutation Vote($pollId: ID!, $optionId: String!, $voterId: String!) {
    vote(pollId: $pollId, optionId: $optionId, voterId: $voterId) {
      id
      pollId
      optionId
      voterId
    }
  }
`;

export const GET_POLLS = gql`
  query GetPolls {
    polls {
      id
      question
      author
      createdAt
      options {
        id
        text
        votes {
          voterId
          votedAt
        }
      }
    }
  }
`;

export const GET_POLL = gql`
  query GetPoll($id: ID!) {
    poll(id: $id) {
      id
      question
      author
      createdAt
      options {
        id
        text
        votes {
          voterId
          votedAt
        }
      }
    }
  }
`;
