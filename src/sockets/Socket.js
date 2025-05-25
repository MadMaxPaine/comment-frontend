// socket/socket.js
import { io } from "socket.io-client";
import { REACT_APP_API_URL } from "../utils/consts";

let socketInstance = null;

export const connectSocket = (url = REACT_APP_API_URL) => {
  if (!socketInstance) {
    socketInstance = io(url, {
      transports: ["websocket"], // optional, for optimization
    });

    // Логування події disconnect для виявлення відключення сокету
    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance && socketInstance.connected) {
    socketInstance.disconnect();
    console.log("🔴 Socket disconnected");
    socketInstance = null;
  }
};


export const getSocket = () => {
  if (!socketInstance) {
    throw new Error("Socket is not connected. Call connectSocket() first.");
  }
  return socketInstance;
};
