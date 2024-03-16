import { query } from "express";
import ContactMe from "../models/contactMeModels.js";
export async function contactMe(req, res) {
  try {
    const contactMe = await ContactMe.create(req.body);
    res.status(200).send({
      OK: true,
      message: "Message sent successfully! We will reach to you very soon.",
    });
  } catch (error) {
    res.status(500).send({
      OK: false,
      message: "Unexpected error. Please try again!",
      errorMessage: error.message,
    });
  }
}

export async function getContactedPeople(req, res) {
  const questions = await ContactMe.find({});
  if (!questions) {
    return res.status(200).send({
      OK: false,
      message: "Contact forms not found",
    });
  }
  if (questions.length === 0) {
    return res.status(200).send({
      OK: false,
      message: "No contacts  people were found",
    });
  }
  res.status(200).send({
    OK: true,
    message: "Contacted people were succesfully found!",
    contactedUsers: questions,
  });
}
