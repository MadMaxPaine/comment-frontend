import React, { useState } from "react";
import { Card, CardContent, Typography, Avatar, Button, Collapse } from "@mui/material";
import { Box } from "@mui/system";

const CommentItem = ({ comment }) => {
  const [open, setOpen] = useState(false);

  // Перевірка на наявність полів
  const userName = comment.anonymousAuthor?.username || "Невідомий користувач"; // Перевірка на наявність автору
  const email = comment.anonymousAuthor?.email || "Немає електронної пошти"; // Перевірка на email
  const commentText = comment.text || "Немає тексту коментаря"; // Перевірка на текст коментаря
  const commentDate = new Date(comment.createdAt).toLocaleString(); // Форматування дати
  const homePage = comment.anonymousAuthor?.homePage || "#"; // Перевірка на homepage (якщо є)

  return (
    <Card sx={{ m: 0.5 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", m: 0.5, p: 1, bgcolor: "primary.main", borderRadius: 1 }}>
          <Avatar sx={{ m: 2 }}>{userName[0]}</Avatar>
          <Box>
            <Typography variant="h6" color="white">{userName}</Typography>
            <Typography variant="body2" color="white">
              Email: <a href={`mailto:${email}`} style={{ color: "inherit" }}>{email}</a>
            </Typography>
            <Typography variant="body2" color="white">
              Homepage: <a href={homePage} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                {homePage}
              </a>
            </Typography>
            <Typography variant="caption" color="white">{commentDate}</Typography>
          </Box>
        </Box>
        <Box sx={{ m: 0.5 }}>
          <Typography sx={{ m: 0.5, mt: 2, ml: 2 }} variant="body1" component="div" dangerouslySetInnerHTML={{ __html: commentText }} />
        </Box>
        {comment.replies && comment.replies.length > 0 && (
          <Button sx={{ ml: 1 }} variant="contained" color="primary" onClick={() => setOpen(!open)}>
            {open ? "Сховати відповіді" : "Показати відповіді"}
          </Button>
        )}
        <Collapse in={open} sx={{ ml: 4 }}>
          {comment.replies?.map((reply, idx) => (
            <CommentItem key={idx} comment={reply} />
          ))}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default CommentItem;
