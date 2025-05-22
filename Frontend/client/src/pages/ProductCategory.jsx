import { useState } from "react";
import "../App.css";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { AppContextProvider, useAppContext } from "../context/AppContext";
import Footer from "../components/Footer";
import Login from "../components/Login";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin } = useAppContext();

  const hideFooterPaths = ["/login", "/register", "/admin/dashboard"];
  const showFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <AppContextProvider>
      <div>
        {!isSellerPath && <Navbar />}
        {showUserLogin && <Login />}
        <Toaster />
        <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Outlet /> 
        </div>
        {showFooter && <Footer />}
      </div>
    </AppContextProvider>
  );
}

export default App;