import { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/images/greencart_assets/assets";
import { API_URL } from "../config";
import toast from "react-hot-toast";

// Create context with a default value to avoid undefined issues
export const AppContext = createContext({
  navigate: () => {},
  user: null,
  setUser: () => {},
  role: null,
  token: null,
  setToken: () => {},
  login: () => {},
  logout: () => {},
  showUserLogin: true,
  setShowUserLogin: () => {},
  products: [],
  addToCart: () => {},
  updateCartItems: () => {},
  removeCartItem: () => {},
  getCartCount: () => 0,
  getCartAmount: () => 0,
  currency: "",
  cartItems: {},
  searchQuery: "",
  setSearchQuery: () => {},
  sessionTimeLeft: 0,
  isSessionActive: false,
});

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$"; // Fallback currency
  const navigate = useNavigate();

  // State initialization with proper defaults
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // e.g., 'customer', 'seller'
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Session timer effect
  useEffect(() => {
    let timer;
    if (isSessionActive && sessionTimeLeft > 0) {
      timer = setInterval(() => {
        setSessionTimeLeft(prev => {
          if (prev <= 1) {
            setIsSessionActive(false);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, sessionTimeLeft]);

  // Save cartItems and token to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Fetch products with error handling
  const fetchProducts = useCallback(async () => {
    try {
      setProducts(dummyProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
      setProducts([]); 
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, role, user: userData } = response.data;
      setToken(token);
      setUser(userData || { email });
      setRole(role);
      setSessionTimeLeft(120);
      setIsSessionActive(true);
      toast.success("Login successful!");
      
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || "Login failed. Please try again.");
      throw error;
    }
  };

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    setToken(null);
    setCartItems({}); // Optional: Clear cart on logout
    setSessionTimeLeft(0);
    setIsSessionActive(false);
    toast.success("Logged out successfully!");
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Define getCartCount
  const getCartCount = useCallback(() => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  }, [cartItems]);

  // Define getCartAmount
  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return totalAmount;
  }, [cartItems, products]);

  // Function to add product to cart with validation
  const addToCart = useCallback((itemId) => {
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }

    setCartItems((prevCartItems) => {
      const cartData = structuredClone(prevCartItems);
      cartData[itemId] = (cartData[itemId] || 0) + 1;
      toast.success("Added to Cart");
      return cartData;
    });
  }, []);
  const handleToggleFavourite = useCallback((itemId) => {
    if(!itemId) {
      toast.error("Invalid item ID");
      return;
    }
    setCartItems((prevCartItems)=> {
      const cartData = structuredClone(prevCartItems);
      cartData[itemId] = (cartData[itemId] || 0) + 1;
      toast.success("Added to favourites");
    })
  })

  // Update cart item quantity with validation
  const updateCartItems = useCallback((itemId, quantity) => {
    if (!itemId || quantity < 0) {
      toast.error("Invalid item ID or quantity");
      return;
    }

    setCartItems((prevCartItems) => {
      const cartData = structuredClone(prevCartItems);
      if (quantity === 0) {
        delete cartData[itemId];
      } else {
        cartData[itemId] = quantity;
      }
      toast.success("Cart Updated");
      return cartData;
    });
  }, []);

  // Function to remove product from cart
  const removeCartItem = useCallback((itemId) => {
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }

    setCartItems((prevCartItems) => {
      const cartData = structuredClone(prevCartItems);
      if (cartData[itemId]) {
        cartData[itemId] -= 1;
        if (cartData[itemId] === 0) {
          delete cartData[itemId];
        }
        toast.success("Removed from Cart");
        return cartData;
      }
      return prevCartItems;
    });
  }, []);


  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      navigate,
      user,
      setUser,
      role,
      token,
      setToken,
      login,
      logout,
      showUserLogin,
      setShowUserLogin,
      products,
      addToCart,
      updateCartItems,
      removeCartItem,
      getCartCount,
      getCartAmount,
      currency,
      cartItems,
      searchQuery,
      setSearchQuery,
      sessionTimeLeft,
      isSessionActive,
    }),
    [
      navigate,
      user,
      role,
      token,
      showUserLogin,
      products,
      cartItems,
      searchQuery,
      currency,
      addToCart,
      updateCartItems,
      removeCartItem,
      getCartCount,
      getCartAmount,
      login,
      logout,
      sessionTimeLeft,
      isSessionActive,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};