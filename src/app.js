import express from "express";
import styleRouter from "./src/routes/style.router.js";
// src/app.js
import dotenv from "dotenv";
import { errorHandler } from "./srt/utils/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/styles", styleRouter);

const apiPort = process.env.API_PORT || 3000;

app.use(errorHandler);

app.listen(apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
});

export default app;
