import prisma from "../../prisma/prisma.js";

export class Reply {
  constructor(id, content, nickname, curationId, createdAt) {
    this.id = id;
    this.content = content;
    this.nickname = nickname;
    this.curationId = curationId;
    this.createdAt = createdAt;
  }
}

const replyRepository = {
  findByCurationId: async (curationId) => {
    return prisma.reply.findFirst({
      where: { curationId },
    });
  },

  create: async ({ content, nickname, curationId }) => {
    return prisma.reply.create({
      data: { content, nickname, curationId },
    });
  },

  update: async (id, content) => {
    return prisma.reply.update({
      where: { id },
      data: { content },
    });
  },

  delete: async (id) => {
    return prisma.reply.delete({
      where: { id },
    });
  },

  findById: async (replyId) => {
    return prisma.reply.findUnique({
      where: { id: replyId },
    });
  },
};

export default replyRepository;
