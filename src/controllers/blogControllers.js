import { v4 as uuidv4 } from "uuid";
import { stories } from "../constants/index.js";

export function getStories(req, res) {
  res.send(stories);
}
export function getSingleStory(req, res) {
  const { id } = req.params;
  const foundStory = stories.find((story) => story.storyID === id);
  res.send(foundStory);
}

export function createStory(req, res) {
  const { storyContent, storyTitle, storyImageURL, storyCategory } = req.body;
  const story = {
    storyID: uuidv4(),
    ...req.body,
  };
  stories.push(story);
  return res
    .status(200)
    .send(`The story with title: ${storyTitle} was created successfully`);
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
