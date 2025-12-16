import express from "express";
import { popularTagsController } from "../controllers/tag.controller.js";

const tagRouter = express.Router();

tagRouter.get("/", popularTagsController);

export default tagRouter;
