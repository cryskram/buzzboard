import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    polls: async () => {
      return await prisma.poll.findMany();
    },

    poll: async (_: any, { id }: { id: string }) => {
      return await prisma.poll.findUnique({ where: { id } });
    },
  },

  Mutation: {
    createPoll: async (
      _: any,
      {
        question,
        options,
        author,
      }: { question: string; options: string[]; author?: string }
    ) => {
      const newPoll = await prisma.poll.create({
        data: {
          question,
          author,
          options: options.map((text) => ({
            id: crypto.randomUUID(),
            text,
            votes: [],
          })),
        },
      });

      return newPoll;
    },

    vote: async (
      _: any,
      {
        pollId,
        optionId,
        voterId,
      }: { pollId: string; optionId: string; voterId: string }
    ) => {
      const poll = await prisma.poll.findUnique({ where: { id: pollId } });

      if (!poll) throw new Error("Poll not found");

      const updatedOptions = poll.options.map((option) => {
        if (option.id === optionId) {
          const alreadyVoted = option.votes.some(
            (vote) => vote.voterId == voterId
          );

          if (alreadyVoted)
            throw new Error("You have already voted on this option");

          return {
            ...option,
            votes: [
              ...option.votes,
              {
                voterId,
                votedAt: new Date(),
              },
            ],
          };
        }
        return option;
      });

      const updatedPoll = await prisma.poll.update({
        where: { id: pollId },
        data: {
          options: updatedOptions,
        },
      });

      return updatedPoll;
    },
  },
};
