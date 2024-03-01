import { v4 as uuidv4 } from "uuid";

export const stories = [
  {
    storyID: uuidv4(),
    storyTitle: "The blog title",
    storyContent:
      "Lorem ipsum the story geos up here. This story must be long long long",
    storyImageURL: "The image url goes here",
    storyCategory: "Tech",
  },
];
