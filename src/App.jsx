import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import Root from "./components/Root";
import { loader as notesLoader } from "./pages/HomePage";
import {loader as checkAuth} from "./util/http"
import {action as loginAction} from "./components/AuthForm"
import queryClient from "./util/http";
import { QueryClientProvider } from "@tanstack/react-query";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <Navigate to="/signup" /> },
        {
          path: ":auth",
          element: <Auth />,
          action:loginAction
        },
        { path: "notes", element: <HomePage />, loader: notesLoader},
      ],
    },
    ,
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
