import prisma from '../../prisma/prisma.js'; 

export class ReplyRepository {
  createReply = async (curationId, content, password, nickname) => {
    const createdReply = await prisma.reply.create({
      data: {
        curationId: BigInt(curationId), 
        content,
        password,
        nickname,
      },
    });
    return createdReply;
  };

  findReplyById = async (commentId) => {
    const reply = await prisma.reply.findUnique({
      where: {
        id: BigInt(commentId),
      },
    });
    return reply;
  };

  updateReply = async (commentId, content) => {
    const updatedReply = await prisma.reply.update({
      where: {
        id: BigInt(commentId),
      },
      data: {
        content,
      },
    });
    return updatedReply;
  };

  deleteReply = async (commentId) => {
    const deletedReply = await prisma.reply.delete({
      where: {
        id: BigInt(commentId),
      },
    });
    return deletedReply;
  };
}