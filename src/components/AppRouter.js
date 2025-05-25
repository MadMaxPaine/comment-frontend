import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { COMMENTS_ROUTE } from "../utils/consts";
import { ctx } from "../stores/Context";
export const AppRouter = () => {
  const { user } = useContext(ctx); 
  return (
    <>
      <Routes>
        {user.isAuth &&
          authRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {/* Перенаправлення на коментарі за замовчуванням */}
        <Route path="*" element={<Navigate to={COMMENTS_ROUTE} />} />
      </Routes>
    </>
  );
};
export default AppRouter;
