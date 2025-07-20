"use client";

import Loader from "@/components/Loader";
import Poll from "@/components/Poll";
import { GET_POLLS, CREATE_POLL } from "@/lib/operations";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineAddCircleOutline } from "react-icons/md";

export default function Homepage() {
  const { data, loading, refetch } = useQuery(GET_POLLS);
  const [createPoll] = useMutation(CREATE_POLL);

  const [author, setAuthor] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [add, setAdd] = useState(false);
  const [voterId, setVoterId] = useState<string>("");
  const [createLoad, setCreateLoad] = useState(false);

  useEffect(() => {
    let existingId = localStorage.getItem("voter-id");
    if (!existingId) {
      existingId = crypto.randomUUID();
      localStorage.setItem("voter-id", existingId);
    }
    setVoterId(existingId);
  }, []);

  const handleNewOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    const filteredOptions = options.filter((opt) => opt.trim() !== "");
    if (!question.trim() || filteredOptions.length < 2) {
      alert("Please enter a question and at least 2 options.");
      return;
    }

    try {
      setCreateLoad(true);
      await createPoll({
        variables: {
          question,
          author,
          options: filteredOptions,
        },
      });

      setQuestion("");
      setAuthor("");
      setOptions([""]);
      setAdd(false);
      setCreateLoad(false);
      refetch();
      toast.success("Poll created successfully");
    } catch (err) {
      console.error("Poll creation failed", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="font-bold text-3xl">
            Buzz
            <span className="bg-slate-800 text-slate-200 rounded-xl p-1">
              Board
            </span>
          </Link>
          <button
            onClick={() => setAdd(true)}
            className="bg-slate-800 text-white rounded-2xl inline-flex items-center gap-2 px-4 py-2"
          >
            <MdOutlineAddCircleOutline size={20} /> New Poll
          </button>
        </div>

        {loading && (
          <div className="mt-10">
            <Loader />
          </div>
        )}

        {add && (
          <div className="flex flex-col bg-slate-900 rounded-2xl p-4 mt-8 gap-4 transition-all duration-200 w-full">
            <input
              className="bg-slate-700 px-4 py-3 rounded-xl outline-none text-white placeholder:text-slate-300"
              type="text"
              placeholder="Author name(optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              className="bg-slate-700 px-4 py-3 rounded-xl outline-none text-white placeholder:text-slate-300"
              type="text"
              placeholder="What is on your mind?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <label className="mt-4 text-white">Options</label>
              {options.map((opt, idx) => (
                <input
                  key={idx}
                  className="bg-slate-700 px-4 py-3 rounded-xl outline-none text-white placeholder:text-slate-300"
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {options.length < 6 ? (
                <button
                  onClick={handleNewOption}
                  className="bg-slate-300 px-4 py-2 rounded-xl font-semibold inline-flex gap-1 items-center"
                >
                  <MdOutlineAddCircleOutline size={20} /> Option
                </button>
              ) : (
                <div></div>
              )}
              <button
                onClick={handleSubmit}
                className="bg-slate-300 px-4 py-2 rounded-xl font-semibold disabled:bg-slate-500"
                disabled={createLoad}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-8 w-full">
          {data?.polls.map((poll: any) => (
            <Poll key={poll.id} poll={poll} currentUserId={voterId} />
          ))}
        </div>
      </div>
    </div>
  );
}
