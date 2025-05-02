import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { user, currency } = useAppContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock orders data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      try {
        // In a real app, you would fetch from your backend
        // const response = await axios.get('http://localhost:5000/api/orders', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
        // setOrders(response.data);
        
        // Mock data for now
        const mockOrders = [
          {
            _id: "order1",
            orderDate: "2023-04-10T14:30:00Z",
            status: "Delivered",
            totalAmount: 129.99,
            items: [
              {
                _id: "item1",
                name: "Organic Bananas",
                quantity: 2,
                price: 4.99,
                image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              },
              {
                _id: "item2",
                name: "Fresh Spinach",
                quantity: 1,
                price: 3.99,
                image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }
            ]
          },
          {
            _id: "order2",
            orderDate: "2023-03-25T09:15:00Z",
            status: "Delivered",
            totalAmount: 89.50,
            items: [
              {
                _id: "item3",
                name: "Avocado",
                quantity: 4,
                price: 2.99,
                image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }
            ]
          },
          {
            _id: "order3",
            orderDate: "2023-03-10T16:45:00Z",
            status: "Processing",
            totalAmount: 45.75,
            items: [
              {
                _id: "item4",
                name: "Organic Apples",
                quantity: 3,
                price: 5.99,
                image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }
            ]
          }
        ];
        
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load your orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color based on order status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order #{order._id.substring(0, 8)}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Placed on {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <li key={item._id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                              <img
                                className="h-full w-full object-cover"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <p className="text-sm font-medium text-gray-900">
                                {currency}{item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      {currency}{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
