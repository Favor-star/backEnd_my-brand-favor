import express from "express";
import blogsRouter from "./routes/blogsRouter.js";
import usersRouter from "./routes/usersRouter.js";
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
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => console.log("Server started successfully"));
    console.log("Database connected successfully");
  })
  .catch((error) => console.error(error));
