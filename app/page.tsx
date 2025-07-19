"use client";

import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Link from "next/link";

const GET_POLLS = gql`
  query MyQuery {
    polls {
      author
      createdAt
      expiresAt
      id
      options {
        id
        text
        votes {
          votedAt
          voterId
        }
      }
      question
    }
  }
`;

export default function Homepage() {
  // const { data, loading } = useQuery(GET_POLLS, {
  //   fetchPolicy: "network-only",
  // });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h1>
            Buzz<span className="text-yellow-600">Board</span>
          </h1>
          <button className="bg-black rounded-2xl px-6 py-4">+ Add</button>
        </div>
      </div>
    </div>
  );
}
