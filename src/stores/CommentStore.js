import { makeAutoObservable, runInAction } from "mobx";
import {
  comments as fetchCommentsAPI,
  addComment,
  replies as fetchRepliesAPI,
} from "../http/commentAPI";
export default class CommentStore {
  constructor() {
    this._comments = [];
    this._isLoading = false;
    this._error = null;
    this._page = 1;
    this._pageSize = 25;
    this._totalPages = 1;
    this._sortOption = "createdAt-desc";
    // Ініціалізація activeRooms як Set
    this.activeRooms = new Set();
    makeAutoObservable(this);
  }

  // ========================
  // SETTERS & GETTERS
  // ========================
  setComments(comments) {
    this._comments = comments;
  }
  setSortOption(sortOption) {
    this._sortOption = sortOption;
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

  get sortOption() {
    return this._sortOption;
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

  // ========================
  // ЗАВАНТАЖЕННЯ КОМЕНТАРІВ
  // ========================
  async fetchComments(
    page = this._page,
    sortBy = "createdAt",
    sortOrder = "asc"
  ) {
    this.setLoading(true);
    try {
      const data = await fetchCommentsAPI({ page, sortBy, sortOrder });
      console.log("New comments received:", data);
      runInAction(() => {
        const enriched = data.comments.map((c) => ({ ...c, replies: [] }));
        this.setComments(enriched);
        this.setTotalPages(data.totalPages);
      });
    } catch (e) {
      console.error("Error on loading:", e);
      runInAction(() => {
        this.setError("Error loading comments");
      });
    } finally {
      this.setLoading(false);
    }
  }

  async fetchReplies(commentId, page = 1, perPage = 25) {
    try {
      const parent = this._findCommentById(commentId, this._comments);
      if (!parent) return;
      // 🔧 Ініціалізуємо repliesLoadedPages, якщо треба
      if (!parent.repliesLoadedPages) parent.repliesLoadedPages = [];

      // 🔧 Якщо ця сторінка вже була завантажена — вихід
      if (parent.repliesLoadedPages.includes(page)) return;
      const response = await fetchRepliesAPI(commentId, page, perPage); // Запит до API
      const repliesArray = response.comments; // Масив коментарів

      if (!Array.isArray(repliesArray)) {
        console.error("Received answer is not array of comments", repliesArray);
        return;
      }

      console.log("Response from server:", repliesArray);

      runInAction(() => {
        if (!parent.replies) parent.replies = [];
        const existingIds = new Set(parent.replies.map((r) => r.id));
        const newReplies = repliesArray
          .filter((r) => !existingIds.has(r.id)) // ⚠️ фільтрація
          .map((r) => ({ ...r, replies: [] }));

        parent.replies.push(...newReplies);

        // 🔧 Запам'ятовуємо, що ця сторінка вже завантажена
        parent.repliesLoadedPages.push(page);
        // Оновлення метаданих
        parent.currentPage = response.currentPage;
        parent.totalReplies = response.totalReplies;
        parent.hasMoreReplies = response.hasMoreReplies;
      });
    } catch (e) {
      console.error("Error on loading {fetchReplies}:", e);
    }
  }

  // ========================
  // РЕКУРСИВНИЙ ПОШУК КОМЕНТАРЯ
  // ========================
  _findCommentById(id, list) {
    for (const comment of list) {
      if (comment.id === id) return comment;
      if (comment.replies.length > 0) {
        const found = this._findCommentById(id, comment.replies);
        if (found) return found;
      }
    }
    return null;
  }

  // ========================
  // ДОДАВАННЯ КОМЕНТАРЯ
  // ========================
  async addComment(commentData, parentId = null, sortOption = null) {
    this.setLoading(true);
    try {
      const newComment = await addComment(commentData);
      runInAction(() => {
        const commentWithReplies = { ...newComment, replies: [] };
        if (!parentId) {
          //this._comments.unshift(commentWithReplies);
        } else {
          const parent = this._findCommentById(parentId, this._comments);
          if (parent) {
            parent.replies.unshift(commentWithReplies);
          }
        }
      });
    } catch (e) {
      console.error("Error adding {addComment}:", e);
      this.setError("Failed to add.");
    } finally {
      this.setLoading(false);
    }
  }

  // ========================
  // ПЕРЕХІД НА ІНШУ СТОРІНКУ
  // ========================
  changePage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.setPage(page);
    this.fetchComments(page);
  }

  // ========================
  // ПІДПИСКА НА СОКЕТІВ
  // ========================
  subscribeToCommentEvents(socket) {
    if (!socket) return;

    socket.on("commentAdded", (newComment) => {
      console.log("Socket: commentAdded", newComment);
      this.addReplyToComment(newComment.parentId, {
        ...newComment,
        replies: [],
      });
    });
  }

  // ========================
  // ПІДПИСКА І ВІДПИСКА З КІМНАТ
  // ========================
  joinCommentRoom(socket, commentId) {
    if (!socket) return;
    const room = `comment-${commentId}`;

    if (!this.activeRooms.has(room)) {
      this.activeRooms.add(room);
      console.log("Socket: joinRoom", room);
      socket.emit("joinRoom", room);
    }
  }

  leaveCommentRoom(socket, commentId) {
    if (!socket) return;
    const room = `comment-${commentId}`;

    if (this.activeRooms.has(room)) {
      this.activeRooms.delete(room);
      console.log("Socket: leaveRoom", room);
      socket.emit("leaveRoom", room);
    }
  }
  leaveNestedCommentRooms(socket, comment) {
    if (!socket || !comment) return;

    this.leaveCommentRoom(socket, comment.id);

    if (Array.isArray(comment.replies)) {
      for (const reply of comment.replies) {
        this.leaveNestedCommentRooms(socket, reply);
      }
    }
  }
  setSocket(socket) {
    this.socket = socket;

    socket.on("connect", () => {
      console.log("🔁 Socket connected:", socket.id);
      console.log("🔁 Socket connected: Rejoining rooms...");
      this.activeRooms.forEach((room) => {
        console.log("Rejoining room:", room);
        socket.emit("joinRoom", room);
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    this.subscribeToCommentEvents(socket);
  }
  // ========================
  //  Рекурсивно шукає коментар за parentId і додає відповідь
  // ========================
  addReplyToComment(parentId, reply, currentList = this.comments) {
    // Якщо parentId === null, це означає, що коментар є батьківським (не має батька)
    if (parentId === null) {
      const direction = this._sortOption.split("-")[1];
      // Залежно від поточної сторінки та сортування додаємо коментар
      if (direction === "desc") {
        if (this._page === 1) {
          // Додаємо на початок, якщо перша сторінка і сортуємо від найновіших
          currentList.unshift(reply);
        }
      } else if (direction === "asc") {
        if (this._page === this._totalPages) {
          // Додаємо в кінець, якщо остання сторінка і сортуємо від найстаріших
          currentList.push(reply);
        }
      }

      return true;
    }
    for (const comment of currentList) {
      if (comment.id === parentId) {
        // Додаємо відповідь на початок масиву
        comment.replies.unshift(reply);
        return true;
      }
      if (comment.replies?.length) {
        const added = this.addReplyToComment(parentId, reply, comment.replies);
        if (added) return true;
      }
    }
    return false;
  }
}
