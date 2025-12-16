import express from "express";
import { getRankingController } from "../controllers/ranking.controller.js";

const rankingRouter = express.Router();

rankingRouter.get("/", getRankingController);

export default rankingRouter;
