import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
  names: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  messageBody: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: String,
    default: new Date().toString(),
  },
});

export default new mongoose.model("Contact_Me", contactSchema);
