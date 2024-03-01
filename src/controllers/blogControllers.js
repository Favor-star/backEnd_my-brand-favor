import { v4 as uuidv4 } from "uuid";
import { stories } from "../constants/index.js";
import Story from "../models/storyModels.js";

export async function getStories(req, res) {
  try {
    const stories = await Story.find({});
    res.status(200).json(stories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: message.error });
  }
}
export async function getSingleStory(req, res) {
  const { id } = req.params;
  // const foundStory = stories.find((story) => story.storyID === id);
  // res.send(foundStory);
  try {
    const story = await Story.findOne({ storyID: id });
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createStory(req, res) {
  // const { storyContent, storyTitle, storyImageURL, storyCategory } = req.body;
  const story = {
    storyID: uuidv4(),
    ...req.body,
  };
  // stories.push(story);

  try {
    const newStory = await Story.create(story);
    res.status(200).json(newStory);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }

  // return res
  //   .status(200)
  //   .send(
  //     `The story with title: ${req.body.storyTitle} was created successfully`
  //   );
  //       json({ message: "Story created successfully" });
}
export function updateStory(req, res) {
  const { id } = req.params;
  const { storyContent, storyTitle, storyImageURL, storyCategory } = req.body;
  const storyToBeUpdated = stories.find((story) => story.storyID === id);
  console.log(storyToBeUpdated);
  if (storyContent) storyToBeUpdated.storyContent = storyContent;
  if (storyTitle) storyToBeUpdated.storyTitle = storyTitle;
  if (storyImageURL) storyToBeUpdated.storyImageURL = storyImageURL;
  if (storyCategory) storyToBeUpdated.storyCategory = storyCategory;

  res.status(200).send("Story updated successfully");
}
