import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Box } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import Reply from "../Reply/Reply";
import { observer } from "mobx-react-lite";
//import { useStore } from "../../store"; // Якщо є кастомний hook для доступу до store
import { ctx } from "../../store/Context";

const { REACT_APP_API_URL } = require("../../utils/consts");

const CommentItem = observer(
  ({ comment, activeCommentId, setActiveCommentId }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    //const [showAddCommentForm, setShowAddCommentForm] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const { comment: commentStore } = useContext(ctx); // Ти можеш використовувати власний хук для доступу до store

    const userName =
      comment.anonymousAuthor?.username ||
      comment.author?.username ||
      "Невідомий користувач";
    const email =
      comment.anonymousAuthor?.email ||
      comment.author?.email ||
      "Немає електронної пошти";
    const commentText = comment.text || "Немає тексту коментаря";
    const commentDate = new Date(comment.createdAt).toLocaleString();
    const homePage =
      comment.anonymousAuthor?.homePage || comment.author?.homePage || "#";
    const avatar = comment.author?.avatar || "";
    const fileUrl = comment.fileUrl || null;
    const isImage =
      fileUrl &&
      ["png", "jpg", "jpeg", "gif"].includes(getFileExtension(fileUrl));
    const isTextFile = fileUrl && getFileExtension(fileUrl) === "txt";

    const getFileExtension = (url) => {
      const parts = url.split(".");
      return parts[parts.length - 1].toLowerCase();
    };

    const handleOpenDialog = (file) => {
      setPreviewFile(file);
      setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const toggleAddCommentForm = () => {
      if (activeCommentId === comment.id) {
        // Закрити форму, якщо вона вже відкрита
        setActiveCommentId(null);
      } else {
        // Відкрити форму для відповіді під цим коментарем
        setActiveCommentId(comment.id);
      }
    };
    const toggleShowReplies = () => {
      // Якщо підкоментарі вже показуються, приховуємо їх, якщо ні - показуємо
      setShowReplies(prevState => !prevState);
      if (!comment.replies || comment.replies.length === 0) {
        // Якщо відповіді ще не завантажено, викликаємо fetchReplies
        commentStore.fetchReplies(comment.id);
      }
      
    };

    const isFormOpen = activeCommentId === comment.id;

    return (
      <>
        <Card sx={{ m: 0.5, p: 0,maxWidth:"700px"}}>
          <CardContent sx={{ m: 1, p: 0.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                m: 0.5,
                p: 1,
                bgcolor: "#522546",
                borderRadius: 4,
              }}
            >
              <Avatar
                sx={{ m: 0.5, width: 48, height: 48 }}
                alt={userName || "User Avatar"}
                src={
                  avatar ? `${REACT_APP_API_URL}uploads/avatars/${avatar}` : ""
                }
              />
              <Box>
                <Typography variant="h6" color="white">
                  {userName}
                </Typography>
                <Typography variant="body2" color="white">
                  Email:{" "}
                  <a href={`mailto:${email}`} style={{ color: "inherit" }}>
                    {email}
                  </a>
                </Typography>
                <Typography variant="body2" color="white">
                  Homepage:{" "}
                  <a
                    href={homePage}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit" }}
                  >
                    {homePage}
                  </a>
                </Typography>
                <Typography variant="caption" color="white">
                  {commentDate}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 1, m: 0.5 }}>
              <Typography
                sx={{ border: 0, borderRadius: 1, p: 0.5 }}
                variant="body1"
                component="div"
                dangerouslySetInnerHTML={{ __html: commentText }}
              />
              {fileUrl && (
                <Box sx={{ mt: 0.5 }}>
                  {isImage && (
                    <Box sx={{ mt: 1, border: 0, borderRadius: 1, p: 0.5 }}>
                      <Typography component="div">Image</Typography>
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
                  )}

                  <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                  >
                    <DialogContent>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                      <Typography variant="h12">Text data:</Typography>
                      <Typography variant="body2">
                        <a
                          href={`${REACT_APP_API_URL}${fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none" }}
                        >
                          Comment.txt
                        </a>
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{ m: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={toggleAddCommentForm}
              >
                Reply
              </Button>
            </Box>

            {isFormOpen && (
              <Box sx={{ mt: 1, p: 1 }}>
                <Reply
                  onClose={() => setActiveCommentId(null)}
                  parentId={comment.id}
                />
              </Box>
            )}
              
          </CardContent>
        </Card>
        {/* Кнопка для показу підкоментарів */}
        <Box sx={{ m: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleShowReplies}
          >
            {showReplies ? "Сховати підкоментарі" : "Показати підкоментарі"}
          </Button>
        </Box>

        {/* Підкоментарі */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                activeCommentId={activeCommentId}
                setActiveCommentId={setActiveCommentId}
              />
            ))}
          </Box>
        )}
      </>
    );
  }
);

export default CommentItem;
