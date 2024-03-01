import express from "express";
import blogsRouter from "./routes/blogsRouter.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/blogs", blogsRouter);

mongoose
  .connect(
    "mongodb+srv://favoureliab:favour123@cluster0.m4ethje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(3000, () => console.log("Server started successfully"));
    console.log("Database connected successfully");
  })
  .catch((error) => console.error(error));
