import { makeAutoObservable, runInAction } from "mobx";
import { comments, addComment, replies } from "../http/commentAPI";

export default class CommentStore {
  constructor() {
    this._comments = [];
    this._replies =[];
    this._isLoading = false;
    this._error = null;
    this._page = 1;
    this._pageSize = 25;
    this._totalPages = 1;
    this._totalReplies = 0;   
    makeAutoObservable(this);
  }

  // Оновлення даних про коментарі
  setComments(comments) {
    this._comments = comments;
  }

  // Оновлення стану завантаження
  setLoading(bool) {
    this._isLoading = bool;
  }

  // Оновлення повідомлення про помилку
  setError(error) {
    this._error = error;
  }

  // Оновлення поточної сторінки
  setPage(page) {
    this._page = page;
  }

  // Оновлення загальної кількості сторінок
  setTotalPages(total) {
    this._totalPages = total;
  }

  // Оновлення загальної кількості відповідей на коментарі
  setTotalReplies(totalReplies) {
    this._totalReplies = totalReplies;
  }

  // Оновлення поточного ID коментаря
  setCurrentCommentId(id) {
    this._currentCommentId = id;
  }

  // Геттеры для доступу до даних
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

  get totalReplies() {
    return this._totalReplies;
  }

  get currentCommentId() {
    return this._currentCommentId;
  }

  

  // Завантаження коментарів
  async fetchComments(page = this._page, sortBy = "createdAt", sortOrder = "asc") {
    this.setLoading(true);
    try {
      const data = await comments({ page, sortBy, sortOrder });
      if (data && data.comments) {
        runInAction(() => {
          this.setComments(data.comments); // Зберігаємо всі, дерево будується окремо
          this.setTotalPages(data.totalPages);
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
      });
    }
  }
  

  async fetchReplies(commentId, page = 1, pageSize = 5) {
    this.setLoading(true);
    try {
      const data = await replies(commentId, page, pageSize);
      if (data && Array.isArray(data.comments)) {
        runInAction(() => {
          const comment = this._comments.find((c) => c.id === commentId);
          if (comment) {
            // Перевіряємо, чи поле replies є масивом
            if (!Array.isArray(comment.replies)) {
              //console.warn("Поле 'replies' не є масивом, ініціалізуємо його.");
              comment.replies = [];
            }
            // Додаємо підкоментарі
            comment.replies.push(...data.comments);
          } else {
            console.warn("Коментар не знайдений для ID:", commentId);
          }
        });
  
        return {
          replies: data.comments,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
        };
      } else {
        return { replies: [], totalPages: 0, currentPage: 1 };
      }
    } catch (e) {
      console.error("Помилка при завантаженні відповідей:", e);
      this.setError("Не вдалося завантажити відповіді.");
      return { replies: [], totalPages: 0, currentPage: 1 };
    } finally {
      this.setLoading(false);
    }
  }
  
  

  // Оновлення сторінки
  changePage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.setPage(page);
    this.fetchComments(page);
  }

  // Оновлення сторінки
  changePage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.setPage(page);
    this.fetchComments(page);
  }

  // Додавання нового коментаря
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
