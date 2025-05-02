import React from "react";
import { categories } from "../assets/images/greencart_assets/assets";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-16 px-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 uppercase tracking-wide">
        Categories
      </h2>
      <div className="w-16 h-1 bg-green-500 rounded-full mt-2 mb-6"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}
          >
            <div
              className="group cursor-pointer py-5 px-3 rounded-lg flex flex-col justify-center items-center transition-all duration-300 hover:shadow-lg hover:scale-105 w-full"
              style={{
                backgroundColor: category.color,
                border: "2px solid transparent",
              }}
            >
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.text}
                  className="max-w-28 h-28 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-800 mt-2 text-center transition-colors duration-300 group-hover:text-green-600 relative">
              {category.text}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;