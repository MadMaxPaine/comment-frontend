import React from "react";
import UserStore from "./UserStore";
import CommentStore from "./CommentStore";
export const ctx = React.createContext(null);

export const StoreProvider = ({ children }) => {
  return (
    <ctx.Provider
      value={{
        user: new UserStore(),
        comment: new CommentStore(),
      }}
    >
      {children}
    </ctx.Provider>
  );
};
