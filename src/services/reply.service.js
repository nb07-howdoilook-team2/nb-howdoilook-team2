import bcrypt from "bcrypt";
import replyRepository from "../repositories/reply.repository.js";
import curationRepository from "../repositories/curation.repository.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../utils/CustomError.js";


const replyService = {
  // 답글 등록 (1개 제한)
  createReply: async ({ curationId, content, password }) => {
    if (!content) throw new ValidationError("답글 내용을 입력해주세요.");
    if (!password) throw new ValidationError("비밀번호를 입력해주세요.");

    // 큐레이션 존재 확인
    const curation = await curationRepository.findById(curationId);
    if (!curation) throw new NotFoundError();

    // 이미 답글이 존재하는지 체크
    const exists = await replyRepository.findByCurationId(curationId);
    if (exists)
      throw new ValidationError("해당 큐레이션에는 이미 답글이 존재합니다.");

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, curation.password);
    if (!isMatch) throw new ForbiddenError("비밀번호가 틀렸습니다.");

    return replyRepository.create({
      content,
      nickname: curation.postNickname, // 답글 닉네임은 큐레이션 작성자
      curationId,
    });
  },

  // 답글 수정
  updateReply: async ({ replyId, content, password }) => {
    if (!password) throw new ValidationError("비밀번호를 입력해주세요.");

    const reply = await replyRepository.findById(replyId);
    if (!reply) throw new NotFoundError();

    const curation = await curationRepository.findById(reply.curationId);
    if (!curation) throw new NotFoundError();

    const isMatch = await bcrypt.compare(password, curation.password);
    if (!isMatch) throw new ForbiddenError();

    return replyRepository.update(replyId, content);
  },

  // 답글 삭제
  deleteReply: async ({ replyId, password }) => {
    if (!password) throw new ValidationError("비밀번호를 입력해주세요.");

    const reply = await replyRepository.findById(replyId);
    if (!reply) throw new NotFoundError();

    const curation = await curationRepository.findById(reply.curationId);

    const isMatch = await bcrypt.compare(password, curation.password);
    if (!isMatch) throw new ForbiddenError();

    return replyRepository.delete(replyId);
  },
};

export default replyService;

//test pull & pr
