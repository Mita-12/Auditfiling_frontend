import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  Search,
  Building,
  Calendar,
  X,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CompanyDetail() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileActionMenu, setMobileActionMenu] = useState(null);
  const navigate = useNavigate();

  // ✅ Get user identifier
  const getUserIdentifier = () => {
    let userId = null;
    let userEmail = sessionStorage.getItem("user_name");

    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user?.id || user?.user_id || user?.userId;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    return userId || userEmail;
  };

  // ✅ Date formatting function
  const formatDate = (dateString) => {
    if (
      !dateString ||
      dateString === "N/A" ||
      dateString === "0000-00-00" ||
      dateString === "0000-00-00 00:00:00"
    ) {
      return "N/A";
    }

    try {
      let dateToFormat = dateString;
      if (dateString.includes(" ")) {
        dateToFormat = dateString.split(" ")[0];
      }

      if (dateToFormat.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateToFormat.split("-");
        const date = new Date(year, month - 1, day);

        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      }

      const date = new Date(dateToFormat);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      return "Invalid Date";
    } catch (error) {
      console.error("❌ Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  };

  // ✅ Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const identifier = getUserIdentifier();
        if (!identifier) {
          console.error("❌ No user identifier found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/public/api/v1/user/all_companies/${identifier}`
        );

        // console.log(response .data);
        
        let companiesData = [];
        if (Array.isArray(response.data)) {
          companiesData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          companiesData = response.data.data;
        } else if (response.data && Array.isArray(response.data.companies)) {
          companiesData = response.data.companies;
        } else if (response.data && typeof response.data === "object") {
          const arrayKeys = Object.keys(response.data).filter((key) =>
            Array.isArray(response.data[key])
          );
          if (arrayKeys.length > 0) {
            companiesData = response.data[arrayKeys[0]];
          }
        }

        if (companiesData && companiesData.length > 0) {
          const formattedCompanies = companiesData.map((item, index) => ({
            id: item.id || item.company_id || index,
            slNo: index + 1,
            name: item.company_name || item.name || item.companyName || "N/A",
            regNo:
              item.registration_no ||
              item.registration_number ||
              item.regNo ||
              "N/A",
            estDate:
              item.establish_date ||
              item.establishment_date ||
              item.estDate ||
              item.date_established ||
              "N/A",
            status: item.status || "Active",
            type: item.company_type || item.type || "N/A",
            address:
              item.address ||
              item.company_address ||
              item.registered_address ||
              "Not Provided",
            email: item.email || "info@company.com",
            mobile: item.mobile || "N/A",
            sector: item.sector || "Information Technology & Services",
            website: item.website || "https://www.example.com",
            gstNo: item.gst_no || "N/A",
            panNo: item.pan_no || "N/A",
            address1: item.address_line1 || item.address1 || "N/A",
            address2: item.address_line2 || item.address2 || "N/A",
            city: item.city || item.city_name || item.town || "N/A",
            state: item.state || item.state_name || "N/A",
            district: item.district || item.district_name || "N/A",
            country: item.country || "India",
            pinCode: item.pin_code || "N/A",
            parentCompany: item.parent_company || "N/A",
          }));

          setCompanies(formattedCompanies);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error("❌ Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // ✅ Delete Company
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    setActionLoading(`delete-${id}`);
    try {
      const identifier = getUserIdentifier();

      const formData = new FormData();
      formData.append("user_id", identifier);
      formData.append("company_id", id);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/companies/destroy`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setCompanies(companies.filter((c) => c.id !== id));
        setMobileActionMenu(null);
        alert(`Company ${name} deleted successfully!`);
      } else {
        alert(`Failed: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Error deleting company:", error);
      alert("Failed to delete company");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ View Company Details (open modal)
  const handleView = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
    setMobileActionMenu(null);
  };

  // ✅ Edit Company
  const handleEdit = (company) => {
    // navigate to edit form and pass full company details so the form can prefill
    try {
      setMobileActionMenu(null);
      navigate("/company-detailform", {
        state: {
          company: {
            id: company.id,
            companyName: company.name,
            registrationNumber: company.regNo,
            establishDate: company.estDate,
            address1: company.address1 || company.address,
            address2: company.address2 || "",
            city: company.city,
            state: company.state,
            district: company.district,
            pinCode: company.pinCode,
            country: company.country,
            companyType: company.type,
            status: company.status,
            email: company.email,
            mobile: company.mobile,
          },
          isEditing: true,
        },
      });
    } catch (error) {
      console.error("❌ Error navigating to edit:", error);
      alert("Failed to open edit form");
    }
  };

  const handleAddCompany = () => {
    navigate("/company-detailform", { state: { isEditing: false } });
  };

  // ✅ Filter companies
  const filteredCompanies = companies.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.regNo.toLowerCase().includes(search)
    );
  });

  // Mobile Company Card Component
  const MobileCompanyCard = ({ company }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Building className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-gray-800 text-base truncate">
              {company.name}
            </h3>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Reg: {company.regNo}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setMobileActionMenu(mobileActionMenu === company.id ? null : company.id)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {mobileActionMenu === company.id && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => handleView(company)}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => handleEdit(company)}
                className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(company.id, company.name)}
                disabled={actionLoading === `delete-${company.id}`}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {actionLoading === `delete-${company.id}` ? 'Deleting...' : 'Delete'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(company.estDate)}</span>
        </div>
        <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
          {company.type}
        </div>
      </div>

      {/* Status */}
      <div className="mt-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          company.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {company.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-6 mt-30 px-3 sm:px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <Building className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-2 sm:mr-3" />
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
              Company Details
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-2">
            Manage and view all your registered companies in one place.
          </p>
        </div>

        {/* Search + Add */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-colors duration-200 text-sm sm:text-base"
              />
            </div>

            <button
              onClick={handleAddCompany}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              Add Company
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden">
          {loading ? (
            <div className="p-8 text-center bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-3"></div>
              <div className="text-gray-500 text-sm">Loading companies...</div>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="space-y-3">
              {filteredCompanies.map((company) => (
                <MobileCompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl shadow-lg border border-gray-100 text-gray-500">
              No companies found.
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-gray-500">Loading companies...</div>
              </div>
            ) : filteredCompanies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">SL No</th>
                      <th className="px-6 py-4 text-left">Company Name</th>
                      <th className="px-6 py-4 text-left">Registration No</th>
                      <th className="px-6 py-4 text-left">Establish Date</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCompanies.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">{c.slNo}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {c.name}
                        </td>
                        <td className="px-6 py-4">{c.regNo}</td>
                        <td className="px-6 py-4">{formatDate(c.estDate)}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleView(c)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Eye className="w-6 h-6" />
                            </button>
                            <button
                              onClick={() => handleEdit(c)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                            >
                              <Edit2 className="w-6 h-6" />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id, c.name)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                No companies found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Modal for Company Details */}
      {isModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-2xl lg:max-w-5xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                Company Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
              {[
                ["Name", selectedCompany.name],
                ["Email ID", selectedCompany.email],
                ["Mobile No.", selectedCompany.mobile],
                ["Registration No", selectedCompany.regNo],
                ["Company Type", selectedCompany.type],
                ["Sector", selectedCompany.sector],
                ["Establish Date", formatDate(selectedCompany.estDate)],
                ["Website", selectedCompany.website],
                ["GST No", selectedCompany.gstNo],
                ["PAN No", selectedCompany.panNo],
                ["Address 1", selectedCompany.address1],
                ["Address 2", selectedCompany.address2],
                ["City", selectedCompany.city],
                ["State", selectedCompany.state],
                ["Country", selectedCompany.country],
                ["Pin Code", selectedCompany.pinCode],
                ["Parent Company Name", selectedCompany.parentCompany],
              ].map(([label, value]) => (
                <div key={label} className="wrap-break-words">
                  <p className="font-semibold text-gray-600 text-xs sm:text-sm">{label}</p>
                  <p className="text-xs sm:text-sm mt-1">{value || "N/A"}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Action Menu Overlay */}
      {mobileActionMenu && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileActionMenu(null)}
        />
      )}
    </div>
  );
}