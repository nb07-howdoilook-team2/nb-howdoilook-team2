import express from "express";
import { ReplyController } from "../controllers/reply.controller.js";

const router = express.Router({
   // curationRouter의 :curationId 파라미터를 상속받음
   mergeParams: true,
});
const replyController = new ReplyController();

router.post("/", replyController.createReply);

router.put("/:commentId", replyController.updateReply);

router.delete("/:commentId", replyController.deleteReply);

export default router;
