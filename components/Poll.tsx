interface PollProp {
  author?: string;
  question: string;
  options: PollOptionProp[];
  createdAt: number;
}

interface PollOptionProp {
  id: string;
  text: string;
  votes: {
    votedAt: string;
    voterId: string;
  }[];
}

const PollOption = ({ text }: { text: string }) => {
  return (
    <div className="bg-slate-200 rounded-xl">
      <h1 className="p-2 text-lg">{text}</h1>
    </div>
  );
};

const Poll = ({ author, question, options, createdAt }: PollProp) => {
  const handleVote = async () => {
    console.log("voted");
  };
  return (
    <div className="flex flex-col bg-slate-300 rounded-2xl p-4">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="text-slate-500 text-sm">~{author}</h1>
        <p className="text-slate-500 text-sm">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <h1 className="text-xl mt-2 font-semibold">{question}</h1>
      <div className="flex flex-col gap-2 mt-4">
        {options.map((option: PollOptionProp) => (
          <div onClick={handleVote} key={option.id}>
            <PollOption text={option.text} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Poll;
