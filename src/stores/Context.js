import React, { useMemo, useState, useEffect } from "react";
import UserStore from "./UserStore";
import CommentStore from "./CommentStore";
import { connectSocket, disconnectSocket } from "../sockets/Socket"; // імпортуємо функції
import { REACT_APP_API_URL } from "../utils/consts";
export const ctx = React.createContext(null);

export const StoreProvider = ({ children }) => {
  const userStore = useMemo(() => new UserStore(), []);
  const commentStore = useMemo(() => new CommentStore(), []);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socketInstance = connectSocket(REACT_APP_API_URL);
    setSocket(socketInstance);

    // Чекаємо підʼєднання перед тим як встановити в store
    socketInstance.on("connect", () => {
      console.log("🟢 Socket connected:", socketInstance.id);
      commentStore.setSocket(socketInstance); // всередині також є on connect повторна підписка
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err);
    });

    return () => {
      disconnectSocket();
    };
  }, [commentStore]);
  return (
    <ctx.Provider value={{ user: userStore, comment: commentStore, socket }}>
      {children}
    </ctx.Provider>
  );
};
