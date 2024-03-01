import express from "express";
import  blogsRouter from "./routes/blogsRouter.js"

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/blogs", blogsRouter)
app.listen(3000, () => console.log("Server started successfully"));
