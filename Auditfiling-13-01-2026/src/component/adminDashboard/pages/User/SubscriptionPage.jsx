import React, { useState } from 'react';

const SubscriptionPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const plans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      users: "Up to 5 users",
      usersCount: 5,
      features: ["5 projects", "10GB storage", "Basic support", "Email support"],
      buttonColor: "bg-gray-800 hover:bg-gray-900",
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "/month",
      users: "Up to 20 users",
      usersCount: 20,
      features: ["Unlimited projects", "100GB storage", "Priority support", "Advanced analytics", "Team collaboration"],
      buttonColor: "bg-gray-800 hover:bg-gray-900",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$49.99",
      period: "/month",
      users: "Unlimited users",
      usersCount: "∞",
      features: ["Unlimited projects", "1TB storage", "24/7 phone support", "Custom integrations", "SLA guarantee", "Dedicated manager"],
      buttonColor: "bg-gray-800 hover:bg-gray-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscription Plans
          </h1>
          <p className="text-gray-600 text-sm">
            Choose the perfect plan for your team
          </p>
        </div>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row gap-5 justify-center items-center md:items-stretch">
          {plans.map((plan, index) => {
            const isHovered = hoveredIndex === index;
            const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
            
            return (
              <div
                key={index}
                className={`
                  relative rounded-xl transition-all duration-300 ease-in-out
                  ${isOtherHovered ? 'scale-95' : isHovered ? 'scale-105 z-10' : 'scale-100'}
                  w-full max-w-[280px]
                  cursor-pointer
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card */}
                <div className={`
                  relative rounded-xl overflow-hidden
                  transition-all duration-300
                  ${isHovered 
                    ? 'bg-gray-200 shadow-2xl' 
                    : 'bg-white border-2 border-blue-400 shadow-md'
                  }
                `}>
                  {/* Top Bar */}
                  <div className={`h-1 ${isHovered ? 'bg-gray-600' : 'bg-blue-500'}`}></div>
                  
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                      <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow-md">
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Plan Name */}
                    <div className="text-center mb-4">
                      <h3 className={`text-lg font-bold mb-1 ${isHovered ? 'text-gray-800' : 'text-gray-900'}`}>
                        {plan.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="mt-3">
                        <span className={`text-3xl font-bold ${isHovered ? 'text-gray-800' : 'text-gray-900'}`}>
                          {plan.price}
                        </span>
                        <span className="text-gray-500 text-xs ml-0.5">
                          {plan.period}
                        </span>
                      </div>
                      
                      {/* Users Info */}
                      <div className="mt-2">
                        <div className="flex items-center justify-center gap-1.5 text-xs">
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span className="text-gray-600">{plan.users}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 mb-5">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <svg 
                            className="w-3.5 h-3.5 text-green-500 flex-shrink-0" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-xs">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Subscribe Button */}
                    <button
                      className={`
                        w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200
                        ${isHovered 
                          ? 'bg-gray-800 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }
                      `}
                    >
                      Subscribe Now
                    </button>

                    {/* Free Trial Note */}
                    <p className="text-center text-gray-400 text-xs mt-3">
                      14-day free trial
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-10">
          <p className="text-gray-500 text-xs">
            🔒 No credit card required • Cancel anytime • All prices in USD
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;