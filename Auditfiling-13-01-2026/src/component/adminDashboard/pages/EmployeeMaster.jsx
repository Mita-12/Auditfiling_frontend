import React, { useState } from "react";

const EmployeeMaster = () => {

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Amit Kumar",
      mobile: "9876543210",
      email: "amit@gmail.com",
      address: "Delhi",
      status: "active",
    },
    {
      id: 2,
      name: "Riya Sharma",
      mobile: "9123456789",
      email: "riya@gmail.com",
      address: "Mumbai",
      status: "active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  /* Add / Update Employee */
  const saveEmployee = () => {

    if (!name || !mobile || !email) return;

    if (editId) {

      setEmployees(
        employees.map((emp) =>
          emp.id === editId
            ? { ...emp, name, mobile, email, address }
            : emp
        )
      );

    } else {

      const newEmployee = {
        id: Date.now(),
        name,
        mobile,
        email,
        address,
        status: "active",
      };

      setEmployees([...employees, newEmployee]);

    }

    resetForm();
  };

  /* Edit */
  const editEmployee = (emp) => {
    setEditId(emp.id);
    setName(emp.name);
    setMobile(emp.mobile);
    setEmail(emp.email);
    setAddress(emp.address);
    setShowModal(true);
  };

  /* Block */
  const toggleBlock = (id) => {

    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: emp.status === "active" ? "blocked" : "active",
            }
          : emp
      )
    );
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setMobile("");
    setEmail("");
    setAddress("");
    setShowModal(false);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">Employee Master</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>

      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Mobile No</th>
              <th className="p-3 text-left">Email Id</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {employees.map((emp) => (

              <tr key={emp.id} className="border-t">

                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.mobile}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.address}</td>

                <td className="p-3 space-x-2">

                  <button
                    onClick={() => editEmployee(emp)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleBlock(emp.id)}
                    className={`px-3 py-1 rounded text-white ${
                      emp.status === "active"
                        ? "bg-red-500"
                        : "bg-green-600"
                    }`}
                  >
                    {emp.status === "active" ? "Block" : "Unblock"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Modal */}
      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Employee" : "Add Employee"}
            </h2>

            <input
              type="text"
              placeholder="Name"
              className="border w-full p-2 mb-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Mobile No"
              className="border w-full p-2 mb-3 rounded"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="border w-full p-2 mb-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <textarea
              placeholder="Address"
              className="border w-full p-2 mb-3 rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEmployee}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default EmployeeMaster;