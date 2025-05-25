import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";

const FileUploadWithPreview = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState("");

  // Функція для редагування зображення
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);

      img.onload = () => {
        // Перевірка розміру
        if (img.width <= 320 && img.height <= 240) {
          // Якщо зображення вже менше або дорівнює — повертаємо оригінальний файл
          resolve(file);
          return;
        }

        // Масштабування
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const width = 320;
        const height = 240;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), file.type);
      };
    });
  };

  // Обробка зміни файлу
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "text/plain"];

    if (!allowedTypes.includes(fileType)) {
      setError("Allowed formats: JPG, PNG, GIF, or TXT.");
      resetFile();
      return;
    }

    if (fileType === "text/plain" && selectedFile.size > 100 * 1024) {
      setError("Exceeds limit of 100 Kb.");
      resetFile();
      return;
    }

    setError("");
    setFile(selectedFile);
    setFileContent("");

    const objectUrl = URL.createObjectURL(selectedFile);
    setFileUrl(fileType !== "text/plain" ? objectUrl : null);

    if (fileType === "image/jpeg" || fileType === "image/png") {
      // Масштабуємо PNG/JPEG
      const resizedImage = await resizeImage(selectedFile);
      onFileUpload(resizedImage);
    } else if (fileType === "image/gif") {
      // Не чіпаємо GIF — зберігаємо анімацію
      onFileUpload(selectedFile);
    } else if (fileType === "text/plain") {
      // Читаємо текстовий файл
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target.result);
      reader.readAsText(selectedFile);
      onFileUpload(selectedFile);
    }
  };

  // Скидає стан завантаженого файлу та пов’язаних даних
  const resetFile = () => {
    setFile(null); // Обнуляємо файл
    setFileUrl(null); // Видаляємо URL для перегляду зображення
    setFileContent(""); // Очищаємо текстовий вміст
    setError(""); // Очищаємо помилки
  };

  // Обробник кнопки "Видалити"
  const handleRemoveFile = () => {
    resetFile(); // Повністю очищаємо всі дані
    onFileUpload(null);
  };

  // Очищення об'єкта URL, коли файл видаляється
  React.useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 1,

        maxWidth: 400,
      }}
    >
      <input
        accept="image/jpeg, image/png, image/gif, text/plain"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        key={file ? file.name : "file-input"}  // Додаємо key для скидання інпуту
        onChange={handleFileChange}
      />

      <label htmlFor="file-upload">
        <Button
          variant="contained"
          size="small"
          component="span"
          sx={{ borderRadius: 0 }}
        >
          Вибрати файл
        </Button>
      </label>

      {file && (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleRemoveFile}
          sx={{ ml: 1, borderRadius: 0 }}
        >
          Видалити
        </Button>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {fileUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Перегляд зображення:
          </Typography>
          <Box
            component="img"
            src={fileUrl}
            alt="preview"
            sx={{
              width: "100%",
              maxWidth: "100%",
              maxHeight: 240,
              borderRadius: 1,
              objectFit: "contain",
              border: "1px solid",
              borderColor: "grey.300",
            }}
          />
        </Box>
      )}

      {fileContent && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Text file :
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              p: 1.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.300",
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {fileContent}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadWithPreview;
