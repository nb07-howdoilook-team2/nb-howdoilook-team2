import { ReplyService } from '../services/reply.service.js';

export class ReplyController {
  replyService = new ReplyService();

  createReply = async (req, res, next) => {
    try {
      const { curationId } = req.params; 
      const { content, password, nickname } = req.body; 

      const data = await this.replyService.createReply(
        curationId,
        content,
        password,
        nickname
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateReply = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content, password } = req.body;

      const data = await this.replyService.updateReply(
        commentId,
        content,
        password
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  deleteReply = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { password } = req.body;

      const message = await this.replyService.deleteReply(
        commentId,
        password
      );

      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };
}