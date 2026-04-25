import React from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";


function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex flex-col  items-center justify-center px-4 mt-30 text-center  py-20 ">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-red-600 mb-4 opacity-90">
            4
            <span className="inline-block animate-bounce">0</span>
            4
          </h1>
          <div className="absolute -inset-4 bg-blue-200 rounded-full blur-xl opacity-30 -z-10"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-2">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Don't worry, even the best explorers get lost sometimes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default NotFoundPage;