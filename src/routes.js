import Auth from "./pages/Auth";
import Comments from "./pages/Comments";

import {
  COMMENTS_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,

} from "./utils/consts";

export const authRoutes = [];
export const publicRoutes = [
  {
    path: COMMENTS_ROUTE,
    Component: Comments,
  },
  
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth,
  },
];
