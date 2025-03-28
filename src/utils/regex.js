// regex.js

export const allowedTagsRegex = /<\/?(a|code|i|strong)[^>]*>/g; // Дозволені теги
export const invalidTagsRegex = /<\/?(?!a|code|i|strong)[^>]*>/g; // Невалідні теги
export const tagBalanceRegex = /<([a-z]+)(?: [^>]*)?>(.*?)<\/\1>/g; // Перевірка на правильне закриття тегів
