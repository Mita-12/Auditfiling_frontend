import React from "react";
import {
  FaMoneyCheckAlt,
  FaShieldAlt,
  FaUserTie,
  FaLock,
  FaChartLine,
  FaBolt,
} from "react-icons/fa";

export default function WhyChooseUs() {
  const cards = [
    {
      title: "Transparent Pricing",
      desc: "Simple, honest pricing with full clarity",
      color: "blue",
    },
    {
      title: "Exact & Trusted",
      desc: "Precise and dependable services every time",
      color: "green",
    },
    {
      title: "Expert Support",
      desc: "Dedicated help from our expert professionals",
      color: "purple",
    },
    {
      title: "100% Data Privacy",
      desc: "Your data is safe with enterprise-grade security",
      color: "red",
    },
    {
      title: "Max Tax Saving",
      desc: "Smart strategies to save more on your taxes",
      color: "orange",
    },
    {
      title: "Fast & Efficient",
      desc: "Quick, high-quality service without delays",
      color: "yellow",
    },
  ];

  const colorMap = {
    blue: "from-blue-50 to-blue-100 border-blue-200",
    green: "from-green-50 to-green-100 border-green-200",
    purple: "from-purple-50 to-purple-100 border-purple-200",
    red: "from-red-50 to-red-100 border-red-200",
    orange: "from-orange-50 to-orange-100 border-orange-200",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200",
  };

  return (
    <section className="py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-gray-900 leading-tight">
              Why Choose <span className="text-blue-600">Auditfiling</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed tracking-wide">
              Choose us for a worry-free business journey. Our expert team handles every
              legal and compliance need with care and precision, simplifying your filings
              and letting you focus on what truly matters—growing your business with
              confidence.
            </p>

            {/* Stats Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center lg:justify-start gap-8 pt-6 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-blue-600">99%</div>
                <div className="text-base sm:text-lg text-gray-500 mt-2">
                  Client Satisfaction
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-blue-600">100+</div>
                <div className="text-base sm:text-lg text-gray-500 mt-2">
                  Businesses Served
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 max-w-xs sm:max-w-sm mx-auto px-4 sm:px-6">
              {cards.slice(0, 1).map((card, index) => (
                <Card key={index} card={card} colorMap={colorMap} />
              ))}
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xs sm:max-w-sm mx-auto">
              {cards.slice(1, 3).map((card, index) => (
                <Card key={index} card={card} colorMap={colorMap} />
              ))}
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0">
              {cards.slice(3, 6).map((card, index) => (
                <Card key={index} card={card} colorMap={colorMap} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable Card Component
function Card({ card, colorMap }) {
  return (
    <div
      className={`group p-4 sm:p-5 rounded-sm shadow-sm bg-gradient-to-br ${colorMap[card.color]} border-transparent hover:border-current transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex-1">
          <h1 className="text-gray-900 text-base sm:text-lg font-bold mb-1">
            {card.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">{card.desc}</p>
        </div>
      </div>
    </div>
  );
}
