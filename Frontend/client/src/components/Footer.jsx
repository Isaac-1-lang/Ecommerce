import React from "react";
import { Link } from "react-router-dom"; // Import Link for internal navigation
import { assets } from "../assets/images/greencart_assets/assets"; // Adjust path as needed

const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "Best Sellers", path: "/best-sellers" },
        { name: "Offers & Deals", path: "/offers" },
        { name: "Contact Us", path: "/contact" },
        { name: "FAQs", path: "/faq" },
      ],
    },
    {
      title: "Need Help?",
      links: [
        { name: "Delivery Information", path: "/shipping" },
        { name: "Return & Refund Policy", path: "/returns" },
        { name: "Payment Methods", path: "/payment-methods" },
        { name: "Track Your Order", path: "/track-order" },
        { name: "Contact Us", path: "/contact" },
      ],
    },
    {
      title: "Follow Us",
      links: [
        { name: "Instagram", url: "https://instagram.com", external: true },
        { name: "Twitter", url: "https://twitter.com", external: true },
        { name: "Facebook", url: "https://facebook.com", external: true },
        { name: "YouTube", url: "https://youtube.com", external: true },
      ],
    },
  ];

  return (
    <footer className="bg-gray-100 text-gray-600 w-full border-t border-gray-200 shadow-sm">
      <div className="w-full py-10">
        <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-start justify-between gap-10">
          <div>
            <div className="flex items-center space-x-2">
              <img
                className="w-32 md:w-32"
                src={assets.logo}
                alt="GreenCart Logo"
                onError={(e) => (e.target.src = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoColored.svg")} // Fallback if logo is missing
              />
            </div>
            <p className="max-w-[410px] mt-6 text-gray-500">
              Your one-stop shop for fresh groceries and everyday essentials, delivered to your door since 2020.
            </p>
          </div>

          {/* Link Sections */}
          <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
            {linkSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-base text-gray-800 md:mb-5 mb-2">{section.title}</h3>
                <ul className="text-sm space-y-1">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      {link.external ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-green-500 transition-colors duration-300"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="hover:text-green-500 transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-200 border-t border-gray-300 py-4 w-full">
        <div className="max-w-7xl mx-auto w-full px-6 text-center">
          <p className="text-sm md:text-base text-gray-500">
            Copyright {new Date().getFullYear()} © GreenCart. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;