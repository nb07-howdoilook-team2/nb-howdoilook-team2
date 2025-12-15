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

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 36979daa1000a9a18019eaa584148840d684e177
