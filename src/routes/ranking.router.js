import express from "express";
import { rankingController } from "../controllers/ranking.controller.js";

const rankingRouter = express.Router();

rankingRouter.get("/", rankingController);

export default rankingRouter;
