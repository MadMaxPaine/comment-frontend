import React from "react";

const CommentFooter = ({ commentText }) => {
  return (
    <div
      style={{
        width: "400px",
        height: "100px",
        backgroundColor: "#f9f9f9",
        borderRadius: "0 0 15px 15px",
        padding: "10px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        fontSize: "14px",
        color: "#555",
        overflowY: "auto", // Додає вертикальний скролінг
        wordBreak: "break-word", // Запобігає виходу тексту за межі контейнера
      }}
    >
      <p style={{ textAlign: "left", margin: 0 }}>{commentText}</p>
    </div>
  );
};

export default CommentFooter;
