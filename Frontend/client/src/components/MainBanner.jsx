import React from "react";
import { assets } from "../assets/images/greencart_assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full h-full object-cover hidden md:block"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full h-full object-cover md:hidden"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start px-6 md:px-12 lg:px-20 text-white">
        <h1
          className="text-3xl md:text-4xl lg:text-6xl font-bold text-center md:text-left max-w-[18rem] md:max-w-md lg:max-w-2xl leading-tight lg:leading-[4rem] animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          Fresh You Can Trust, Savings You'll Love!
        </h1>
        <div className="flex items-center gap-4 mt-8 font-medium animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <Link
            to="/products"
            className="group flex items-center gap-2 px-6 md:px-8 py-3 bg-green-600 hover:bg-green-700 transition-all duration-300 rounded-lg text-white shadow-lg hover:shadow-xl"
          >
            Shop Now
            <img
              src={assets.white_arrow_icon}
              alt="arrow"
              className="w-4 h-4 md:hidden transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            to="/products"
            className="group hidden md:flex items-center gap-2 px-6 md:px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-black transition-all duration-300 rounded-lg"
          >
            Explore Deals
            <img
              src={assets.black_arrow_icon}
              alt="arrow"
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;