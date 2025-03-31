import { $host, $authhost } from "./index";

export const comments = async function (
  page = 1,
  pageSize = 5,
  sortBy = "createdAt",
  sortOrder = "asc"
) {
  // Логування параметрів
  console.log({ page, pageSize, sortBy, sortOrder });

  // Виправлений запит з правильними параметрами
  const { data } = await $host.get("api/comment", {
    params: { page, pageSize, sortBy, sortOrder }
  });

  // Повертаємо отримані дані
  return data;
};


/*export const comments = async function () {
  const { data } = await $host.get("api/comment");
  return data;
};*/

// Метод для додавання коментаря
export const addComment = async (commentData) => {
  const formData = new FormData();

  // Додавання даних коментаря до formData
  Object.keys(commentData).forEach((key) => {
    if (commentData[key]) {
      formData.append(key, commentData[key]);
    }
  });

  // Отримуємо токен з localStorage (якщо є)
  const token = localStorage.getItem("token");

  // Якщо токен є, то додаємо його до заголовків
  if (token) {
    const { data } = await $authhost.post("api/comment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } else {
    // Якщо токену немає, то відправляємо запит без токену
    const { data } = await $host.post("api/comment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }
};
