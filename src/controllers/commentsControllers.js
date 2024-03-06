import Comments from "../models/commentsModels.js";

export async function getComments(req, res) {
  try {
    const comments = await Comments.find({});
    if (!comments) {
      return res.status(200).send({
        OK: true,
        message: "No comments found.",
      });
    }
    res.status(200).send(comments);
  } catch (error) {
    res.status(400).send({
      OK: false,
      message: "Unexpected error. Please try again!",
    });
  }
}

export async function addComment(req, res) {
  try {
    const comment = await Comments.create({ ...req.body });
    res.status(200).send(comment);
  } catch (error) {
    res.status(500).send({
      OK: false,
      message: "Comment was not added successfully! Please try again.",
    });
  }
}
export async function getSingleComment(req, res) {
  const { id } = req.params;
  try {
    const singleComment = await Comments.findById(id);
    if (!singleComment) {
      res.status(200).send({
        OK: false,
        message: "No such comment found",
      });
    }
    res.status(200).send(singleComment);
  } catch (error) {
    res.status(400).send({
      OK: false,
      message: "Unexpected error. Please try again",
    });
  }
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  try {
    const comment = await Comments.findByIdAndDelete(id);
    res.status
  } catch (error) {
    res.status(400).send({
      OK: false,
      message: "Unexpected error. Please try again!",
    });
  }
}
