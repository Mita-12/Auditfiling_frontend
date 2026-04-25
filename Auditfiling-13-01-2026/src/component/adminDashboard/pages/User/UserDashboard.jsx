import React from "react";
import {
  Building2,
  FileText,
  CheckCircle,
  CreditCard,
  MessageSquare,
  ArrowUpRight,
  Clock3,
  User,
} from "lucide-react";

export default function UserDashboardPage() {
  const stats = [
    {
      title: "Total Services",
      value: "12",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Completed",
      value: "8",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending",
      value: "4",
      icon: Clock3,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Payments",
      value: "₹15,999",
      icon: CreditCard,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const recentServices = [
    {
      id: 1,
      name: "GST Registration",
      status: "Pending",
      date: "02 Apr 2026",
    },
    {
      id: 2,
      name: "Trademark Registration",
      status: "In Progress",
      date: "30 Mar 2026",
    },
    {
      id: 3,
      name: "Company Incorporation",
      status: "Completed",
      date: "18 Mar 2026",
    },
  ];

  const payments = [
    {
      id: 1,
      service: "GST Registration",
      amount: "₹1,999",
      date: "01 Apr 2026",
    },
    {
      id: 2,
      service: "Company Incorporation",
      amount: "₹9,999",
      date: "15 Mar 2026",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-blue-100 text-sm uppercase tracking-wider mb-2">
              Welcome Back
            </p>
            <h1 className="text-4xl font-bold mb-3">John Doe</h1>
            <p className="text-blue-100 max-w-2xl">
              Manage your company details, track service requests, monitor payments, and stay updated with your business activities from one place.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 min-w-[260px]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <User size={30} />
              </div>

              <div>
                <h3 className="text-xl font-semibold">Premium User</h3>
                <p className="text-blue-100 text-sm">
                  Active Membership
                </p>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-white/20">
              <p className="text-sm text-blue-100">Company</p>
              <h4 className="font-semibold text-lg mt-1">
                ABC Private Limited
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">{item.title}</p>
                  <h2 className="text-3xl font-bold text-slate-800 mt-2">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Service Requests
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Track your latest services and progress
              </p>
            </div>

            <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
              View All
              <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {recentServices.map((service) => (
              <div
                key={service.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-slate-200 rounded-3xl p-5 hover:bg-slate-50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Building2 size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Applied on {service.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    service.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : service.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Recent Payments
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Latest payment activities
            </p>
          </div>

          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border border-slate-200 rounded-3xl p-5 hover:bg-slate-50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {payment.service}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {payment.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-800">
                      {payment.amount}
                    </p>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Paid
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white">
            <h3 className="font-semibold text-lg">
              Need Help?
            </h3>
            <p className="text-sm text-blue-100 mt-2">
              Contact our support team for any service or payment issue.
            </p>

            <button className="mt-4 px-5 py-2.5 rounded-2xl bg-white text-indigo-600 font-semibold hover:bg-slate-100 transition-all duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}