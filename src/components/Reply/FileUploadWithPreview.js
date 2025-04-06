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
  

  // Очищення файлів і помилок
  const resetFile = () => {
    setFile(null);
    setFileUrl(null);
    setFileContent("");
  };

  // Видалення файлу
  const handleRemoveFile = () => {
    resetFile();
    setError("");
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
    <Box sx={{ m: 0.5 }}>
      <input
        accept="image/jpeg, image/png, image/gif, text/plain"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button sx={{ m: 0}} variant="contained" size="small" component="span">
          Select File
        </Button>
      </label>

      {file && (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleRemoveFile}
          sx={{ m: 0.5 }}
        >
          Remove File
        </Button>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {fileUrl && (
        <Box sx={{ m: 0.5 }}>
          <Typography sx={{ m: 0.5 }} variant="body1">
            Image Preview:
          </Typography>
          <img
            src={fileUrl}
            alt="preview"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "320px",
              maxHeight: "240px",
              marginTop: "10px",
              objectFit: "contain",
            }}
          />
        </Box>
      )}

      {fileContent && (
        <Box sx={{ m: 0.5 }}>
          <Typography variant="body1">Text File Content:</Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
              maxHeight: "150px",
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
