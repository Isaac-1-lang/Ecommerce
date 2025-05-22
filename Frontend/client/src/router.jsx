// src/router.js
import {
  createBrowserRouter,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage";
import Loader from "./components/Loader"; 

// Lazy-loaded components
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const Home = lazy(() => import("./pages/Home"));
const AllProducts = lazy(() => delay(2000).then(()=> import("./pages/AllProducts")));
const ProductCategory = lazy(() => import("./pages/ProductCategory"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const ShippingAddressForm = lazy(() => import("./pages/AddAddress"));
const ContactPage = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Favourite = lazy(() =>delay(2000).then(()=>import("./components/Favourite")) );

// Wrapper to show fallback while lazy loading
const withSuspense = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "products", element: withSuspense(AllProducts) },
      { path: "products/:category", element: withSuspense(ProductCategory) },
      { path: "products/:category/:id", element: withSuspense(ProductDetails) },
      { path: "cart", element: withSuspense(Cart) },
      { path: "address", element: withSuspense(ShippingAddressForm) },
      { path: "contact", element: withSuspense(ContactPage) },
      { path: "login", element: withSuspense(Login) },
      { path: "register", element: withSuspense(Register) },
      { path: "my-orders", element: withSuspense(MyOrders) },
      { path: "checkout", element: withSuspense(Checkout) },
      { path: "admin/dashboard", element: withSuspense(Dashboard) },
      { path: "favourite", element: withSuspense(Favourite) },
    ],
  },
]);

export default router;
