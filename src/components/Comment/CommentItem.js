import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Button,
  Collapse,
  Slide,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import { ctx } from "../../stores/Context";
import { observer } from "mobx-react-lite";
import Reply from "../Reply/Reply";
const { REACT_APP_API_URL } = require("../../utils/consts");
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});
const CommentItem = observer(({ commentValue, reText, depth = 1 }) => {
  const { socket, comment } = useContext(ctx);
  const [openReply, setOpenReply] = useState(false);
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxDepth = 10;
  const effectiveDepth = Math.min(depth, maxDepth);
  const paddingLeft = effectiveDepth;
  const getFileExtension = (url) => {
    const parts = url.split(".");
    return parts[parts.length - 1].toLowerCase();
  };

  const fetchReplies = useCallback(
    async (page) => {
      if (loadingReplies) return;

      setLoadingReplies(true);
      try {
        await comment.fetchReplies(commentValue.id, page, 25);
        setCurrentPage((prev) => prev + 1);
      } catch (e) {
        console.error("Error loading replies:", e);
      } finally {
        setLoadingReplies(false);
      }
    },
    [loadingReplies, comment, commentValue.id]
  );

  useEffect(() => {
    if (!socket || !commentValue) return;

    if (openReply) {
      comment.joinCommentRoom(socket, commentValue.id);

      if (!commentValue.replies || commentValue.replies.length === 0) {
        fetchReplies(); // ✅ стабільна функція завдяки useCallback
      }
    } else {
      comment.leaveCommentRoom(socket, commentValue.id);
    }

    return () => {
      if (openReply) {
        comment.leaveNestedCommentRooms(socket, commentValue);
      }
    };
  }, [openReply, commentValue, comment, socket]);

  const handleShowReplyForm = () => {
    setIsReplyVisible((prevState) => !prevState); // Перемикаємо стан видимості форми
  };

  const hasMoreReplies =
    commentValue.totalReplies > commentValue.replies.length;
  const userName =
    //commentValue.anonymousAuthor?.username ||
    commentValue.author?.username || "Невідомий користувач";
  const email =
    //commentValue.anonymousAuthor?.email ||
    commentValue.author?.email || "Немає електронної пошти";
  const commentText = commentValue.text || "Немає тексту коментаря";
  const commentDate = new Date(commentValue.createdAt).toLocaleString();
  const homePage =
    //commentValue.anonymousAuthor?.homePage ||
    commentValue.author?.homePage || "#";
  const avatar = commentValue.author?.avatar || "";
  const fileUrl = commentValue.fileUrl || null;
  const isImage =
    fileUrl &&
    ["png", "jpg", "jpeg", "gif"].includes(getFileExtension(fileUrl));
  const isTextFile = fileUrl && getFileExtension(fileUrl) === "txt";

  const handleOpenDialog = (file) => {
    setPreviewFile(file);
    setOpenDialog(true);
  };

  const handleOpenReply = () => {
    setOpenReply((prev) => !prev);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  // Функція для перемикання стану розгортання
  const toggleText = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <>
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          m: 0.5,
          p: 0.5,
          bgcolor: theme.palette.primary.main, // використовує primary колір з теми
          borderRadius: 0,
        })}
      >
        <Paper
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            p: 0.5,
            borderRadius: "50%",
            ml: 1,
            mr: 2,
          }}
        >
          {commentValue.author ? (
            <Avatar
              sx={{ width: 64, height: 64 }}
              alt={userName || "User Avatar"}
              src={
                avatar ? `${REACT_APP_API_URL}uploads/avatars/${avatar}` : ""
              }
            />
          ) : (
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={userName || "User Avatar"}
              src=""
            />
          )}
        </Paper>
        <Box sx={{ m: 0.5 }}>
          <Typography variant="h7" color="white">
            {commentValue.author ? `${userName}` : `Anonymous`}
          </Typography>
          <Typography variant="body2" color="white">
            {commentValue.author && (
              //Email:{" "}
              <a href={`mailto:${email}`} style={{ color: "inherit" }}>
                {email}
              </a>
            )}
          </Typography>
          <Typography variant="body2" color="white">
            {commentValue.author && (
              //Homepage:{" "}
              <a
                href={homePage}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit" }}
              >
                Homepage: {homePage}
              </a>
            )}
          </Typography>

          <Typography variant="caption" color="white">
            {commentDate}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 1, m: 0.5 }}>
        {commentValue.parentId !== null && (
          <Box sx={{ mt: 1, m: 0.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontStyle: "italic",
                fontSize: "0.95rem",
                color: "#555",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {/* Вертикальна лінія */}
              <Box
                sx={{
                  height: "20px", // Встановлюємо висоту лінії (можна змінити на потрібну)
                  width: "5px", // Ширина лінії
                  backgroundColor: "#555", // Лінійний градієнт, який йде зліва направо
                  borderRadius: 0,
                  mr: 0.5,
                }}
              />
              <Box
                component="span"
                dangerouslySetInnerHTML={{ __html: reText }}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />
            </Box>
          </Box>
        )}

        <Typography
          sx={{
            border: 0,
            borderRadius: 1,
            ml: 0.5,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: isExpanded ? "none" : 3, // Обмежуємо текст 3-ма рядками
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal", // Це дозволить тексту переноситись
            wordBreak: "break-word", // Дозволяє переривати довгі слова
          }}
          variant="body1"
          component="div"
          dangerouslySetInnerHTML={{ __html: commentText }}
        />
        {/* Кнопка "Read more" відображається, якщо текст обмежений */}
        {!isExpanded && commentText.length > 150 && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 0.5, mb: 0.5, p: 0.5, borderRadius: 0 }}
            onClick={toggleText}
          >
            Read more
          </Button>
        )}

        {/* Кнопка "Show less" відображається після натискання "Read more" */}
        {isExpanded && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 0.5, mb: 0.5, p: 0.5, borderRadius: 0 }}
            onClick={toggleText}
          >
            Show less
          </Button>
        )}
        {/* Вертикальна лінія */}
        <Box
          sx={{
            height: "1px", // Встановлюємо висоту лінії (можна змінити на потрібну)
            width: "100%", // Ширина лінії
            backgroundColor: "#ccc", // Лінійний градієнт, який йде зліва направо
            borderRadius: 0,
            mt: 0.5,
          }}
        />
        {fileUrl && (
          <Box sx={{ mt: 0.5 }}>
            {isImage && (
              <Box sx={{ mt: 0.5, border: 0, borderRadius: 1, p: 0.5 }}>
                <Typography component="div" sx={{ m: 0.5, p: 0.5 }}>
                  Image
                </Typography>
                <Box sx={{ m: 0.5, p: 0.5 }}>
                  <img
                    src={`${REACT_APP_API_URL}${fileUrl}`}
                    alt="file preview"
                    style={{
                      maxWidth: "100px",
                      height: "auto",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenDialog(fileUrl)}
                  />
                </Box>
              </Box>
            )}

            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              maxWidth="md"
              fullWidth
              TransitionComponent={Transition} // Використовуємо Transition
            >
              <DialogContent sx={{ p: 0.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    m: 0.5,
                    p: 0.5,
                  }}
                >
                  <img
                    src={`${REACT_APP_API_URL}${previewFile}`}
                    alt="file preview"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>
              </DialogContent>
            </Dialog>
            {isTextFile && (
              <Box sx={{ border: 0, borderRadius: 1, p: 0.5 }}>
                <Typography variant="h12" sx={{ m: 0.5, p: 0.5 }}>
                  Text data:
                </Typography>
                <Typography variant="body2" sx={{ m: 0.5, p: 0.5 }}>
                  <a
                    href={`${REACT_APP_API_URL}${fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Comment.txt
                  </a>
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box sx={{ m: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleShowReplyForm}
            variant="contained"
            sx={{ m: 0.5, borderRadius: 0 }}
          >
            {isReplyVisible ? "Hide Reply Form" : "Reply"}
          </Button>
        </Box>
        {/* Відображаємо компонент Reply тільки якщо isReplyVisible == true */}
        {isReplyVisible && (
          <Reply
            parentId={commentValue.id}
            sortOption={null}
            onSubmit={() => setIsReplyVisible(false)}
          />
        )}
      </Box>
      <Box sx={{ m: 0.5 }}>
        {/* Кнопка для відкриття/закриття відповідей */}
        {commentValue.replies.length >= 0 && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button
              onClick={handleOpenReply}
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 0.5, mb: 0.5, p: 0.5, borderRadius: 0 }}
            >
              {openReply ? "Hide answers" : "Show answers"}
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ pl: effectiveDepth === 10 ? 0 : paddingLeft }}>
        {/* Виведення відповідей */}
        <Collapse in={openReply}>
          {commentValue.replies.map((reply) => (
            <Box key={reply.id}>
              <CommentItem
                commentValue={reply}
                reText={commentValue.text}
                depth={depth + 1}
              />
            </Box>
          ))}
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {/* Кнопка для завантаження ще відповідей */}
            {commentValue.replies.length > 0 && hasMoreReplies && (
              <Button
                variant="contained"
                onClick={() => fetchReplies(currentPage)}
                color="primary"
                fullWidth
                sx={{ mt: 0.5, mb: 0.5, p: 0.5, borderRadius: 0 }}
                disabled={loadingReplies}
              >
                {loadingReplies ? "Loading..." : "Load more"}
              </Button>
            )}
          </Box>
        </Collapse>
      </Box>
    </>
  );
});

export default CommentItem;
