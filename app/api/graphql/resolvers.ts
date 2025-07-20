import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    polls: async () => {
      const polls = await prisma.poll.findMany({
        orderBy: { createdAt: "desc" },
      });

      const allVotes = await prisma.vote.findMany();

      return polls.map((poll) => ({
        ...poll,
        options: poll.options.map((opt) => ({
          ...opt,
          votes: allVotes.filter(
            (v) => v.pollId === poll.id && v.optionId === opt.id
          ),
        })),
      }));
    },

    poll: async (_: any, { id }: { id: string }) => {
      const poll = await prisma.poll.findUnique({ where: { id } });
      if (!poll) return null;

      const votes = await prisma.vote.findMany({ where: { pollId: id } });

      return {
        ...poll,
        options: poll.options.map((opt) => ({
          ...opt,
          votes: votes.filter((v) => v.optionId === opt.id),
        })),
      };
    },
  },

  Mutation: {
    createPoll: async (
      _: any,
      {
        question,
        author,
        options,
      }: { question: string; author?: string; options: string[] }
    ) => {
      const poll = await prisma.poll.create({
        data: {
          question,
          author,
          options: options.map((text) => ({
            id: crypto.randomUUID(),
            text,
          })),
        },
      });

      return {
        ...poll,
        options: poll.options.map((opt) => ({
          ...opt,
          votes: [],
        })),
      };
    },

    vote: async (
      _: any,
      {
        pollId,
        optionId,
        voterId,
      }: { pollId: string; optionId: string; voterId: string }
    ) => {
      const existing = await prisma.vote.findFirst({
        where: { pollId, voterId },
      });

      if (existing) throw new Error("Already voted");

      const vote = await prisma.vote.create({
        data: {
          pollId,
          optionId,
          voterId,
        },
      });

      return vote;
    },

    deletePoll: async (_: any, { id }: { id: string }) => {
      await prisma.vote.deleteMany({ where: { pollId: id } });

      const delPoll = await prisma.poll.delete({
        where: { id },
      });

      return delPoll;
    },
  },
};
