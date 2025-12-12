import { ReplyRepository } from "../repositories/reply.repository.js";

export class ReplyService {
  replyRepository = new ReplyRepository();

  // ✔ 댓글 생성
  async createReply(curationId, nickname, password, content) {
    const exist = await this.replyRepository.findReplyByCurationId(curationId);
    if (exist) throw new Error("이미 해당 큐레이션에는 댓글이 존재합니다.");

    return await this.replyRepository.createReply(
      curationId,
      nickname,
      password,
      content
    );
  }

  // ✔ 댓글 수정
  async updateReply(replyId, password, content) {
    const reply = await this.replyRepository.findReplyById(replyId);
    if (!reply) throw new Error("댓글이 존재하지 않습니다.");
    if (reply.password !== password) throw new Error("비밀번호가 일치하지 않습니다.");

    return await this.replyRepository.updateReply(replyId, content);
  }

  // ✔ 댓글 삭제
  async deleteReply(replyId, password) {
    const reply = await this.replyRepository.findReplyById(replyId);
    if (!reply) throw new Error("댓글이 존재하지 않습니다.");
    if (reply.password !== password) throw new Error("비밀번호가 일치하지 않습니다.");

    return await this.replyRepository.deleteReply(replyId);
  }
}
