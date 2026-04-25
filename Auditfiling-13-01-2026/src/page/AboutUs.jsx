
import React from "react";
import WhatsAppButton from "../form/WhatsAppPopup";
import { FaBullseye, FaRocket } from 'react-icons/fa';



const values = [
  {
    title: "Our Mission",
    description:
      "To simplify legal, tax, and compliance processes through technology, expertise, and transparency. We aim to deliver reliable, affordable, and efficient services that help businesses, startups, and individuals meet their statutory obligations with ease.",
    icon: <FaBullseye className="text-blue-600" />,
  },
  {
    title: "Our Future Focus",
    description:
      "To revolutionize India's compliance landscape through innovation, technology, and trust—making legal and financial processes truly simple, smart, and accessible to everyone. Auditfiling aims to bridge every city and corner of the nation with seamless digital solutions, empowering businesses to stay compliant and confident in the new era of growth.",
    icon: <FaRocket className="text-green-600" />,
  },
];

const weKnowFor = [
  {
    title: "Easy to Access",
    desc: "Access our services anytime, anywhere in India — online, in-person, or over a call.",
  },
  {
    title: "Experienced Team",
    desc: "A dedicated team with deep experience, guiding you through every filing and compliance task.",
  },
  {
    title: "Timely Alerts",
    desc: "We alert you on time and follow up, so you’re always up to date and never miss a deadline.",
  },
  {
    title: "Fast Resolution",
    desc: "Fast, efficient support to resolve issues quickly — keeping your compliance stress-free.",
  },
];



export default function AboutUsPage() {
  return (
    <div>


      {/* WHO ARE WE SECTION (Two-Column Layout) */}
      <section className="text-black py-5 px-4 mt-30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="text-left ">
            <h1 className="text-black font-bold font-serif text-8xl mb-4 ">
              Who
            </h1>
            <h1 className=" text-black font-bold font-serif text-8xl">Are We? </h1>

          </div>

          {/* RIGHT SIDE */}
          <div className="text-gray-800 text-xl mt-10  leading-loose tracking-wide text-justify p-2 ">
            <p className="mb-2">
              At <span className="font-bold text-blue-600 text-lg">Auditfiling</span>, we believe
              legal and tax compliance shouldn’t be complicated or stressful.
              We’re here to make it simple, reliable, and accessible for
              everyone from small startups to growing enterprises.
            </p>

            <p className="mb-2">
              As a proud part of{" "}
              <span className="font-bold text-blue-600 text-lg ">Cloudsat Pvt. Ltd.(CIN: U72900HR2022PTC105173)
</span>,
              headquartered in Gurugram, Auditfiling has been helping businesses
              across India for over 7 years. Our expert team blends technology,
              experience, and personal guidance to make services like GST
              registration, ITR filing, company incorporation, and compliance
              management smoother than ever.
            </p>

            <p className="mb-2">
              With offices in New Delhi, Bhubaneswar, and Kolkata and upcoming
              locations in Ahmedabad, Hyderabad, Pune, Bengaluru, and Mumbai
              we’re expanding our reach to serve every corner of India.
            </p>

            <p className="">
              At Auditfiling, we don’t just file your documents  we help your
              business stay compliant, grow confidently, and focus on what
              matters most: <span className="font-semibold">success</span>.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
    <section className="px-4 bg-white">
  <div className="max-w-6xl mx-auto text-center">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-15 mt-10">
      {values.map((value, idx) => (
        <div
          key={idx}
          className="bg-white shadow-md rounded-2xl p-12 min-h-[400px] border border-gray-100 
                   hover:shadow-lg hover:bg-blue-50 transition-all duration-300 flex flex-col justify-center"
        >
          {/* Icon added here */}
          <div className="mb-6 text-4xl flex justify-center">
            {value.icon}
          </div>
          <h1 className="text-2xl font-semibold mb-4 font-serif text-blue-600 tracking-wide">
            {value.title}
          </h1>
          <p className="text-gray-700 leading-loose tracking-wide text-lg">
            {value.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* WE KNOW FOR SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold font-serif text-gray-900 mb-4">
              Why Businesses Choose Us
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {weKnowFor.map((item, index) => {
              // Assign a different background color per card
              const bgColors = [
                "bg-blue-50",
                "bg-green-50",
                "bg-yellow-50",
                "bg-purple-50",
                "bg-pink-50",
                "bg-indigo-50",
              ];
              const bgColor = bgColors[index % bgColors.length];

              return (
                <div
                  key={index}
                  className={`group ${bgColor} rounded-xl shadow-lg border border-gray-100 p-4 
              hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 
              relative overflow-hidden cursor-pointer min-h-[150px] flex items-center justify-center`}
                >
                  {/* Background remains same color on hover */}
                  <div className={`absolute inset-0 ${bgColor} opacity-100`} />

                  <div className="relative z-10 w-full text-center">
                    {/* Title - Wrap in 2 lines max */}
                    <div className="transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:scale-95">
                      <h1 className="text-2xl font-bold text-gray-900 leading-snug line-clamp-2 break-words">
                        {item.title}
                      </h1>
                    </div>

                    {/* Description - Shows on Hover */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 transition-all duration-500 opacity-0 group-hover:opacity-100">
                      <p className="text-gray-700 text-lg leading-relaxed tracking-wide text-center">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Border */}
                  <div
                    className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 
                transition-all duration-500 group-hover:w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <WhatsAppButton />

    </div>
  );
}



