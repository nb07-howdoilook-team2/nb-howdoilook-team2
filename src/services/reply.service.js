
import { ReplyRepository } from '../repositories/reply.repository.js';
import { ValidationError, ForbiddenError, NotFoundError } from '../utils/CustomError.js';

import prisma from '../../prisma/prisma.js'; 

export class ReplyService {
  replyRepository = new ReplyRepository();

  createReply = async (curationId, content, password, nickname) => {
    if (!content || !password || !nickname) {
      throw new ValidationError("content, password, nickname은 필수 입력 항목입니다.");
    }
    
    try {
        const curationExists = await prisma.curation.findUnique({
            where: { id: BigInt(curationId) },
        });

        if (!curationExists) {
            throw new NotFoundError("해당 큐레이션 ID를 찾을 수 없습니다.");
        }
    } catch (error) {
        // BigInt 변환 실패 또는 DB 조회 오류 시 404 처리
        if (error instanceof NotFoundError) {
            throw error; 
        }
        // Curation ID 형식이 잘못되었을 때 (ex: 숫자가 아닌 문자열)
        if (error.message.includes('BigInt')) {
            throw new ValidationError("큐레이션 ID 형식이 올바르지 않습니다.");
        }
        // 기타 DB 오류는 다음 단계에서 처리됨
        throw error;
    }


    const createdReply = await this.replyRepository.createReply(
      curationId,
      content,
      password,
      nickname
    );

    return {
      id: createdReply.id.toString(),
      nickname: createdReply.nickname,
      content: createdReply.content,
      createdAt: createdReply.createdAt.toISOString(), 
    };
  };

  updateReply = async (commentId, content, password) => {
    if (!content || !password) {
      throw new ValidationError("content와 password는 필수 입력 항목입니다.");
    }

    const reply = await this.replyRepository.findReplyById(commentId);
    if (!reply) {
      throw new NotFoundError("해당 댓글을 찾을 수 없습니다.");
    }

    if (reply.password !== password) {
      throw new ForbiddenError("비밀번호가 틀려 댓글 수정 권한이 없습니다.");
    }

    const updatedReply = await this.replyRepository.updateReply(commentId, content);

    return {
      id: updatedReply.id.toString(),
      nickname: updatedReply.nickname,
      content: updatedReply.content,
      createdAt: updatedReply.createdAt.toISOString(),
    };
  };

  deleteReply = async (commentId, password) => {
    if (!password) {
      throw new ValidationError("password는 필수 입력 항목입니다.");
    }

    const reply = await this.replyRepository.findReplyById(commentId);
    if (!reply) {
      throw new NotFoundError("해당 댓글을 찾을 수 없습니다.");
    }

    if (reply.password !== password) {
      throw new ForbiddenError("비밀번호가 틀려 댓글 삭제 권한이 없습니다.");
    }

    await this.replyRepository.deleteReply(commentId);

    return "댓글 삭제 성공";
  };
}