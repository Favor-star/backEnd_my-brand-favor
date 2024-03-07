import Users from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getUsers(req, res) {
  try {
    const users = await Users.find({});
    res.json(users);
  } catch (error) {
    res.send({ message: error.message });
  }
}
export async function registerUser(req, res) {
  const { firstName, lastName, password, email } = req.body;

  const userExists = await Users.findOne({ email: email });
  if (userExists) {
    return res.status(400).send({
      OK: false,
      message: "User already exists",
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!hashedPassword)
    return res.status(403).send({
      OK: false,
      message: "The password couldn't be processed effectively",
    });
  const userToAdd = { firstName, lastName, email, password: hashedPassword };

  try {
    const user = await Users.create(userToAdd);
    res.status(200).send(user);
  } catch (error) {
    res.send({ OK: false, message: "User could not be created" });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const updatedData = { ...req.body };
  try {
    const userToUpdate = await Users.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!userToUpdate) {
      return res.status(400).send({ OK: false, message: "User not found" });
    }
    res.status(200).json(userToUpdate);
  } catch (error) {
    res
      .status(404)
      .send({ OK: false, message: "Internal server error. Please try again." });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const userToDelete = await Users.findByIdAndDelete(id);
    if (!userToDelete) {
      return res.status(400).send({ OK: false, message: "User was not found" });
    }
    res.status(200).json({ OK: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(404)
      .send({ OK: false, message: "Internal Server error. Please try again." });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const userFound = await Users.findOne({ email: email });
  if (!userFound) {
    return res.status(400).send({
      OK: false,
      message: "User is not found",
    });
  }
  const isLoginValid = bcrypt.compareSync(password, userFound.password);
  if (!isLoginValid) {
    return res.status(404).send({
      OK: false,
      message: "Invalid Password",
    });
  }
  const accessToken = jwt.sign({ email }, process.env.AUTH_SECRET);
  res.send({
    OK: true,
    message: "User logged in successfully",
    accessToken,
  });
}
