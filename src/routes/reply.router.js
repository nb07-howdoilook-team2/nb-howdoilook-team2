import express from 'express';
import { ReplyController } from '../controllers/reply.controller.js';

const router = express.Router();
const replyController = new ReplyController();

router.post(
  '/curations/:curationId/comments',
  replyController.createReply
);

router.put(
  '/comments/:commentId',
  replyController.updateReply
);

router.delete(
  '/comments/:commentId',
  replyController.deleteReply
);


export default router;


