import React from "react";
import AccountantInfo from "./AccountInfo";

const AccountingTranning = () => {
  return (
    <section className="overflow-hidden">
      <div className="relative w-full">
      

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-40 grid grid-cols-1 lg:grid-cols-3 items-center gap-8 md:gap-10">

          {/* Left Image - hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex justify-center lg:justify-start">
                    <div className="absolute  translate-x-5 bottom-20 h-64 w-64 bg-blue-300 rounded-full"></div> 

            <div className="relative">
              <img
                src="https://plus.unsplash.com/premium_photo-1661688164534-db78aaf825b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWNjb3VudGluZyUyMHNlcnZpY2VzfGVufDB8fDB8fHww"
                alt="Employee"
                className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-full shadow-lg"
              />
             
            </div>
          </div>

          {/* Center Content - Full width on mobile, centered on desktop */}
          <div className="text-center lg:col-span-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-800 transition-colors duration-300">
              The Accounting Service
              <span className="block mt-2">starts with us</span>
            </h1>
            
      

          </div>

          {/* Right Image - shown on mobile with adjustments */}
          <div className="flex justify-center lg:justify-end relative mt-8 md:mt-0">
            <div className="relative">
              {/* Purple background shape - hidden on mobile, shown on desktop */}
              <div className="hidden md:block absolute -bottom-6 -left-6 w-56 h-20 md:w-72 md:h-24 bg-[#B65CFF] rotate-[-6deg] rounded-lg"></div>

              <img
                src="https://plus.unsplash.com/premium_photo-1661758908295-72b9780d15c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWNjb3VudGluZyUyMGZpcm18ZW58MHx8MHx8fDA%3D"
                alt="Team member"
                className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-65 object-cover rounded-xl shadow-lg"
              />

             
            </div>
          </div>
        </div>

        {/* Mobile images row - shown only on mobile */}
        <div className="lg:hidden flex justify-center items-center gap-6 px-4 mb-8">
          <div className="relative">
            <img
              src="https://media.gettyimages.com/id/1369199360/photo/portrait-of-a-handsome-young-businessman-working-in-office.jpg?s=612x612&w=gi&k=20&c=BFc13n-vhT4GMd0ohRt0PFD3IzJ_Onf6nKDAObgh1CA="
              alt="Employee"
              className="w-32 h-32 object-cover rounded-full shadow-md"
            />
          </div>
          
          <div className="relative">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/007/486/093/small/portrait-of-happy-redhaired-woman-employee-in-optical-glasses-has-satisfied-expression-works-with-modern-gadgets-waits-for-meeting-with-colleague-prepares-accounting-report-sits-in-own-cabinet-free-photo.jpg"
              alt="Team member"
              className="w-32 h-32 object-cover rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>
      
      {/* Accountant Info Component */}
      <div className="px-4 sm:px-6 lg:px-8">
        <AccountantInfo />
      </div>
    </section>
  );
};

export default AccountingTranning;