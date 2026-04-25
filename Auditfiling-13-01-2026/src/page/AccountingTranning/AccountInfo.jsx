import React from "react";
import { FaClock } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { HiOutlineCalendarDays } from "react-icons/hi2";




const AccountantInfo = () => {
    return (
        <div className="min-h-screen p-2 sm:p-2 bg-gray-50">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-sm sm:text-lg font-serif text-gray-800 text-center bg-blue-200 rounded-xl py-1">
                    Accounts / Accountant – Training, Career & Professional Services
                </h2>
                <p className="text-gray-600 text-center text-sm mt-4">
                    Practical accounting coaching with real-world exposure and complete accounting & taxation services
                </p>
            </div>

            <section className="bg-white py-10 px-6 rounded-2xl shadow-sm mt-8">

                {/* COURSE / COACHING */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    {/* IMAGE */}
                    <div className="flex justify-center order-2 md:order-1">
                        <img
                            src="/img/Invoice.png"
                            alt="Accounting course modules"
                            className="max-w-lg w-full rounded-2xl"
                        />
                    </div>

                    {/* CONTENT */}
                    <div className="order-1 md:order-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Accounting Coaching Program
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Practical, job-oriented accounting training with industry tools
                        </p>

                        {/* TRAINING INFO */}
                        <div className="mt-6 grid sm:grid-cols-3 gap-2">

                            {/* Duration */}
                            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="text-blue-600 text-lg mt-0.5">
                                    <HiOutlineCalendarDays />
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-gray-600">
                                        Training Duration
                                    </span>

                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        3 Months (Practical Program)
                                    </p>
                                </div>
                            </div>

                            {/* Batch Timings */}
                            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                <div className="text-green-600 text-lg mt-0.5">
                                    <FaClock />
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-gray-600">
                                        Class Timings
                                    </span>

                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        Morning & Evening Batches
                                    </p>
                                </div>
                            </div>

                            {/* Training Mode */}
                            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="text-blue-600 text-lg mt-0.5">
                                    <MdOutlineAccessTime />
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-gray-600">
                                        Training Mode
                                    </span>

                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        Online / Offline
                                    </p>
                                </div>
                            </div>

                        </div>


                        <h4 className="mt-6 text-xl font-semibold text-blue-600">
                            CTRI – Practical Accounting Coaching
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                            Live practice • GST filing • Accounting software training
                        </p>

                        <ul className="mt-6 space-y-3 text-gray-600 list-disc pl-5">
                            <li>Basic Accounting (Journal, Ledger, Trial Balance)</li>
                            <li>Final Accounts (Trading, P&amp;L, Balance Sheet)</li>
                            <li>Tally Prime with GST</li>
                            <li>GST Registration, Returns & Practical Filing</li>
                            <li>Income Tax Basics & ITR Filing Overview</li>
                            <li>Cost Accounting (Fundamentals)</li>
                            <li>Excel for Accounting (Basic to Intermediate)</li>
                            <li>Practical Accounting with Real Business Examples</li>
                            <li>Training on industry-used accounting software</li>
                        </ul>
                    </div>
                </div>

                {/* ELIGIBILITY */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center mt-16">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Who Should Enroll?
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Who can join our accounting coaching program
                        </p>

                        <ul className="mt-6 space-y-3 text-gray-600 list-disc pl-5">
                            <li>B.Com / M.Com (Accounts, Finance)</li>
                            {/* <li>CA (Inter / Final)</li> */}
                            <li>CMA (Inter / Final)</li>
                            <li>MBA (Finance)</li>
                            <li>BBA (Finance)</li>
                            <li>Any Graduate with basic accounting knowledge</li>
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <img
                            src="/img/eligibility.png"
                            alt="Accounting eligibility illustration"
                            className="max-w-lg w-full rounded-2xl"
                        />
                    </div>
                </div>

                {/* BENEFITS */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center mt-16">

                    <div className="flex justify-center">
                        <img
                            src="/img/GST CAM 912-19.jpg"
                            alt="Accounting career benefits"
                            className="max-w-lg w-full rounded-2xl"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Benefits of Accounting Career & Training with Us
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Why accounting is a smart career choice
                        </p>

                        <ul className="mt-6 space-y-3 text-gray-600 list-disc pl-5">
                            <li>Stable and secure career option</li>
                            <li>High demand in every industry</li>
                            <li>Strong salary growth with experience</li>
                            <li>Work exposure in GST, Income Tax & Audits</li>
                            <li>Improves financial & analytical skills</li>
                            <li>Clear growth path (Accounts → Senior → Finance Manager)</li>
                            <li>Office-based, professional work environment</li>
                            <li>Freelancing & consultancy opportunities</li>
                            <li>Helpful for starting your own business</li>
                        </ul>
                    </div>

                    <div>

                    </div>

                </div>

            </section>
            {/* CONTACT / QUERY SECTION */}
            <div className="max-w-7xl mx-auto mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-10 text-center">
                <h2 className="text-4xl font-bold text-gray-900">
                    Have Any Query or Interested in This Program?
                </h2>

                <p className="text-gray-600 text-sm ">
                    Feel free to call us for course details, fees, batch timings, or career guidance
                </p>

                <div className="mt-4 space-y-2 text-gray-700 ">
                    <p className="font-bold  text-blue-900">Branch Office</p>

                <p className="text-gray-700 text-lg">
                    <a
                      href="https://maps.app.goo.gl/GDArGKbynTLdLFUw6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600  transition-colors duration-200"
                    >
                      3rd Floor, BMC Panchadeep Market Complex, <br/>Unit 4, Bhouma Nagar, Bhubaneswar, Odisha 751001
                    </a>
                  </p>

                    <p className="text-lg font-semibold text-blue-600 mt-3">
                        📞 +91 7428600607
                    </p>
                </div>
            </div>

        </div>
    );
};

export default AccountantInfo;
