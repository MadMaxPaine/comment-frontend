import React from "react";
import Reply from "../components/Reply/Reply";
import CommentItem from "../components/Comment/CommentItem";

const testComment = {
  id: 1,
  text: "<p>Це тестовий <strong>коментар</strong> з HTML!</p>",
  createdAt: new Date().toISOString(),
  author: {
    username: "madmax",
    email: "madmax@domain.com",
    homePage: "https://github.com/madmax",
    avatar: "default-avatar.png", // заміни на щось, що реально є в `uploads/avatars/`
  },
  replies: [
    {
      id: 2,
      text: "<p>Це <em>відповідь</em> на перший коментар.</p>",
      createdAt: new Date().toISOString(),
      anonymousAuthor: {
        username: "Гість",
        email: "guest@example.com",
        homePage: "",
      },
      replies: [],
    },
    {
      id: 3,
      text: "<p>Ще одна відповідь без homepage.</p>",
      createdAt: new Date().toISOString(),
      author: {
        username: "user123",
        email: "user123@site.com",
        homePage: "",
        avatar: "",
      },
      replies: [],
    },
  ],
};


export const TestReply = () => {
  return (
    <div>
      <CommentItem key={1} comment={testComment} />

      <Reply />
    </div>
  );
};
export default TestReply;
