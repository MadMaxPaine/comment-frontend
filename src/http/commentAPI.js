import { $host, $authhost } from "./index";

export const comments = async function (
  page = 1,
  pageSize = 5,
  sortBy = "createdAt",
  sortOrder = "asc"
) {
  // Логування параметрів
  //console.log({ page, pageSize, sortBy, sortOrder });

  // Виправлений запит з правильними параметрами
  const { data } = await $host.get("api/comment", {
    params: { page, pageSize, sortBy, sortOrder },
  });
  //console.log("data",data);
  
  // Повертаємо отримані дані
  return data;
};

export const replies = async function (id, page = 1,pageSize = 5) {
 //console.log("lalala"); 
  const { data } = await $host.get(`api/comment/${id}/replies`, {
    params: {id, page, pageSize },
  });
  //console.log("Відповіді з сервера:", data);
  return data;
};
/*export const comments = async function () {
  const { data } = await $host.get("api/comment");
  return data;
};*/

// Метод для додавання коментаря
export const addComment = async (commentData) => {
  const token = localStorage.getItem("token");

  // Логування всіх полів formData
  for (let [key, value] of commentData.entries()) {
    console.log(key, value);
  }

  try {
    let response;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}` : "", // Додаємо токен аутентифікації
    };

    if (token) {
      response = await $authhost.post("api/comment", commentData, {
        headers,
        withCredentials: true,
      });
      return response.data;
    } else {
      response = await $host.post("api/comment", commentData, {
        headers,
        withCredentials: true,
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error while adding comment:", error);
    
    if (error.response && error.response.status === 403) {
      // Якщо сервер повернув 403, це може означати, що CAPTCHA не пройдена або токен недійсний
      throw new Error("Please complete the CAPTCHA first.");
    }

    throw error; // Інакше пробуємо передати інші помилки
  }
};
