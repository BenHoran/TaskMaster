import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginPage from "../components/LoginPage";
import LogoutPage from "../components/LogoutPage";
import Landing from "../components/Landing";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedPage from "../components/ProtectedPage";
import TaskTable from "../components/TasksTable";
import Main from "../components/Main";
import SignUp from "../components/Signup";
import RecoverPassword from "../components/RecoverPassword";

const Routes = () => {
  const user = useSelector((state) => state.user);

  const routesForPublic = [
    { path: "/", element: <Landing /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/recover", element: <RecoverPassword /> },
  ];

  const routesForPrivateAuthenticated = [
    {
      path: "/app",
      element: <ProtectedRoute />,
      children: [
        { path: "/app", element: <ProtectedPage><Main /></ProtectedPage> },
        { path: "/app/tasks", element: <ProtectedPage><TaskTable /></ProtectedPage>},
        { path: "/app/logout", element: <LogoutPage /> },
      ],
    },
  ];

  const routesForPrivateNotAuthenticated = [
    { path: "/login", element: <LoginPage /> },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!user ? routesForPrivateNotAuthenticated : []),
    ...routesForPrivateAuthenticated,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
