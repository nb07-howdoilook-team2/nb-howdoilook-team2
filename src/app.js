import express from "express";
<<<<<<< HEAD
import styleRouter from "./routes/style.router.js";
=======
import styleRouter from "./src/routes/style.router.js";
// src/app.js
import dotenv from "dotenv";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();
>>>>>>> upstream/dev

const app = express();

app.use(express.json());
app.use("/styles", styleRouter);

<<<<<<< HEAD
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

export default app;
=======
const apiPort = process.env.API_PORT || 3000;

app.use(errorHandler);

app.listen(apiPort, () => {
   console.log(`Server running on port ${apiPort}`);
});

//export default app;
>>>>>>> upstream/dev
