import {
  DELETE_POLL_MUTATION,
  GET_POLLS,
  VOTE_MUTATION,
} from "@/lib/operations";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { MdDelete, MdOutlineContentCopy } from "react-icons/md";

interface PollProps {
  poll: {
    id: string;
    author?: string;
    question: string;
    createdAt: string;
    options: {
      id: string;
      text: string;
      votes: {
        voterId: string;
        votedAt: string;
      }[];
    }[];
  };
  currentUserId: string;
}

const PollOption = ({
  text,
  voteCount,
  totalVotes,
  isVoted = false,
  showPercentage = false,
}: {
  text: string;
  voteCount: number;
  totalVotes: number;
  isVoted?: boolean;
  showPercentage: boolean;
}) => {
  const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

  return (
    <div className="relative w-full rounded-xl bg-slate-200 overflow-hidden cursor-pointer">
      {showPercentage && (
        <div
          className={`absolute inset-0 h-full transition-all duration-300 ease-in-out ${
            isVoted ? "bg-slate-800" : "bg-slate-400"
          }`}
          style={{ width: `${percentage}%`, zIndex: 0 }}
        />
      )}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 text-sm font-medium gap-4">
        <span
          className={`break-words ${
            isVoted && showPercentage
              ? "text-white font-semibold"
              : "text-slate-800"
          }`}
        >
          {text}
        </span>
        {showPercentage && (
          <span
            className={`${
              isVoted ? "text-white" : "text-slate-700"
            } whitespace-nowrap`}
          >
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};

const Poll = ({ poll, currentUserId }: PollProps) => {
  const [vote] = useMutation(VOTE_MUTATION);
  const [deletePoll, { loading, error }] = useMutation(DELETE_POLL_MUTATION, {
    variables: { id: poll.id },
    onCompleted: (data) => {
      window.location.reload();
      console.log("Poll deleted:", data.deletePoll);
    },
  });
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePoll();
    } catch (e) {
      console.error("Error deleting poll:", e);
    }
  };

  const handleShare = () => {
    window.navigator.clipboard.writeText(
      `${
        process.env.NODE_ENV === "production"
          ? "https://buzzboard.vercel.app"
          : "http://localhost:3000"
      }/${poll.id}`
    );
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const storedVotes = localStorage.getItem("votedPolls");
    if (storedVotes) {
      const parsedVotes = JSON.parse(storedVotes);
      if (parsedVotes[poll.id]) {
        setVotedOptionId(parsedVotes[poll.id]);
      }
    }
  }, [poll.id]);

  const totalVotes = poll.options.reduce(
    (acc, opt) => acc + opt.votes.length,
    0
  );
  const showPercentages = !!votedOptionId;

  const handleVote = async (optionId: string) => {
    if (votedOptionId) return;

    try {
      await vote({
        variables: {
          pollId: poll.id,
          optionId,
          voterId: currentUserId,
        },
        refetchQueries: [{ query: GET_POLLS }],
      });

      const stored = localStorage.getItem("votedPolls");
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[poll.id] = optionId;
      localStorage.setItem("votedPolls", JSON.stringify(parsed));
      setVotedOptionId(optionId);
    } catch (e: any) {
      console.error("Vote failed:", e.message);
    }
  };

  return (
    <div className="flex flex-col bg-slate-50 rounded-2xl p-4">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="text-slate-500 text-sm">
          ~{poll.author || "Anonymous"}
        </h1>
        <p className="text-slate-500 text-sm">
          {new Date(parseInt(poll.createdAt)).toLocaleDateString()}
        </p>
      </div>

      <h1 className="text-xl mt-2 font-semibold">{poll.question}</h1>

      {votedOptionId && (
        <p className="text-sm text-slate-500">You have already voted</p>
      )}

      <div className="flex flex-col gap-3 mt-4">
        {poll.options.map((option) => {
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
                showPercentage={showPercentages}
              />
            </div>
          );
        })}

        <div className="flex justify-between items-center mt-2">
          {votedOptionId ? (
            <p className="text-sm text-slate-600">Total votes: {totalVotes}</p>
          ) : (
            <div></div>
          )}
          <div className="flex gap-2">
            <button
              className="bg-slate-300 px-4 hover:bg-slate-400 transition duration-150 rounded-full py-2"
              onClick={handleShare}
            >
              {copied ? (
                <FaCopy className="animate-bounce" size={20} />
              ) : (
                <IoShareSocialSharp size={20} />
              )}
            </button>
            {process.env.NODE_ENV === "development" && (
              <button
                className="bg-slate-300 px-4 hover:bg-slate-400 transition duration-150 rounded-full py-2"
                onClick={handleDelete}
              >
                <MdDelete />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poll;
