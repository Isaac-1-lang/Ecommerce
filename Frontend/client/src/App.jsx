import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import { AppContextProvider, useAppContext } from "./context/AppContext"; // Import the provider
import Footer from "./components/Footer";
import Login from "./components/Login";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ShippingAddressForm from "./pages/AddAddress";
import ContactPage from "./pages/Contact";
import Register from "./components/Register";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin } = useAppContext();

  const hideFooterPaths = ["/login","/register", "/admin/dashboard"];

  const showFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <AppContextProvider>
      <div>
        {isSellerPath ? null : <Navbar />}
        { showUserLogin ? <Login/>: null}
        <Toaster />
        <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route path="/products/:category/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/address" element={<ShippingAddressForm/>}/>
            <Route path="/contact" element={<ContactPage/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={ <Register/> }/>
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        {showFooter && <Footer />}
      </div>
    </AppContextProvider>
  );
}

export default App;