import Story from "../models/storyModels.js";

export async function getStories(req, res) {
  try {
    const stories = await Story.find({});
    res.status(200).json(stories);
  } catch (error) {
    res
      .status(500)
      .json({
        OK: false,
        message: "unexpecte error. Please try again!",
        errorMessage: error.message,
      });
  }
}
export async function getSingleStory(req, res) {
  const { id } = req.params;
  // const foundStory = stories.find((story) => story.storyID === id);
  // res.send(foundStory);
  try {
    const story = await Story.findById(id);
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createStory(req, res) {
  // const { storyContent, storyTitle, storyImageURL, storyCategory } = req.body;
  const story = { ...req.body };
  try {
    const newStory = await Story.create(story);
    res.status(200).json(newStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateStory(req, res) {
  const { id } = req.params;
  const updatedStoryData = req.body;
  try {
    const updatedStory = await Story.findOneAndUpdate(
      { _id: id },
      updatedStoryData,
      { new: true }
    );
    if (!updateStory) {
      res.status(404).send({ OK: false, message: "Story not found" });
    }
    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(404).send({ OK: false, message: "Unexpected erros occurred" });
  }
}

export async function deleteStory(req, res) {
  const { id } = req.params;
  try {
    const storyToDelete = await Story.findByIdAndDelete(id);
    if (!storyToDelete) {
      return res.status(404).send({ OK: false, message: "Story not found" });
    } else
      return res
        .status(200)
        .json({ OK: true, message: "Story deleted successfully" });
  } catch (error) {
    res.status(400).send({
      OK: false,
      message: "Unexpected error. Please try again",
      errorMessage: error.message,
    });
  }
}
