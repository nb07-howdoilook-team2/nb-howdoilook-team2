import express from "express";
import styleRouter from "./routes/style.router.js";

const app = express();

app.use(express.json());
app.use("/styles", styleRouter);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

export default app;
