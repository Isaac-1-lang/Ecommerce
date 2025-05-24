import { useState } from "react";
import "./App.css";
import { Outlet,useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
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
import Favourite from "./components/Favourite";
import SessionTimer from "./components/SessionTimer";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin } = useAppContext();

  const hideFooterPaths = ["/login","/register", "/admin/dashboard","/checkout", "/my-orders", "/products/:category/:id", "/products/:category","/products"];

  const showFooter = !hideFooterPaths.includes(location.pathname);
  const products = [
    { id:1, name:"Carrot"},
    {id:2, name:'Bell Pepper'},
    {id:3, name:"Orange Juice"},
    {id:4,name:'EggPlants'},
    {id:5,name:"Potatoes"},
  ]

  return (
    <AppContextProvider>
      <div>
        {isSellerPath ? null : <Navbar />}
        <Toaster />
        <SessionTimer />
        <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Outlet>
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
            <Route path="/favourite" element={<Favourite/>} />
          </Outlet>
        </div>
        {showFooter && <Footer />}
      </div>
    </AppContextProvider>
  );
}

export default App;