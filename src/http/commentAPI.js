import { $host, $authhost } from "./index";

export const comments = async function () {
  const { data } = await $host.get("api/comment");
  return data;
};

// У файлі commentAPI.js
export const addComment = async (commentData) => {
  const { data } = await $host.post("api/comments", commentData);
  return data;
};
