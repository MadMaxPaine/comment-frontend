import React, { useState, useEffect } from "react";
import { Button, Box, Typography, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { REACT_APP_API_URL } from "../../utils/consts";

const Captcha = ({ onSuccess }) => {
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [canReload, setCanReload] = useState(false); // Додано для контролю кнопки Reload
  const [captchaId, setCaptchaId] = useState(null);
  const reloadCaptcha = async () => {
    const response = await fetch(`${REACT_APP_API_URL}api/captcha`, {
      credentials: "include",
    });
    const blob = await response.blob();

    const newCaptchaId = response.headers.get("x-captcha-id"); // <-- Отримали унікальний ID

    setCaptchaId(newCaptchaId);

    const objectUrl = URL.createObjectURL(blob);
    setCaptchaUrl(objectUrl);
    setIsCaptchaVerified(false);
    setMessage("");
    setTimeLeft(60);
    setCanReload(false);
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
      const response = await fetch(`${REACT_APP_API_URL}api/captcha/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaInput, captchaId }),
        credentials: "include",
      });

      const text = await response.text();
      setMessage(text);

      if (text === "✅ Captcha correct!") {
        setIsCaptchaVerified(true);
        onSuccess(captchaId, captchaInput);
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
            flexDirection: "column",
            m: 0.5,
            p: 0.5,
            width: "fit-content", // важливо!
            alignItems: "center", // контент по центру
          }}
        >
          <img
            src={captchaUrl}
            alt="CAPTCHA"
            style={{ width: "100%", maxWidth: 200 }} // Робимо зображення компактнішим
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            onClick={reloadCaptcha}
            startIcon={<RefreshIcon />}
            fullWidth
            sx={{
              display: isCaptchaVerified ? "none" : "flex",
              flexDirection: "row", // просто для впевненості
              alignItems: "center", // вирівнювання по центру вертикалі
              justifyContent: "center",
              m: 0.5,
              p: 0.5,
              borderRadius: 0,
              gap: 1, // невеликий відступ між іконкою і текстом
            }}
            disabled={!canReload} // Кнопка буде неактивною поки не закінчиться таймер
          >
            RELOAD
          </Button>
          <Box>
            {!isCaptchaVerified && timeLeft > 0 && (
              <Typography variant="body2" sx={{ m: 0.5, p: 0.5 }}>
                CAPTCHA update in {timeLeft} sec.
              </Typography>
            )}
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
    </Box>
  );
};

export default Captcha;
