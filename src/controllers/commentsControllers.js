import Comments from "../models/commentsModels.js";

export async function getComments(req, res) {
  try {
    const comments = await Comments.find({});
    if (!comments) {
      return res.status(404).send({
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
  const { storyID, comments } = req.body;
  const retrievedComment = comments[0];
  try {
    let existingComment = await Comments.findOne({ storyID: storyID });
    if (existingComment) {
      existingComment.comments.push(retrievedComment);
      await existingComment.save();
      return res.status(200).send({
        OK: true,
        message: "Comment created successfully",
      });
    }
    const comment = await Comments.create({ ...req.body });
    res.status(200).send({
      OK: true,
      message: "New comment was added successfully",
    });
  } catch (error) {
    res.status(500).send({
      OK: false,
      message: "Unexpexted error",
      errorMessage: error.message,
    });
  }
}
export async function getSingleStoryComments(req, res) {
  const { id } = req.params;
  try {
    const singleComment = await Comments.findById(id);
    if (!singleComment) {
      return res.status(404).send({
        OK: false,
        message: "No comment found!",
      });
    }
    res.status(200).send(singleComment);
  } catch (error) {
    res.status(404).send({
      OK: false,
      message: "Comment could not be found! Please try again!",
      errorMessage: error.message,
    });
  }
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  try {
    const comment = await Comments.findByIdAndDelete(id);
    if (!comment) {
      return res
        .status(404)
        .send({ OK: false, message: "Comment could not be found!" });
    }
    res
      .status(200)
      .send({ OK: true, message: "Comment deleted successfully." });
  } catch (error) {
    res.status(500).send({
      OK: false,
      message: "Unexpected error. Please try again!",
      errorMessage: error.message,
    });
  }
}

export async function updateComment(req, res) {
  const { storyID, id } = req.params;
  const { commenter, commentBody } = req.body;
  try {
    const existingComment = await Comments.findOne({ storyID: storyID });
    if (!existingComment) {
      return res.status(404).send({
        OK: false,
        message: "No such story was found",
      });
    }
    const commentToUpdate = existingComment.comments.find((comment) =>
      comment._id.equals(id)
    );
    if (!commentToUpdate)
      return res
        .status(404)
        .send({ Ok: false, message: "No such comment found" });
    if (commenter) commentToUpdate.commenter = commenter;
    if (commentBody) commentToUpdate.commentBody = commentBody;
    await existingComment.save();
    res.status(200).send({
      OK: true,
      message: "Comment updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      OK: false,
      message: "Unexpected error! Please try again.",
      errorMessage: error.message,
    });
  }
}
