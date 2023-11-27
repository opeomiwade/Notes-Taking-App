import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import Root from "./components/Root"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:<Root/>,
      children: [
        { index: true, element: <Navigate to=":auth" /> },
        {
          path: ":auth",
          element: <Auth />,
        },
        { path: "notes", element: <HomePage /> },
      ],
    },
    ,
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
