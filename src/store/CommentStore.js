import { makeAutoObservable, runInAction } from "mobx";
import { comments, addComment } from "../http/commentAPI";

export default class CommentStore {
  constructor() {
    this._comments = [];
    this._isLoading = false;
    this._error = null;
    this._page = 1;
    this._pageSize = 25;
    this._totalPages = 1;
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

  setPage(page) {
    this._page = page;
  }

  setTotalPages(total) {
    this._totalPages = total;
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

  get page() {
    return this._page;
  }

  get pageSize() {
    return this._pageSize;
  }

  get totalPages() {
    return this._totalPages;
  }

  async fetchComments(page = this._page,sortBy = "createdAt", sortOrder = "asc") {
    this.setLoading(true);
    console.log("Fetching comments with:", { page, sortBy, sortOrder }); // Дебаг лог
    try {      
      // Використовуємо axios для запиту
      const data = await comments({page, sortBy, sortOrder});
      //console.log(sortBy, sortOrder);
      console.log('Sort by:', sortBy, 'Order:', sortOrder);
      //console.log(data);
      // Перевіряємо, чи є в відповіді дані
      if (data && data.comments) {
        // Перевіряємо, чи є властивість comments і чи це масив
        if (Array.isArray(data.comments)) {
          runInAction(() => {
            this.setComments(data.comments); // встановлюємо отримані коментарі
            this.setTotalPages(data.totalPages); // встановлюємо кількість сторінок
          });
        } else {
          runInAction(() => {
            this.setComments([]); // Якщо коментарі не є масивом, очищаємо їх
          });
        }
      } else {
        runInAction(() => {
          this.setComments([]); // Очистити коментарі, якщо їх немає
        });
      }
    } catch (e) {
      console.error("Помилка при завантаженні коментарів:", e);
      runInAction(() => {
        this.setError("Помилка завантаження коментарів");
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
        console.log("Завершення завантаження коментарів");
      });
    }
  }

  // Оновлений метод для зміни сторінки та завантаження нових коментарів
  changePage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.setPage(page);
    this.fetchComments(page);
  }

  async addComment(commentData) {
    this.setLoading(true);
    this.setError(null);
    try {
      const newComment = await addComment(commentData);
      runInAction(() => {
        this._comments.push(newComment);
      });
    } catch (e) {
      console.error(
        "Error adding comment:",
        e.response?.data?.message || e.message
      );
      this.setError("Не вдалося додати коментар.");
    } finally {
      this.setLoading(false);
    }
  }
}
