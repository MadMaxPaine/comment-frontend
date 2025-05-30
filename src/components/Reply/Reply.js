import React, { useState, useContext } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import FileUploadWithPreview from "./FileUploadWithPreview";
import TextEditorWithTags from "./TextEditorWithTags";
import { validateXHTML } from "../../utils/xhtmlValidator";
import { ctx } from "../../stores/Context.js";
import Captcha from "../Captcha/Captcha.js";
import { marked } from "marked";
import DOMPurify from "dompurify";

const Reply = ({ parentId, sortOption, onSubmit }) => {
  const { comment } = useContext(ctx);
  const { user } = useContext(ctx);
  const [replyText, setReplyText] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [homePage, setHomePage] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false); // Стан CAPTCHA
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaId, setCaptchaId] = useState(null);

  const handleSuccess = (id, input) => {
    setCaptchaInput(input); // Зберігаємо введену відповідь
    setCaptchaId(id); // Зберігаємо id капчі
    setIsCaptchaVerified(true);
  };
  const refreshCaptcha = () => {
    setIsCaptchaVerified(false);
    setCaptchaKey(Date.now()); // Використовуємо зміну ключа, щоб перерендерити компонент CAPTCHA
  };

  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
  };
  const handleTextChange = (newText) => {
    setReplyText(newText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Це додатково, щоб зупинити поширення події

    if (!isCaptchaVerified) {
      setError("CAPTCHA не пройдена.");
      return;
    }

    if (!user._isAuth) {
      if (!replyText.trim() || !userName.trim() || !email.trim()) {
        setError("Всі обов'язкові поля є необхідними.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Некоректний формат email.");
        return;
      }

      if (homePage && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(homePage)) {
        setError("Некоректний формат URL.");
        return;
      }
    }

    const validationResult = validateXHTML(replyText);
    if (validationResult !== "Valid XHTML") {
      setError(validationResult);
      return;
    }

    const formData = new FormData();
    if (parentId !== null && parentId !== undefined) {
      formData.append("parentId", parentId);
    }
    formData.append("text", replyText);
    formData.append("username", user._isAuth ? user._user.name : userName);
    formData.append("email", user._isAuth ? user._user.email : email);
    formData.append(
      "homepage",
      user._isAuth ? user._user.homepage : homePage || ""
    );
    formData.append("file", file || null);
    formData.append("captchaId", captchaId);
    formData.append("captchaInput", captchaInput);

    try {
      await comment.addComment(formData, parentId, sortOption); // Використовуємо метод для відправки
      setReplyText("");
      setUserName("");
      setEmail("");
      setHomePage("");
      setFile(null);
      setError("");
      refreshCaptcha();
      setShowPreview(false);
      onSubmit();
    } catch (error) {
      setError("Error on send comment: " + error);
    }
  };

  const handlePreviewToggle = () => {
    setShowPreview((prev) => !prev);
  };
  const cleanHtml = DOMPurify.sanitize(marked.parse(replyText || ""));
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ m: 0.5, height: "auto" }}
    >
      <Box sx={{ m: 0.5, display: "flex", justifyContent: "space-between" }}>
        {!user._isAuth && (
          <>
            <TextField
              id="userName"
              name="userName"
              label="UserName"
              variant="standard"
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
              sx={{ mt: 1, mb: 0.5, flexBasis: "32%" }}
            />
            <TextField
              id="email"
              name="email"
              label="E-mail"
              variant="standard"
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
              sx={{ mt: 1, mb: 0.5, flexBasis: "32%" }}
            />
            <TextField
              id="homePage"
              name="homePage"
              label="HomePage"
              variant="standard"
              error={
                !!homePage &&
                !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(homePage)
              }
              helperText={
                homePage &&
                !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(homePage)
                  ? "Incorrect format for URL"
                  : ""
              }
              value={homePage}
              autoComplete="url"
              onChange={(e) => setHomePage(e.target.value)}
              sx={{ mt: 1, mb: 0.5, flexBasis: "32%" }}
            />
          </>
        )}
      </Box>
      <Box
        sx={{
          mt: 2,
          m: 0.5,
          p: 0.5,
        }}
      >
        <FileUploadWithPreview onFileUpload={handleFileChange} />
        {file && (
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", m: 0.5, p: 0.5 }}
          >
            File uploaded: {file instanceof File ? file.name : "Resized image"}
          </Typography>
        )}
      </Box>
      {showPreview && (
        <Box
          sx={{
            m: 0.5,
            p: 0.5,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.300",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", m: 0.5, p: 0.5 }}
          >
            Preview:
          </Typography>

          <Box
            className="prose"
            sx={{
              m: 0.5,
              p: 0.5,
              "& p": { m: 0 },
              "& ul": { pl: 3 },
              "& li": { mb: 0.5 },
            }}
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </Box>
      )}
      <TextEditorWithTags text={replyText} onTextChange={handleTextChange} />
      <TextField
        sx={{ m: 0.5, mt: 1, display: "flex" }}
        id="replyText"
        name="replyText"
        label="Text"
        autoComplete="off"
        multiline
        required
        rows={3}
        variant="outlined"
        size="small"
        value={replyText}
        onChange={(e) => handleTextChange(e.target.value)}
      />

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Captcha key={captchaKey} onSuccess={handleSuccess} />
      <Box sx={{ m: 0.5, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          sx={{ m: 0.5, borderRadius: 0 }}
          disabled={!isCaptchaVerified}
        >
          Comment
        </Button>
      </Box>
    </Box>
  );
};

export default Reply;
