import Users from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function getUsers(req, res) {
  //   const { id } = req.params;
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
      status: "Fail",
      message: "User already exists",
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!hashedPassword)
    return res
      .status(403)
      .send({ message: "The password couldn't be processed effectively" });
  const userToAdd = { firstName, lastName, email, password: hashedPassword };

  try {
    const user = await Users.create(userToAdd);
    res.status(200).send(user);
  } catch (error) {
    res.send({ message: error.message });
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
      return res.status(400).send({ message: "User not found" });
    }
    res.status(200).json(userToUpdate);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const userToDelete = await Users.findByIdAndDelete(id);
    if (!userToDelete) {
      return res.status(400).send({ message: "User was not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const userFound = await Users.findOne({ email: email });
  if (!userFound) {
    return res.status(400).send({
      status: "fail",
      message: "User is not found",
    });
  }
  const isLoginValid = bcrypt.compareSync(password, userFound.password);
  if (!isLoginValid) {
    return res.status(404).send({
      status: "fail",
      message: "Invalid Password",
    });
  }
  const accessToken = jwt.sign({ email }, process.env.AUTH_SECRET);
}