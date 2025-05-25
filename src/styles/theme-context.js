import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Отримуємо збережену тему з localStorage, або за замовчуванням 'light'
  const savedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(savedTheme || "light");

  // Функція для перемикання теми
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Зберігаємо вибрану тему в localStorage
  };

  // Обчислюємо поточну тему
  const currentTheme = useMemo(
    () => (theme === "dark" ? darkTheme : lightTheme),
    [theme]
  );

  useEffect(() => {
    // Відновлюємо тему при першому завантаженні
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
