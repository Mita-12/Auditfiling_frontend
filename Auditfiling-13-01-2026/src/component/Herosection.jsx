import React from "react";
import LoginForm from "../form/LoginForm";

export default function Herosection() {


  return (
    <>
      {/* Hero Section */}
      <section className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-white text-[#222222] text-center px-6 md:px-12">
        {/* Hero Heading */}
        <h1 className="text-5xl font-bold font-serif mt-25 pt-20 leading-tight">
          Trusted Legal Services
          <br />
          for Your <span className="text-black">Business & Compliance</span>
        </h1>

        {/* Subheading */}
        <h1 className="mt-6 text-lg text-[15px] text-gray-700 max-w-2xl pt-5 mx-auto leading-relaxed">
          From{" "}
          <span className="font-semibold text-blue-600">Company Registration</span>{" "}
          to{" "}
          <span className="text-blue-600 font-semibold">GST, Trademarks</span>, and{" "}
          <span className="text-blue-600 font-semibold">Compliance</span> —{" "}
          <span className="font-bold text-gray-900">Auditfiling</span> is your trusted
          one-stop partner for all legal and financial needs.
        </h1>

        {/* Hero Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          {/* Get Started button (opens login modal) */}
          <a href="/contact-us"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
          >        Get Started
          </a>
          <a
            href="/blog"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:scale-105 transition-transform duration-300"
          >
            Explore Services
          </a>
        </div>

        {/* Trust Badge */}
        <div className="mt-10 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-lg px-6 py-3 shadow-lg border">
          <span className="text-lg">✅</span>
          <p className="text-sm md:text-base text-gray-800 font-medium">
            Trusted by <span className="text-blue-600 font-semibold">500+ Businesses</span> | ⚖️ Expert Legal Professionals
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="w-full bg-white">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-14 md:gap-30 max-w-7xl mx-auto px-6">
          {/* Image */}
          <div className="w-full md:w-2/3 flex justify-center">
            <img
              src="/img/support1.webp"
              alt="Who Are We"
              className="w-full rounded-2xl object-cover"
             
            />

          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6 font-serif leading-tight text-gray-900">
              Who Are We?
            </h1>
            <div className="text-justify p-0">
              <p className="text-base sm:text-lg text-gray-700 leading-loose tracking-wide">
                At Auditfiling, we believe legal and tax compliance shouldn't be complicated or stressful. We're here to make it simple, reliable, and accessible for everyone from small startups to growing enterprises.
                <br /><br />
                As a proud part of{" "}
                <span className="font-bold text-blue-600">Cloudsat Pvt. Ltd.</span>, headquartered in Gurugram, Auditfiling has been helping businesses across India for over 7 years.
              </p>
            </div>
            <a
              href="/about-us"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-colors mt-6"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

