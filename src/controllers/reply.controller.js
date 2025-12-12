import { ReplyService } from '../services/reply.service.js';

export class ReplyController {
  replyService = new ReplyService();

  //댓글등록
  createReply = async (req, res, next) => {
    try {
      const { curationId } = req.params; 
      const { content, password, nickname } = req.body; 

      // Service 계층 호출
      const data = await this.replyService.createReply(
        curationId,
        content,
        password,
        nickname
      );

      // 성공 응답: 200 OK (명세서 기준)
      return res.status(200).json(data);
    } catch (error) {
      // 에러를 다음 미들웨어(errorHandler)로 전달
      next(error);
    }
  };

  //댓글수정
  updateReply = async (req, res, next) => {
    try {
      // Path Parameter: commentId (BigInt)
      const { commentId } = req.params;
      // Request body: { content, password }
      const { content, password } = req.body;

      // Service 계층 호출
      const data = await this.replyService.updateReply(
        commentId,
        content,
        password
      );

      // 성공 응답: 200 OK
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  // 댓글삭제
  deleteReply = async (req, res, next) => {
    try {
      // Path Parameter: commentId (BigInt)
      const { commentId } = req.params;
      // Request body: { password }
      const { password } = req.body;

      // Service 계층 호출
      const message = await this.replyService.deleteReply(
        commentId,
        password
      );

      // 성공 응답: 200 OK
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };
}