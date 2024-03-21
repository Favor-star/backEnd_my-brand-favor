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
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.get("/", (req, res) => {
  res.send("hello");
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Portfolio API documentation",
      version: "1.0.0",
      description:
        "This is a documentation of all APIs that I used during the development of my whole personal portfolio implementation",
      contact: {
        name: "Favour Eliab",
      },
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "Bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
      {
        url: "https://backend-my-brand-favor.onrender.com",
      },
    ],
  },
  schemes: ["http", "https"],
  apis: ["./src/docs/*.yaml"],
};
const swaggerSpec = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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
if(process.env.NODE_ENV !== "test"){
  mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    
    console.log("Database connected successfully");
  })
  .catch((error) => console.error(error));
}
app.listen(portNmbr, () => {
      console.log(`Server successfully started on port: ${portNmbr}`);
    });
export { app };
