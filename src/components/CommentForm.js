import React, { useState, useEffect } from "react";
import "../styles/CommentForm.css"; // Імпортуємо CSS файл
// Імпортуємо validateXHTML функцію
import { validateXHTML } from "../utils/xhtmlValidator";

const CommentForm = ({ handleSubmit }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [homePage, setHomePage] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaSession, setCaptchaSession] = useState(""); // Додано для збереження тексту CAPTCHA
  const [textError, setTextError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [homePageError, setHomePageError] = useState("");

  useEffect(() => {
    // Отримуємо зображення CAPTCHA з сервера
    fetch("http://localhost:5000/captcha")
      .then((response) => response.text())
      .then((svg) => {
        setCaptchaImage(svg); // Зберігаємо SVG зображення
      })
      .catch((error) => console.error("Error fetching captcha:", error));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileSize = selectedFile.size;
      let isValid = true;

      // Перевірка для текстового файлу (формат .txt)
      if (fileType === "text/plain") {
        if (fileSize <= 100 * 1024) {
          // 100 кБ
          setFile(selectedFile);
          setFilePreview(null); // Очищаємо попередній перегляд для зображень
        } else {
          alert(
            "Text file is too large. Please upload a file smaller than 100 KB."
          );
          setFile(null);
          isValid = false;
          e.preventDefault();
        }
      }
      // Перевірка для зображення (формати .jpg, .jpeg, .png, .gif)
      else if (
        fileType.startsWith("image/") &&
        (fileType === "image/jpeg" ||
          fileType === "image/png" ||
          fileType === "image/gif")
      ) {
        // Перевірка розміру файлу
        if (fileSize <= 320 * 240 * 4) {
          // Максимальний розмір для 320x240 зображення (RGBA)
          // Створюємо попередній перегляд зображення
          const reader = new FileReader();
          reader.onloadend = () => {
            setFile(selectedFile);
            setFilePreview(reader.result); // Додаємо попередній перегляд
          };
          reader.readAsDataURL(selectedFile);
        } else {
          alert(
            "Image is too large. Please upload an image smaller than 320x240 pixels."
          );
          setFile(null);
          isValid = false;
          e.preventDefault();
        }
      } else {
        alert(
          "Invalid file type. Please upload a .txt file or an image (JPG, PNG, GIF)."
        );
        setFile(null);
        isValid = false;
        e.preventDefault();
      }

      if (!isValid) {        
        // Запобігаємо відправленню файлу далі
        setFile(null);
        e.preventDefault(); // Зупиняємо подальшу обробку події
      }
      
    }
  };

  const insertTag = (tag) => {
    const textArea = document.getElementById("comment-textarea");
    const selectedText = text.slice(
      textArea.selectionStart,
      textArea.selectionEnd
    );
    const newText = `${text.slice(
      0,
      textArea.selectionStart
    )}<${tag}>${selectedText}</${tag}>${text.slice(textArea.selectionEnd)}`;
    setText(newText);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setTextError(""); // Очистити помилку при зміні тексту
  };

  const validateForm = () => {
    let isValid = true;

    // Валідація username (тільки латинські літери і цифри)
    const userNamePattern = /^[a-zA-Z0-9]+$/;
    if (!userName.trim()) {
      setUserNameError("Username is required.");
      isValid = false;
    } else if (!userNamePattern.test(userName)) {
      setUserNameError("Username must contain only Latin letters and numbers.");
      isValid = false;
    } else {
      setUserNameError("");
    }

    // Валідація email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailPattern.test(email)) {
      setEmailError("Valid email is required.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Валідація home page (URL)
    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/[^\s]*)?$/;
    if (homePage && !urlPattern.test(homePage)) {
      setHomePageError("Valid homepage URL is required.");
      isValid = false;
    } else {
      setHomePageError("");
    }

    // Валідація тексту через validateXHTML
    if (!text.trim() || !validateXHTML(text)) {
      setTextError("Text is required and must contain only allowed HTML tags.");
      isValid = false;
    } else {
      setTextError("");
    }

    // Валідація CAPTCHA
    if (captchaInput !== captchaSession) {
      setCaptchaError("Incorrect CAPTCHA!");
      isValid = false;
    } else {
      setCaptchaError("");
    }

    return isValid;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Якщо форма валідна, викликаємо handleSubmit
      handleSubmit({ userName, email, homePage, text, file });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleFormSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input"
          />
          {userNameError && <div className="error-text">{userNameError}</div>}

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          {emailError && <div className="error-text">{emailError}</div>}
        </div>
        <div>
          <input
            type="url"
            placeholder="Home page"
            value={homePage}
            onChange={(e) => setHomePage(e.target.value)}
            className="input"
          />
          {homePageError && <div className="error-text">{homePageError}</div>}
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <button
            type="button"
            onClick={() => insertTag("i")}
            className="button"
          >
            [i]
          </button>
          <button
            type="button"
            onClick={() => insertTag("strong")}
            className="button"
          >
            [strong]
          </button>
          <button
            type="button"
            onClick={() => insertTag("code")}
            className="button"
          >
            [code]
          </button>
          <button
            type="button"
            onClick={() => insertTag("a")}
            className="button"
          >
            [a]
          </button>
        </div>

        <textarea
          id="comment-textarea"
          placeholder="Text"
          value={text}
          onChange={handleTextChange}
          rows={3}
          className="textarea"
        />

        {textError && <div className="error-text">{textError}</div>}

        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt,image/*"
          className="file-input"
        />
        {file && file.type === "text/plain" && (
          <div style={{ fontSize: "12px" }}>
            Selected text file: {file.name}
          </div>
        )}
        {file && file.type.startsWith("image/") && (
          <div style={{ fontSize: "12px" }}>Selected image: {file.name}</div>
        )}
        {filePreview && filePreview.startsWith("data:image") && (
          <div>
            <img
              src={filePreview}
              alt="File Preview"
              style={{ maxWidth: "320px", maxHeight: "240px" }}
            />
          </div>
        )}

        {/* CAPTCHA Section */}
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: captchaImage }} // Вставка SVG згенерованого CAPTCHA
          />
          <input
            type="text"
            placeholder="Enter CAPTCHA"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="input"
          />
          {captchaError && <div className="error-text">{captchaError}</div>}
        </div>

        <button type="submit" className="button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
