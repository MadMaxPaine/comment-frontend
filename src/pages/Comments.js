import React from "react";

import { useContext, useEffect, useState } from "react";
import { ctx } from "../stores/Context";
import {
  CircularProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import CommentItem from "../components/Comment/CommentItem";
import Reply from "../components/Reply/Reply";

const Comments = observer(() => {
  const { comment, socket } = useContext(ctx);
  const [sortOption, setSortOption] = useState("createdAt-desc"); // Один селект
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  useEffect(() => {
    if (!socket) return; // Якщо немає сокета, не робимо нічого

    //console.log("✅ Socket ID:", socket.id,socket); // Логуємо ID сокета
    socket.emit("joinRoom", "comment-root");
    // Підписка на подію підключення
    socket.on("connect", () => {
      console.log("🟢 Socket connected");
    });

    // Підписка на подію відключення
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    // Підписка на подію отримання нового коментаря
    socket.on("receiveNewComment", (comet) => {
      console.log("New comment received:", comet);
      // Обробка отриманого коментаря (наприклад, додаємо його до коментарів)
      // Перевіряємо, чи є replies, якщо немає - ініціалізуємо масив
      if (!comet.replies) {
        comet.replies = [];
      }

      comment.addReplyToComment(comet.parentId, comet);
    });

    // Очистка при розмонтуванні компонента (відписка від подій)
    return () => {
      if (socket) {
        socket.emit("leave", "comment-root"); // 🔥 обовʼязково відписка
        socket.off("connect"); // Відписуємо від події "connect"
        socket.off("disconnect"); // Відписуємо від події "disconnect"
        socket.off("receiveNewComment"); // Відписуємо від події "receiveNewComment"
      }
    };
  }, [socket, comment]);
  // Завантаження коментарів при зміні сортування або сторінки
  useEffect(() => {
    const [sortBy, sortOrder] = sortOption.split("-");
    comment.fetchComments(comment.page, sortBy, sortOrder);
  }, [sortOption, comment, comment.page]);

  // Обробка зміни сортування
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    comment.setSortOption(event.target.value);
  };

  if (comment.isLoading) {
    return <CircularProgress />;
  }

  const handleShowReplyForm = () => {
    setIsReplyVisible((prevState) => !prevState); // Перемикаємо стан видимості форми
  };
  return (
    <Box sx={{ m: 0.5 }}>
      {/* Селектор для сортування */}
      <FormControl sx={{ m: 0.5, mt: 2 }}>
        <InputLabel id="sort-label">Sorting option</InputLabel>
        <Select
          labelId="sort-label"
          id="sort"
          value={sortOption}
          label="Sorting option"
          onChange={handleSortChange}
          sx={{
            borderRadius: 0,
          }}
        >
          <MenuItem value="createdAt-desc">Creation Date (Descending)</MenuItem>
          <MenuItem value="createdAt-asc">Creation Date (Ascending)</MenuItem>
          <MenuItem value="username-asc">Author (A-Z)</MenuItem>
          <MenuItem value="username-desc">Author (Z-A)</MenuItem>
          <MenuItem value="email-asc">Email (A-Z)</MenuItem>
          <MenuItem value="email-desc">Email (Z-A)</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleShowReplyForm}
          variant="contained"
          sx={{ m: 0.5, borderRadius: 0, width: "100%" }}
        >
          {isReplyVisible ? "Hide Comment Form" : "Comment"}
        </Button>
      </Box>
      {/* Відображаємо компонент Reply тільки якщо isReplyVisible == true */}
      {isReplyVisible && (
        <Reply
          parentId={null}
          sortOption={sortOption}
          onSubmit={() => setIsReplyVisible(false)}
        />
      )}
      {/* Виведення всіх коментарів */}
      {comment.comments.map((rootComment) => (
        <CommentItem key={rootComment.id} commentValue={rootComment} />
      ))}

      {/* Пагінація */}
      {comment.totalPages && comment.totalPages > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1, m: 0.5 }}>
          <Button
            variant="contained"
            onClick={() => comment.changePage(comment.page - 1)}
            disabled={comment.page <= 1}
            sx={{ mr: 2, borderRadius: 0 }}
          >
            Prev
          </Button>
          <Typography variant="body1" sx={{ alignSelf: "center" }}>
            Page {comment.page} of {comment.totalPages}
          </Typography>
          <Button
            variant="contained"
            onClick={() => comment.changePage(comment.page + 1)}
            disabled={comment.page >= comment.totalPages}
            sx={{ ml: 2, borderRadius: 0 }}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
});

export default Comments;
