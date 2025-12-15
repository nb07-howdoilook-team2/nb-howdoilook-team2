<<<<<<< HEAD

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class ReplyRepository {
  // 댓글 생성
  async createReply(curationId, nickname, password, content) {
    return await prisma.reply.create({
      data: {
        curationId,
        nickname,
        password,
        content,
      },
    });
  }

  // 특정 큐레이션에 이미 댓글이 있는지 확인(1:1 규칙)
  async findReplyByCurationId(curationId) {
    return await prisma.reply.findUnique({
      where: { curationId },
    });
  }

  // ✔ 댓글 id로 조회
  async findReplyById(id) {
    return await prisma.reply.findUnique({
      where: { id },
    });
  }

  // 댓글 수정
  async updateReply(id, content) {
    return await prisma.reply.update({
      where: { id },
      data: { content },
    });
  }

  // 댓글 삭제
  async deleteReply(id) {
    return await prisma.reply.delete({
      where: { id },
    });
  }
}
=======
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
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177
