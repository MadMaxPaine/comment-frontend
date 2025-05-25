import React from "react";
import { Button, Box } from "@mui/material";
import { FormatItalic, FormatBold, Code, Link } from "@mui/icons-material";

const TextEditorWithTags = ({ text, onTextChange }) => {
  const addTag = (tag) => {
    const selectedText = window.getSelection().toString(); // Отримуємо виділений текст
    let newText;

    if (selectedText) {
      // Якщо текст виділений, обгортаємо його в тег
      newText = text.replace(selectedText, `<${tag}>${selectedText}</${tag}>`);
    } else {
      // Якщо текст не виділений, додаємо тег з порожнім місцем
      newText = text + ` <${tag}> </${tag}>`;
    }

    onTextChange(newText); // Оновлюємо текст з тегами
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box
        sx={{
          m: 0.5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => addTag("i")}
          sx={{
            bgcolor: "#1976d2",
            border: 1,
            p: 0.5,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            "&:hover": {
              bgcolor: "#1565c0",
            },
          }}
        >
          <FormatItalic />
        </Button>
        <Button
          variant="contained"
          onClick={() => addTag("strong")}
          sx={{
            bgcolor: "#f44336",
            border: 1,
            p: 0.5,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            "&:hover": {
              bgcolor: "#d32f2f",
            },
          }}
        >
          <FormatBold />
        </Button>
        <Button
          variant="contained"
          onClick={() => addTag("code")}
          sx={{
            bgcolor: "#4caf50",
            border: 1,
            p: 0.5,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            "&:hover": {
              bgcolor: "#388e3c",
            },
          }}
        >
          <Code />
        </Button>
        <Button
          variant="contained"
          onClick={() => addTag("a")}
          sx={{
            bgcolor: "#673ab7",
            border: 1,
            p: 0.5,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            "&:hover": {
              bgcolor: "#5e35b1",
            },
          }}
        >
          <Link />
        </Button>
      </Box>
    </Box>
  );
};

export default TextEditorWithTags;
