import { ReplyService } from '../services/reply.service.js';

export class ReplyController {
  constructor() {
    this.replyService = new ReplyService();

    // ⭐️ 바인딩 필수
    this.createReply = this.createReply.bind(this);
    this.updateReply = this.updateReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
  }

  async createReply(req, res, next) {
    try {
      const { curationId } = req.params;
      const { content, password } = req.body;

      const data = await this.replyService.createReply(
        curationId,
        content,
        password
      );

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateReply(req, res, next) {
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
  }

  async deleteReply(req, res, next) {
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
  }
}
