import React from "react";
import { FaBell, FaCalendarAlt } from "react-icons/fa";

export default function NotificationUpdates() {
  // Updates with categories
  const updates = [
    {
      id: 1,
      text: "GST Registration in Just 72hr with India’s New Auto-Approval System (Effective Nov 2025)",
      category: "GST",
      timestamp: "12-11-2025",
    },
    {
      id: 2,
      text: "GSTR-3B Due Date is Approaching! File returns on or before 20.04.2025 & be compliant.",
      category: "GST",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      text: "Attention GST Composition Taxpayers! Form CMP-08 for Q4 is due on 18.04.2025 - Act now!",
      category: "GST",
      timestamp: "1 day ago",
    },
    {
      id: 4,
      text: "From April 2025, all GST taxpayers must report HSN codes in Table 12 of GSTR-1/1A!",
      category: "GST",
      timestamp: "2 days ago",
    },
    {
      id: 5,
      text: "MCA imposes ₹7 lakh penalty on company for failing to maintain its registered office!",
      category: "MCA",
      timestamp: "3 days ago",
    },
    {
      id: 6,
      text: "National Savings Scheme account holders can now withdraw funds without TDS!",
      category: "Income Tax",
      timestamp: "4 days ago",
    },
    {
      id: 7,
      text: "MCA issues show cause notice to companies for cost audit non-compliance - Act now!",
      category: "MCA",
      timestamp: "5 days ago",
    },
  ];

  // ✅ Fixed Due Dates Array
  const dueDates = [
    {
      id: 1,
      text: "TDS Payment for March 2025",
      date: "30-Apr-2025",
      category: "TDS",
    },
    {
      id: 2,
      text: "Professional Tax (PT) on Salaries for April 2025",
      date: "10-May-2025",
      category: "PT",
    },
    {
      id: 3,
      text: "GSTR 1 (Monthly) for April 2025",
      date: "11-May-2025",
      category: "GST",
    },
    {
      id: 4,
      text: "GSTR 1 IFF (Optional) (Apr 2025) for QRMP",
      date: "13-May-2025",
      category: "GST",
    },
    {
      id: 5,
      text: "Provident Fund (PF) & ESI Returns and Payment for April 2025",
      date: "15-May-2025",
      category: "PF/ESI",
    },
    {
      id: 6,
      text: "GSTR 3B for April 2025 (Monthly)",
      date: "20-May-2025",
      category: "GST",
    },
    {
      id: 7,
      text: "TDS Return in Form 24Q, 26Q, and 27Q for Jan-Mar 2025",
      date: "31-May-2025",
      category: "TDS",
    },
    {
      id: 8,
      text: "Advance Tax Payment for April to June 2025 (1st Installment)",
      date: "15-Jun-2025",
      category: "Income Tax",
    },
    {
      id: 9,
      text: "Provident Fund (PF) & ESI Returns and Payment for May 2025",
      date: "15-Jun-2025",
      category: "PF/ESI",
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      GST: "bg-purple-100 text-purple-800 border-purple-200",
      MCA: "bg-blue-100 text-blue-800 border-blue-200",
      TDS: "bg-green-100 text-green-800 border-green-200",
      "Income Tax": "bg-red-100 text-red-800 border-red-200",
      PT: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "PF/ESI": "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
            <FaBell className="text-xl sm:text-2xl text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-serif">
            Notifications & Alerts
            <span className="block w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-blue-600 mx-auto mt-2 sm:mt-3 transition-all duration-500"></span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Stay updated with important compliance deadlines and regulatory changes
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
          {/* Left Column - Updates */}
          <div className="rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <FaBell className="text-lg sm:text-xl" />
                <h3 className="text-lg sm:text-xl font-bold font-serif">Latest Updates</h3>
              </div>
              <p className="text-blue-800 text-xs sm:text-sm mt-1">
                Recent regulatory changes and announcements
              </p>
            </div>

            <div className="h-80 sm:h-96 overflow-y-auto scroll-smooth p-4 sm:p-6 space-y-3 sm:space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColor(update.category)}`}>
                          {update.category}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{update.timestamp}</span>
                      </div>
                      <p className="text-gray-800 font-medium leading-relaxed sm:leading-loose tracking-wide text-xs sm:text-sm">
                        {update.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Due Dates */}
          <div className="rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <FaCalendarAlt className="text-lg sm:text-xl" />
                <h3 className="text-lg sm:text-xl font-bold font-serif">Due Dates</h3>
              </div>
              <p className="text-blue-800 text-xs sm:text-sm mt-1">
                Upcoming compliance deadlines and filings
              </p>
            </div>

            <div className="h-80 sm:h-96 overflow-y-auto scroll-smooth p-4 sm:p-6 space-y-3 sm:space-y-4">
              {dueDates.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium mb-2 leading-relaxed sm:leading-loose tracking-wide text-xs sm:text-sm">
                        {item.text}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0 min-w-20 sm:min-w-24">
                      <div className="text-xs font-semibold text-red-600 mb-1 uppercase tracking-wide">
                        Due Date
                      </div>
                      <div className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-gray-500 text-xs sm:text-sm">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
