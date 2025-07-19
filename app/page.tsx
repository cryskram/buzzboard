"use client";

import Poll from "@/components/Poll";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Link from "next/link";
import { useState } from "react";

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
  const { data, loading } = useQuery(GET_POLLS, {
    fetchPolicy: "network-only",
  });
  const [author, setAuthor] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [add, setAdd] = useState(false); // should change during production
  const [optCount, setOptCount] = useState(1);

  const handleNewOption = () => {
    if (optCount < 6) {
      setOptCount((prev) => (prev = optCount + 1));
    }
    console.log(optCount);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">
            Buzz
            <span className="bg-slate-800 text-slate-200 rounded-xl p-1">
              Board
            </span>
          </h1>
          <button
            onClick={() => setAdd(true)}
            className="bg-slate-400 rounded-2xl text-xl px-4 py-2"
          >
            New Poll
          </button>
        </div>

        {add && (
          <div className="flex flex-col bg-slate-900 rounded-2xl p-4 mt-8 gap-4 transition-all duration-200">
            <input
              className="bg-slate-700 p-2 rounded-xl text-lg outline-none text-white placeholder:text-slate-300"
              type="text"
              placeholder="Enter name(optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              className="bg-slate-700 p-2 rounded-xl text-lg outline-none text-white placeholder:text-slate-300"
              type="text"
              placeholder="What is on your mind?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <label className="mt-4 text-white">Options</label>
              {Array.from({ length: optCount }, (_, idx) => (
                <input
                  className="bg-slate-700 p-2 rounded-xl text-lg outline-none text-white placeholder:text-slate-300"
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {optCount !== 6 ? (
                <button
                  onClick={handleNewOption}
                  className="bg-slate-300 px-4 py-2 rounded-xl font-semibold"
                >
                  + Option
                </button>
              ) : (
                <div></div>
              )}
              <button className="bg-slate-300 px-4 py-2 rounded-xl font-semibold">
                Submit
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4 mt-8">
          {data?.polls.map((poll: any) => (
            <div key={poll.id}>
              <Poll
                author={poll.author}
                options={poll.options}
                question={poll.question}
                createdAt={parseInt(poll.createdAt)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
