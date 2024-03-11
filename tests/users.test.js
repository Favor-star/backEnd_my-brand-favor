import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../src/server.js";

vi.mock("../models/userModels.js");
vi.mock("../authMiddleware/authenticator.js",(req,res,next)=>{
  
  next();
})
describe("TESING FETCH USERS", () => {
  it("should return users list if the list is found", async () => {
    const result = await request(app).get("/users");
    console.log(result)
    expect(result.statusCode).toBe(200);
  }, 10000);
});
