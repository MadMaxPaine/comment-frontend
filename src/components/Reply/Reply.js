import React, { useState, useContext } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import FileUploadWithPreview from "./FileUploadWithPreview";
import TextEditorWithTags from "./TextEditorWithTags";
import { validateXHTML } from "../../utils/xhtmlValidator";
import { ctx } from "../../store/Context";

//import CommentStore from "../../store/CommentStore";

const Reply = ({ parentId, onAddReply }) => {
  const { comment } = useContext(ctx);
  const { user } = useContext(ctx);
  const [replyText, setReplyText] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [homePage, setHomePage] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null); // Стан для збереження файлу

  // Функція, що буде викликатися з дочірньої компоненти
  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile); // Оновлення стану файлу
    console.log("Received file from child:", uploadedFile);
  };
  const handleTextChange = (newText) => {
    setReplyText(newText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user._isAuth) {
      // Перевіряємо, чи заповнені обов'язкові поля
      if (!replyText.trim() || !userName.trim() || !email.trim()) {
        setError("Всі обов'язкові поля є необхідними.");
        return;
      }

      // Перевірка на коректність email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Некоректний формат email.");
        return;
      }

      // Перевірка на коректність URL (якщо він введений)
      if (homePage && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(homePage)) {
        setError("Некоректний формат URL.");
        return;
      }
    }
    // Перевірка на правильність XHTML
    const validationResult = validateXHTML(replyText);
    if (validationResult !== "Valid XHTML") {
      setError(validationResult);
      return;
    }

    //console.log(file);
    // Формуємо об'єкт коментаря
    const commentData = {
      text: replyText,
      username: user._isAuth ? user._name : userName,
      email: user._isAuth ? user._user.mail : email,
      homepage: user._isAuth ? user._user.homepage : homePage ? homePage : null, // якщо є
      file: file || null, // якщо є файл
    };

    try {
      console.log(commentData);
      await comment.addComment(commentData); // Викликаємо store

      setReplyText("");
      setUserName("");
      setEmail("");
      setHomePage("");
      setFile(null);
      setError("");
    } catch (error) {
      setError("Помилка при відправці коментаря." + error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ m: 0.5, /* width: "700px",*/ height: "auto" }}
    >
      <Box
        sx={{
          m: 0.5,
          display: "flex", // Встановлюємо контейнер як flexbox
          justifyContent: "space-between",
        }}
      >
        {!user._isAuth && (
          <>
            <TextField
              id="userName"
              name="userName"
              label="UserName"
              variant="outlined"
              required
              inputProps={{
                pattern: "^[a-zA-Z0-9]+$",
                title: "Allowed only latin letters and numbers",
              }}
              error={!!userName && !/^[a-zA-Z0-9]+$/.test(userName)}
              helperText={
                userName && !/^[a-zA-Z0-9]+$/.test(userName)
                  ? "Allowed only latin letters and numbers"
                  : ""
              }
              value={userName}
              autoComplete="username"
              onChange={(e) => setUserName(e.target.value)}
              sx={{ mt: 2, mb: 0.5, flexBasis: "32%" }}
            />
            <TextField
              id="email"
              name="email"
              label="E-mail"
              variant="outlined"
              required
              error={!!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              helperText={
                email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Incorrect format for email"
                  : ""
              }
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2, mb: 0.5, flexBasis: "32%" }}
            />
            <TextField
              id="homePage"
              name="homePage"
              label="HomePage"
              variant="outlined"
              error={
                !!homePage &&
                !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(homePage)
              } // Валідація URL
              helperText={
                homePage &&
                !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(homePage)
                  ? "Incorrect format for URL"
                  : ""
              }
              value={homePage}
              autoComplete="url"
              onChange={(e) => setHomePage(e.target.value)}
              sx={{ mt: 2, mb: 0.5, flexBasis: "32%" }}
            />
          </>
        )}
      </Box>
      <div>
        {/* Передаємо onFileUpload як пропс в дочірню компоненту */}
        <FileUploadWithPreview onFileUpload={handleFileChange} />
        {file && <div>File uploaded: {file.name}</div>}
      </div>
      {/* Передаємо функцію handleTextChange і replyText в TextEditorWithTags */}
      <TextEditorWithTags text={replyText} onTextChange={handleTextChange} />

      <TextField
        sx={{ m: 0.5, mt: 2, display: "flex" }}
        id="replyText"
        name="replyText"
        label="Text"
        autoComplete="off"
        multiline
        required
        rows={4}
        variant="outlined"
        value={replyText}
        onChange={(e) => handleTextChange(e.target.value)}
      />

      {/* Виводимо помилку, якщо є */}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Box
        sx={{
          m: 0.5,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            m: 0.5,
          }}
        >
          Comment
        </Button>
      </Box>
    </Box>
  );
};

export default Reply;
