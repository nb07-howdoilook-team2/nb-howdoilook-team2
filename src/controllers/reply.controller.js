import { ReplyService } from '../services/reply.service.js';

export class ReplyController {
<<<<<<< HEAD
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
=======
  replyService = new ReplyService();

  createReply = async (req, res, next) => {
    try {
      const { curationId } = req.params; 
      const { content, password, nickname } = req.body; 
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177

      const data = await this.replyService.createReply(
        curationId,
        content,
<<<<<<< HEAD
        password
      );

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateReply(req, res, next) {
=======
        password,
        nickname
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateReply = async (req, res, next) => {
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177
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
<<<<<<< HEAD
  }

  async deleteReply(req, res, next) {
=======
  };

  deleteReply = async (req, res, next) => {
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177
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
<<<<<<< HEAD
  }
}
=======
  };
}
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177
