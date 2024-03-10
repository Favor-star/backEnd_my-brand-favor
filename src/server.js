import express from "express";
import blogsRouter from "./routes/blogsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import commentRouter from "./routes/commentsRouter.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/blogs", blogsRouter);
app.use("/users", usersRouter);
app.use("/comments", commentRouter);
app.get("*", (req, res) => {
  res.status(400).send({
    OK: false,
    message: "Route does not exist! Please re-check the route",
  });
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => console.log("Server started successfully"));
    console.log("Database connected successfully");
  })
  .catch((error) => console.error(error));
  
export default app;
