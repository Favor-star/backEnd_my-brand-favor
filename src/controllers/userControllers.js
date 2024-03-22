import Users from "../models/userModels.js";
import bcrypt from "bcrypt";
import createToken from "../authMiddleware/createToken.js";
export async function getUsers(req, res) {
  try {
    const users = await Users.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(404).send({
      OK: false,
      message: "Users could not be found",
      errorMessage: error.message,
    });
  }
}
export async function registerUser(req, res) {
  const { firstName, lastName, password, email } = req.body;

  const userExists = await Users.findOne({ email: email });
  if (userExists) {
    return res.status(409).send({
      OK: false,
      message: "User already exists",
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!hashedPassword)
    return res.status(401).send({
      OK: false,
      message: "The password couldn't be processed effectively",
    });
  const userToAdd = { firstName, lastName, email, password: hashedPassword };

  try {
    const user = await Users.create(userToAdd);
    const accessToken = createToken({ userName: firstName, email });
    res.status(201).send({
      OK: true,
      message: "User created successfully",
      user,
      accessToken,
    });
  } catch (error) {
    res.status(500).send({ OK: false, message: "User could not be created" });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const updatedData = { ...req.body };
  if ("password" in updatedData) {
    updatedData.password = bcrypt.hashSync(updatedData.password, 10);
  }
  try {
    const userToUpdate = await Users.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!userToUpdate) {
      return res.status(404).send({ OK: false, message: "User not found" });
    }
    res.status(202).json({
      OK: true,
      message: "User successfully updated",
      userToUpdate,
    });
  } catch (error) {
    res.status(500).send({
      OK: false,
      message: "Internal server error. Please try again.",
      errorMessage: error.message,
    });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const userToDelete = await Users.findByIdAndDelete(id);
    if (!userToDelete) {
      return res.status(404).send({ OK: false, message: "User was not found" });
    }
    res.status(200).json({ OK: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ OK: false, message: "Internal Server error. Please try again." });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const userFound = await Users.findOne({ email: email });
  if (!userFound) {
    return res.status(404).send({
      OK: false,
      message: "User is not found",
    });
  }
  const isLoginValid = bcrypt.compareSync(password, userFound.password);
  if (!isLoginValid) {
    return res.status(401).send({
      OK: false,
      message: "Password is incorect",
    });
  }
  const accessToken = createToken({ userName: userFound.firstName, email });
  const { firstName, lastName } = userFound;
  res.status(200).send({
    OK: true,
    message: "User logged in successfully",
    user: { firstName, lastName, email },
    accessToken,
  });
}
