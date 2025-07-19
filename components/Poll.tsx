import { GET_POLLS, VOTE_MUTATION } from "@/lib/operations";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

interface PollProp {
  author?: string;
  question: string;
  options: PollOptionProp[];
  createdAt: number;
  pollId: string;
  currentUserId: string;
}

interface PollOptionProp {
  text: string;
  voteCount: number;
  totalVotes: number;
  isVoted?: boolean;
}

const PollOption = ({
  text,
  voteCount,
  totalVotes,
  isVoted = false,
}: PollOptionProp) => {
  const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

  return (
    <div className="relative w-full rounded-xl bg-slate-200 overflow-hidden">
      <div
        className={`absolute inset-0 h-full transition-all duration-300 ease-in-out ${
          isVoted ? "bg-slate-800" : "bg-slate-400"
        }`}
        style={{ width: `${percentage}%`, zIndex: 0 }}
      />

      <div className="relative z-10 flex items-center justify-between px-4 py-3 text-sm font-medium gap-4">
        <span
          className={`break-words ${
            isVoted ? "text-white font-semibold" : "text-slate-800"
          }`}
        >
          {text}
        </span>
        <span
          className={`${
            isVoted ? "text-white" : "text-slate-700"
          } whitespace-nowrap`}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

const Poll = ({
  author,
  question,
  options,
  createdAt,
  pollId,
  currentUserId,
}: PollProp) => {
  const [vote] = useMutation(VOTE_MUTATION);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);

  useEffect(() => {
    const storedVotes = localStorage.getItem("votedPolls");
    if (storedVotes) {
      const parsedVotes = JSON.parse(storedVotes);
      if (parsedVotes[pollId]) {
        setVotedOptionId(parsedVotes[pollId]);
      }
    }
  }, [pollId]);

  const totalVotes = options.reduce(
    (acc, opt: any) => acc + opt.votes.length,
    0
  );

  const handleVote = async (optionId: string) => {
    if (votedOptionId) return;

    try {
      await vote({
        variables: {
          pollId: pollId,
          optionId,
          voterId: currentUserId,
        },
        refetchQueries: [{ query: GET_POLLS }],
      });

      const stored = localStorage.getItem("votedPolls");
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[pollId] = optionId;
      localStorage.setItem("votedPolls", JSON.stringify(parsed));
      setVotedOptionId(optionId);
    } catch (e: any) {
      console.error("Vote failed:", e.message);
    }
  };
  return (
    <div className="flex flex-col bg-slate-50 rounded-2xl p-4">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="text-slate-500 text-sm">~{author || "Anonymous"}</h1>
        <p className="text-slate-500 text-sm">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

      <h1 className="text-xl mt-2 font-semibold">{question}</h1>

      <div className="flex flex-col gap-3 mt-4">
        {options.map((option: any) => {
          const isVoted = option.id === votedOptionId;

          return (
            <div
              key={option.id}
              onClick={() => {
                if (!votedOptionId) handleVote(option.id);
              }}
            >
              <PollOption
                text={option.text}
                voteCount={option.votes.length}
                totalVotes={totalVotes}
                isVoted={isVoted}
              />
            </div>
          );
        })}

        {votedOptionId && (
          <p className="text-sm text-slate-600 mt-2">
            Total votes:{" "}
            {options.reduce((acc, opt: any) => acc + opt.votes.length, 0)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Poll;
