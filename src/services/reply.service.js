<<<<<<< HEAD
import { ReplyRepository } from "../repositories/reply.repository.js";
import { getFindStyle } from "../repositories/style.repository.js"; // Style 비밀번호를 가져오는 함수
import { ValidationError, ForbiddenError, NotFoundError } from "../utils/CustomError.js";
import prisma from "../../prisma/prisma.js";


=======

import { ReplyRepository } from '../repositories/reply.repository.js';
import { ValidationError, ForbiddenError, NotFoundError } from '../utils/CustomError.js';

import prisma from '../../prisma/prisma.js'; 
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177

export class ReplyService {
  replyRepository = new ReplyRepository();

<<<<<<< HEAD
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
    const style = await getFindStyle(curation.styleId);
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
    const style = await getFindStyle(curation.styleId);
    
    // 4. 스타일 비밀번호 검증 
    if (style.password.trim() !== password.trim()) {
      throw new ForbiddenError("비밀번호가 일치하지 않습니다.");
    }

    // 5. 답글 수정
    const updatedReply = await this.replyRepository.updateReply(
      BigInt(commentId),
      content
    );
=======
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
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177

    return {
      id: updatedReply.id.toString(),
      nickname: updatedReply.nickname,
      content: updatedReply.content,
<<<<<<< HEAD
      createdAt: updatedReply.createdAt,
    };
  }

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
    const style = await getFindStyle(curation.styleId);
    
    // 4. 스타일 비밀번호 검증 
    if (style.password.trim() !== password.trim()) {
      throw new ForbiddenError("비밀번호가 일치하지 않습니다.");
    }

    // 5. 답글 삭제
    await this.replyRepository.deleteReply(BigInt(commentId));

    return "답글이 성공적으로 삭제되었습니다.";
  }
=======
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
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177
}