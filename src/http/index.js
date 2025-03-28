import axios from "axios";
const { REACT_APP_API_URL } = require("../utils/consts");

// Створення інстансів для зв'язку з API
const $host = axios.create({
  baseURL: REACT_APP_API_URL,
});

const $authhost = axios.create({
  withCredentials: true,
  baseURL: REACT_APP_API_URL,
});

// Перехоплювач для додавання токена в заголовки авторизації
const authInterceptor = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;  
};

// Перехоплювач для всіх запитів через $authhost
$authhost.interceptors.request.use(authInterceptor);

// Обробка помилок, особливо для помилки 401 (неавторизовано)
$authhost.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;

    // Якщо помилка 401 і ми ще не повторювали запит
    if (error.response.status === 401 && !originalReq._isRetry) {
      originalReq._isRetry = true;

      try {
        // Спробуємо оновити токен
        const res = await axios.get("api/user/refresh", {
          withCredentials: true,
        });

        // Якщо оновлення токена успішне
        localStorage.setItem("token", res.data.accessToken);

        // Оновлюємо заголовки авторизації для майбутніх запитів
        $authhost.defaults.headers[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;

        // Повторюємо запит з новим токеном
        return $authhost.request(originalReq);
      } catch (e) {
        console.error(
          "Error refreshing token:",
          e.response?.data?.message || e.message
        );

        // Видаляємо токен та перенаправляємо на сторінку входу
        localStorage.removeItem("token");
        window.location.href = "/login"; // Перенаправлення на сторінку входу
        return Promise.reject(e);
      }
    }

    // Для інших помилок
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error during request:", error.message);
    }

    // Викидаємо помилку далі для обробки у компоненті або інтерсепторі
    return Promise.reject(error);
  }
);

export { $host, $authhost };
