import { ReplyService } from "../services/reply.service.js";

const replyService = new ReplyService();

export class ReplyController {
  // 댓글 생성
  createReply = async (req, res, next) => {
    try {
      const { curationId } = req.params;
      const { nickname, password, content } = req.body;

      const reply = await replyService.createReply(
        Number(curationId),
        nickname,
        password,
        content
      );

      return res.status(201).json({
        message: "댓글이 등록되었습니다.",
        reply,
      });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 수정
  updateReply = async (req, res, next) => {
    try {
      const { replyId } = req.params;
      const { password, content } = req.body;

      const reply = await replyService.updateReply(
        Number(replyId),
        password,
        content
      );

      return res.status(200).json({
        message: "댓글이 수정되었습니다.",
        reply,
      });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 삭제
  deleteReply = async (req, res, next) => {
    try {
      const { replyId } = req.params;
      const { password } = req.body;

      await replyService.deleteReply(Number(replyId), password);

      return res.status(200).json({
        message: "댓글이 삭제되었습니다.",
      });
    } catch (err) {
      next(err);
    }
  };
}
