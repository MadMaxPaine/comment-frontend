import { makeAutoObservable } from "mobx";
import { comments as getComments, addComment as postComment } from "../http/commentAPI"; // додаємо addComment

export default class CommentStore {
  constructor() {
    this._comments = [];
    this._isLoading = false;
    this._error = null; // додамо для зберігання помилок
    makeAutoObservable(this);
  }

  setComments(comments) {
    this._comments = comments;
  }

  setLoading(bool) {
    this._isLoading = bool;
  }

  setError(error) {
    this._error = error;
  }

  get comments() {
    return this._comments;
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  // Функція для отримання всіх коментарів
  async fetchComments() {
    this.setLoading(true);
    this.setError(null); // очищуємо помилки
    try {
      const data = await getComments();
      this.setComments(data);
    } catch (e) {
      console.error("Error fetching comments:", e.response?.data?.message || e.message);
      this.setError("Не вдалося отримати коментарі.");
    } finally {
      this.setLoading(false);
    }
  }

  // Функція для додавання коментаря
  async addComment(commentData) {
    this.setLoading(true);
    this.setError(null); // очищуємо помилки
    try {
      const newComment = await postComment(commentData); // викликаємо API для додавання
      this._comments.push(newComment); // додаємо новий коментар в список
    } catch (e) {
      console.error("Error adding comment:", e.response?.data?.message || e.message);
      this.setError("Не вдалося додати коментар.");
    } finally {
      this.setLoading(false);
    }
  }
}
