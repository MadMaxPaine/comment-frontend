import Reply from "./pages/TestReply";
import Auth from "./pages/Auth";
import Comments from "./pages/Comments";
import TestPage from "./pages/TestPage";
import {
  COMMENTS_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  TEST_ROUTE,
  TEST_REPLY,
  
} from "./utils/consts";

export const authRoutes = [];
export const publicRoutes = [
  {
    path: COMMENTS_ROUTE,
    Component: Comments,
  },
  {
    path: TEST_REPLY,
    Component: Reply,
  },  
  {
    path: TEST_ROUTE,
    Component: TestPage,
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
