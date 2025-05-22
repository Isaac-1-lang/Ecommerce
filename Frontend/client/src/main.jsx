import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import store from "./redux/store";
import { Provider } from "react-redux";
import { AppContextProvider } from "./context/AppContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>   {/* Wrap the RouterProvider with AppContextProvider  here is redux*/}
    <RouterProvider router={router} />
  </Provider>
);