import React, { useState } from "react";

const CustomerMaster = () => {

  const [customers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9876543210",
      address: "Delhi, India",
      date: "18 Mar 2026",
      services: ["GST Registration", "ITR Filing"],
    },
    {
      id: 2,
      name: "Anita Verma",
      email: "anita@gmail.com",
      phone: "9123456780",
      address: "Mumbai, India",
      date: "17 Mar 2026",
      services: ["Company Registration"],
    },
  ]);

  const [profile, setProfile] = useState(null);
  const [purchase, setPurchase] = useState(null);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Customer Master</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Sl No</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Email ID</th>
              <th className="p-3 text-left">Phone No</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Time & Date</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>

          <tbody>

            {customers.map((customer, index) => (

              <tr key={customer.id} className="border-t">

                <td className="p-3">{index + 1}</td>
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.phone}</td>
                <td className="p-3">{customer.address}</td>
                <td className="p-3">{customer.date}</td>

                <td className="p-3 space-x-2">

                  <button
                    onClick={() => setProfile(customer)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => setPurchase(customer)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Purchase Services
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Profile Modal */}
      {profile && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-xl font-bold mb-4">Customer Profile</h2>

            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Phone:</b> {profile.phone}</p>
            <p><b>Address:</b> {profile.address}</p>

            <button
              onClick={() => setProfile(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* Purchase Services Modal */}
      {purchase && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-xl font-bold mb-4">
              Purchased Services
            </h2>

            <ul className="list-disc pl-5">

              {purchase.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}

            </ul>

            <button
              onClick={() => setPurchase(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default CustomerMaster;