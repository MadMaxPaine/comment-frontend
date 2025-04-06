import React, { useState, useEffect } from "react";
import { Button, Box, Typography, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const Captcha = ({ onSuccess }) => {
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [canReload, setCanReload] = useState(false); // Додано для контролю кнопки Reload

  const reloadCaptcha = () => {
    setCaptchaUrl(`http://localhost:5000/captcha?${Date.now()}`);
    setIsCaptchaVerified(false);
    setMessage("");
    setTimeLeft(60); // Скидаємо таймер при перезавантаженні капчі
    setCanReload(false); // Кнопка неактивна
  };

  useEffect(() => {
    // Якщо капча вже перевірена, не починати таймер
    if (isCaptchaVerified) return;

    reloadCaptcha(); // Завантажуємо капчу при завантаженні компонента

    // Запускаємо таймер
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          setCanReload(true); // Кнопка стає активною після завершення таймера
          return 0; // Зупиняємо таймер, коли час вичерпано
        }
        return prev - 1; // Зменшуємо час на 1 секунду
      });
    }, 1000);

    return () => clearInterval(timer); // Очищаємо таймер при розмонтуванні компонента
  }, [isCaptchaVerified]);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaInput }),
        credentials: "include",
      });

      const text = await response.text();
      setMessage(text);

      if (text === "✅ Captcha correct!") {
        setIsCaptchaVerified(true);
        onSuccess();
      } else {
        //reloadCaptcha();
      }
    } catch (error) {
      console.error("Error during CAPTCHA validation:", error);
      setMessage(
        "There was an error processing your request. Please try again."
      );
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      {captchaUrl && (
        <Box
          sx={{
            display: "flex",
            mt: 1,
            m: 0.5,
            justifyContent: "left",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <img
            src={captchaUrl}
            alt="CAPTCHA"
            style={{ width: "100%", maxWidth: 200 }} // Робимо зображення компактнішим
          />
          <Box>
            <Button
              variant="text"
              onClick={reloadCaptcha}
              size="small"
              startIcon={<RefreshIcon />}
              sx={{
                display: isCaptchaVerified ? "none" : "block",
                marginLeft: 0.5,
              }}
              disabled={!canReload} // Кнопка буде неактивною поки не закінчиться таймер
            >
              RELOAD
            </Button>
          </Box>
        </Box>
      )}

      <TextField
        label={
          isCaptchaVerified ? "✅ CAPTCHA SUCCESS!" : message || "Enter CAPTCHA"
        }
        variant="outlined"
        fullWidth
        size="small"
        value={captchaInput}
        onChange={(e) => setCaptchaInput(e.target.value)}
        required
        error={!!message && message.includes("❌")}
        helperText={!isCaptchaVerified && message}
        sx={{ mb: 1 }}
        disabled={isCaptchaVerified}
      />

      <Button
        variant="contained"
        size="small"
        onClick={handleSubmit}
        fullWidth
        disabled={isCaptchaVerified}
      >
        Check
      </Button>

      {!isCaptchaVerified && timeLeft > 0 && (
        <Typography variant="body2" sx={{ marginTop: 2, m: 0.5 }}>
          CAPTCHA update in {timeLeft} sec.
        </Typography>
      )}
    </Box>
  );
};

export default Captcha;
