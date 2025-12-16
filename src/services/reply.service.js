import { ReplyRepository } from "../repositories/reply.repository.js";
import styleRepository from "../repositories/style.repository.js";
import { ValidationError, ForbiddenError, NotFoundError } from "../utils/CustomError.js";
import prisma from "../../prisma/prisma.js";

export class ReplyService {
   replyRepository = new ReplyRepository();

  // 1. 답글 등록 
  createReply = async (curationId, content, password) => {
    if (!content) {
      throw new ValidationError("답글 내용을 입력해주세요.");
    }
    if (!password) {
      throw new ValidationError("비밀번호를 입력해주세요.");
    }

    // 큐레이션 조회
    const curation = await prisma.curation.findUnique({
      where: { id: BigInt(curationId) },
    });

    if (!curation) {
      throw new NotFoundError("큐레이션이 존재하지 않습니다.");
    }

    // 스타일 조회 
    const style = await styleRepository.getFindStyle(curation.styleId);
    if (!style) {
      throw new NotFoundError("스타일이 존재하지 않습니다.");
    }

    // 스타일 비밀번호 검증 
    if (style.password.trim() !== password.trim()) {
      throw new ForbiddenError("비밀번호가 일치하지 않습니다.");
    }

    // 답글 1개 제한
    const exists = await this.replyRepository.findReplyByCurationId(
      BigInt(curationId)
    );
    if (exists) {
      throw new ValidationError("이미 답글이 존재합니다.");
    }

    // 답글 생성
    const reply = await this.replyRepository.createReply(
      BigInt(curationId),
      style.nickname,
      password, 
      content
    );

    return {
      id: reply.id.toString(),
      nickname: reply.nickname,
      content: reply.content,
      createdAt: reply.createdAt,
    };
  };

  // 2. 답글 수정 
  updateReply = async (commentId, content, password) => {
    if (!content) {
      throw new ValidationError("수정할 답글 내용을 입력해주세요.");
    }
    if (!password) {
      throw new ValidationError("비밀번호를 입력해주세요.");
    }
    
    // 1. 답글 조회
    const reply = await this.replyRepository.findReplyById(BigInt(commentId));
    if (!reply) {
      throw new NotFoundError("답글이 존재하지 않습니다.");
    }
    
    // 2. 큐레이션 조회 
    const curation = await prisma.curation.findUnique({
      where: { id: reply.curationId },
    });

    // 3. 스타일 조회
    const style = await styleRepository.getFindStyle(curation.styleId);

    
    // 4. 스타일 비밀번호 검증 
    if (style.password.trim() !== password.trim()) {
      throw new ForbiddenError("비밀번호가 일치하지 않습니다.");
    }

    // 5. 답글 수정
    const updatedReply = await this.replyRepository.updateReply(
      BigInt(commentId),
      content
    );

    // 6. 수정된 답글 정보 반환 (⭐ 오류 수정 부분)
    return {
      id: updatedReply.id.toString(),
      nickname: reply.nickname, // (수정 전에 조회한) 기존 답글의 nickname 사용
      content: updatedReply.content,
      createdAt: updatedReply.createdAt,
    };
  }; // <--- updateReply 함수 종료

  // 3. 답글 삭제
  deleteReply = async (commentId, password) => {
    if (!password) {
      throw new ValidationError("비밀번호를 입력해주세요.");
    }

    // 1. 답글 조회
    const reply = await this.replyRepository.findReplyById(BigInt(commentId));
    if (!reply) {
      throw new NotFoundError("답글이 존재하지 않습니다.");
    }

    // 2. 큐레이션 조회 
    const curation = await prisma.curation.findUnique({
      where: { id: reply.curationId },
    });

    // 3. 스타일 조회
    const style = await styleRepository.getFindStyle(curation.styleId);

    
    // 4. 스타일 비밀번호 검증 
    if (style.password.trim() !== password.trim()) {
      throw new ForbiddenError("비밀번호가 일치하지 않습니다.");
    }

    // 5. 답글 삭제
    await this.replyRepository.deleteReply(BigInt(commentId));

    return "답글이 성공적으로 삭제되었습니다.";
  }
}
