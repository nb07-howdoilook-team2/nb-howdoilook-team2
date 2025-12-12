import express from 'express';
import { ReplyController } from '../controllers/reply.controller.js';

const router = express.Router();
const replyController = new ReplyController();

// 1. 댓글 등록 
router.post(
  '/curations/:curationId/comments',
  replyController.createReply
);

// 2. 댓글 수정
router.put(
  '/comments/:commentId',
  replyController.updateReply
);

// 3. 댓글 삭제 
router.delete(
  '/comments/:commentId',
  replyController.deleteReply
);

export default router;