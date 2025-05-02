import React, { useState, useEffect } from 'react';
import { assets } from '../assets/images/greencart_assets/assets';
import { useAppContext } from '../context/AppContext';

const ShippingAddressForm = ({ onSaveSuccess }) => {
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  // Validation and UI states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formProgress, setFormProgress] = useState(0); // New: Track form completion

  const { user } = useAppContext() || { user: null };

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Calculate form progress
  useEffect(() => {
    const filledFields = Object.values(formData).filter((value) => value.trim() !== '').length;
    const totalFields = Object.keys(formData).length;
    setFormProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  // Countries list
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia',
    'Germany', 'France', 'India', 'Japan', 'China', 'Brazil',
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (value.length < 2) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name should be at least 2 characters`;
        }
        break;
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'street':
        if (!value.trim()) {
          error = 'Street address is required';
        } else if (value.length < 5) {
          error = 'Please enter complete street address';
        }
        break;
      case 'city':
        if (!value.trim()) {
          error = 'City is required';
        }
        break;
      case 'state':
        if (!value.trim()) {
          error = 'State is required';
        }
        break;
      case 'zipCode':
        if (!value) {
          error = 'Zip code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(value) && !/^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(value)) {
          error = 'Enter a valid zip/postal code';
        }
        break;
      case 'country':
        if (!value) {
          error = 'Country is required';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!/^\+?[\d\s()-]{10,15}$/.test(value)) {
          error = 'Enter a valid phone number';
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = String(formData[key]).trim().replace(/<\/?[^>]+(>|$)/g, '');
        return acc;
      }, {});

      console.log('Shipping Address Submitted:', sanitizedData);

      await new Promise((resolve) => setTimeout(resolve, 800));

      setShowSuccessMessage(true);

      setTimeout(() => {
        if (onSaveSuccess) {
          onSaveSuccess(sanitizedData);
        }
        setShowSuccessMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get field class for styling
  const getFieldClass = (fieldName) => {
    const baseClass =
      'w-full p-3 border rounded-md focus:outline-none transition-all duration-300 ';

    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} border-red-400 focus:border-red-500 bg-red-50 animate-shake`;
    }
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClass} border-green-400 focus:border-green-500 bg-green-50`;
    }

    return `${baseClass} border-gray-300 focus:border-green-500 hover:border-green-400`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Form */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Add Shipping <span className="text-green-600">Address</span>
            </h1>
            {/* Form Progress Indicator */}
            <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-r-lg animate-slide-in">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Address saved successfully!
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="First Name"
                  className={getFieldClass('firstName')}
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400 text-sm tooltip">
                  Required
                  <span className="tooltip-text">Enter your first name</span>
                </span>
                {touched.firstName && errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Last Name"
                  className={getFieldClass('lastName')}
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400 text-sm tooltip">
                  Required
                  <span className="tooltip-text">Enter your last name</span>
                </span>
                {touched.lastName && errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email address"
                className={getFieldClass('email')}
                required
                autoComplete="email"
              />
              <span className="absolute right-3 top-3 text-gray-400 text-sm tooltip">
                Required
                <span className="tooltip-text">Enter a valid email address</span>
              </span>
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Street Address"
                className={getFieldClass('street')}
                required
              />
              <span className="absolute right-3 top-3 text-gray-400 text-sm tooltip">
                Required
                <span className="tooltip-text">Enter your street address</span>
              </span>
              {touched.street && errors.street && (
                <p className="mt-1 text-sm text-red-500">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="City"
                  className={getFieldClass('city')}
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400 text-sm tooltip">
                  Required
                  <span className="tooltip-text">Enter your city</span>
                </span>
                {touched.city && errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="State/Province"
                  className={getFieldClass('state')}
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400 text-sm tooltip">
                  Required
                  <span className="tooltip-text">Enter your state or province</span>
                </span>
                {touched.state && errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Zip/Postal Code"
                  className={getFieldClass('zipCode')}
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400 text-sm tooltip">
                  Required
                  <span className="tooltip-text">Enter your zip or postal code</span>
                </span>
                {touched.zipCode && errors.zipCode && (
                  <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
                )}
              </div>
              <div className="relative">
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClass('country')}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-3 text-gray-400 text-sm tooltip">
                  Required
                  <span className="tooltip-text">Select your country</span>
                </span>
                {touched.country && errors.country && (
                  <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Phone (e.g. +1 555-123-4567)"
                className={getFieldClass('phone')}
                required
              />
              {formData.phone && !errors.phone && (
                <span className="absolute right-3 top-3 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              {touched.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="flex items-center mt-4">
              <input
                id="saveAddress"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition duration-200"
              />
              <label
                htmlFor="saveAddress"
                className="ml-2 block text-sm text-gray-700 hover:text-green-600 transition duration-200"
              >
                Save this address for future orders
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 flex justify-center items-center transform hover:scale-105 ${
                  isSubmitting
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Save Address'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden md:block flex-1 relative">
          <img
            src={assets.add_address_iamge}
            alt="Shipping illustration"
            className="w-full max-w-md rounded-lg shadow-md transform hover:scale-105 transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;