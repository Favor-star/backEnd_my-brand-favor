import express from "express";
import blogsRouter from "./routes/blogsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import commentRouter from "./routes/commentsRouter.js";
import contactMeRouter from "./routes/contactMeRouter.js";
// import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    "Access-Control-Allow-Methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
// app.use(bodyParser({ limit: "20mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/blogs", blogsRouter);
app.use("/users", usersRouter);
app.use("/comments", commentRouter);
app.use("/contact-me", contactMeRouter);
app.get("*", (req, res) => {
  res.status(400).send({
    OK: false,
    message: "Route does not exist! Please re-check the route",
  });
});
app.post("*", (req, res) => {
  res.status(400).send({
    OK: false,
    message: "Route does not exist! Please re-check the route",
  });
});
const portNmbr = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(portNmbr, () =>
      console.log(`Server successfully started on port: ${portNmbr}`)
    );
    console.log("Database connected successfully");
  })
  .catch((error) => console.error(error));

export default app;
