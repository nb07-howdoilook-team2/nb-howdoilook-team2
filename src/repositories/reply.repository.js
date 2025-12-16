
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
