import axios from 'axios';
import React, { useState, useEffect } from 'react';
import state_city from "../../../../assets/state_city.json";
import companyData from "../../../../assets/companytype.json";

const UserCompanyDetails = () => {
  const [companies, setCompanies] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [pins, setPins] = useState([]);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    mobileNo: '',
    landlineNo: '',
    registrationNo: '',
    companyType: '',
    sector: '',
    establishDate: '',
    website: '',
    gstNo: '',
    panNo: '',
    address1: '',
    address2: '',
    country: 'India',
    state: '',
    district: '',
    city: '',
    pinCode: '',
    logo: null,
    isParent: 0,
    parentCompanyName: '',
  });
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  // Helper function to get token from sessionStorage
  const getAuthToken = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      return user?.token || null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Helper function to get headers with token
  const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  // Get headers for multipart/form-data (for file upload)
  const getMultipartHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  // Fetch all companies on component mount
  useEffect(() => {
    // Load states from JSON
    if (state_city && typeof state_city === 'object') {
      setStates(Object.keys(state_city));
    }
    
    // Load company types and sectors from JSON
    if (companyData) {
      if (companyData.company_types) {
        setCompanyTypes(companyData.company_types);
      }
      if (companyData.sectors) {
        setSectors(companyData.sectors);
      }
    }
    
    fetchCompanies();
  }, []);

  // Handle state change - load districts
  useEffect(() => {
    if (formData.state && state_city[formData.state]) {
      const stateData = state_city[formData.state];
      setDistricts(Object.keys(stateData));
      setCities([]);
      setPins([]);
      // Reset dependent fields
      setFormData(prev => ({
        ...prev,
        district: '',
        city: '',
        pinCode: ''
      }));
    } else {
      setDistricts([]);
      setCities([]);
      setPins([]);
    }
  }, [formData.state]);

  // Handle district change - load cities
  useEffect(() => {
    if (formData.state && formData.district && state_city[formData.state]?.[formData.district]) {
      const districtData = state_city[formData.state][formData.district];
      setCities(Object.keys(districtData));
      setPins([]);
      // Reset dependent fields
      setFormData(prev => ({
        ...prev,
        city: '',
        pinCode: ''
      }));
    } else {
      setCities([]);
      setPins([]);
    }
  }, [formData.state, formData.district]);

  // Handle city change - load pin codes
  useEffect(() => {
    if (formData.state && formData.district && formData.city && 
        state_city[formData.state]?.[formData.district]?.[formData.city]) {
      const pinData = state_city[formData.state][formData.district][formData.city];
      // Handle both array and single value
      const pinArray = Array.isArray(pinData) ? pinData : pinData ? [pinData] : [];
      setPins(pinArray);
      
      // Auto-select pin if only one option
      if (pinArray.length === 1) {
        setFormData(prev => ({
          ...prev,
          pinCode: pinArray[0]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          pinCode: ''
        }));
      }
    } else {
      setPins([]);
      setFormData(prev => ({
        ...prev,
        pinCode: ''
      }));
    }
  }, [formData.state, formData.district, formData.city]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/company/my`, {
        headers: getAuthHeaders(),
      });
      
      if (response.data.success) {
        setCompanies(response.data.companies || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch companies');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check the URL.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch companies');
      }
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      companyName: '',
      email: '',
      mobileNo: '',
      landlineNo: '',
      registrationNo: '',
      companyType: '',
      sector: '',
      establishDate: '',
      website: '',
      gstNo: '',
      panNo: '',
      address1: '',
      address2: '',
      country: 'India',
      state: '',
      district: '',
      city: '',
      pinCode: '',
      logo: null,
      isParent: 0,
      parentCompanyName: '',
    });
    setSelectedLogo(null);
    setLogoPreview('');
    setDistricts([]);
    setCities([]);
    setPins([]);
    setShowModal(true);
  };

  const openEditModal = (company) => {
    setModalMode('edit');
    setSelectedCompany(company);
    
    // Set initial form data
    const initialState = {
      companyName: company.company_name || '',
      email: company.email || '',
      mobileNo: company.mobile_no || '',
      landlineNo: company.landline_no || '',
      registrationNo: company.registration_no || '',
      companyType: company.company_type || '',
      sector: company.sector || '',
      establishDate: company.establish_date ? company.establish_date.split('T')[0] : '',
      website: company.website || '',
      gstNo: company.gst_no || '',
      panNo: company.pan_no || '',
      address1: company.address_1 || '',
      address2: company.address_2 || '',
      country: company.country || 'India',
      state: company.state || '',
      district: company.district || '',
      city: company.city || '',
      pinCode: company.pin_code || '',
      logo: null,
      isParent: company.is_parent || 0,
      parentCompanyName: company.parent_company_name || '',
    };
    
    setFormData(initialState);
    
    // Load districts based on state
    if (company.state && state_city[company.state]) {
      setDistricts(Object.keys(state_city[company.state]));
    }
    
    // Load cities based on state and district
    if (company.state && company.district && state_city[company.state]?.[company.district]) {
      setCities(Object.keys(state_city[company.state][company.district]));
    }
    
    // Load pins based on state, district, city
    if (company.state && company.district && company.city && 
        state_city[company.state]?.[company.district]?.[company.city]) {
      const pinData = state_city[company.state][company.district][company.city];
      const pinArray = Array.isArray(pinData) ? pinData : pinData ? [pinData] : [];
      setPins(pinArray);
    }
    
    setLogoPreview(company.logo_url || '');
    setSelectedLogo(null);
    setShowModal(true);
  };

  const openViewModal = (company) => {
    setModalMode('view');
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (modalMode === 'add') {
        // For add: Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('company_name', formData.companyName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('mobile_no', formData.mobileNo);
        formDataToSend.append('landline_no', formData.landlineNo);
        formDataToSend.append('registration_no', formData.registrationNo);
        formDataToSend.append('company_type', formData.companyType);
        formDataToSend.append('sector', formData.sector);
        formDataToSend.append('establish_date', formData.establishDate);
        formDataToSend.append('website', formData.website);
        formDataToSend.append('gst_no', formData.gstNo);
        formDataToSend.append('pan_no', formData.panNo);
        formDataToSend.append('address_1', formData.address1);
        formDataToSend.append('address_2', formData.address2);
        formDataToSend.append('country', formData.country);
        formDataToSend.append('state', formData.state);
        formDataToSend.append('district', formData.district);
        formDataToSend.append('city', formData.city);
        formDataToSend.append('pin_code', formData.pinCode);
        formDataToSend.append('is_parent', formData.isParent);
        formDataToSend.append('parent_company_name', formData.parentCompanyName);
        
        if (selectedLogo) {
          formDataToSend.append('logo', selectedLogo);
        }
        
        response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/company`, formDataToSend, {
          headers: getMultipartHeaders(),
        });
      } else {
        // For edit: Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('company_name', formData.companyName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('mobile_no', formData.mobileNo);
        formDataToSend.append('landline_no', formData.landlineNo);
        formDataToSend.append('registration_no', formData.registrationNo);
        formDataToSend.append('company_type', formData.companyType);
        formDataToSend.append('sector', formData.sector);
        formDataToSend.append('establish_date', formData.establishDate);
        formDataToSend.append('website', formData.website);
        formDataToSend.append('gst_no', formData.gstNo);
        formDataToSend.append('pan_no', formData.panNo);
        formDataToSend.append('address_1', formData.address1);
        formDataToSend.append('address_2', formData.address2);
        formDataToSend.append('country', formData.country);
        formDataToSend.append('state', formData.state);
        formDataToSend.append('district', formData.district);
        formDataToSend.append('city', formData.city);
        formDataToSend.append('pin_code', formData.pinCode);
        formDataToSend.append('is_parent', formData.isParent);
        formDataToSend.append('parent_company_name', formData.parentCompanyName);
        
        if (selectedLogo) {
          formDataToSend.append('logo', selectedLogo);
        }
        
        response = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/company/${selectedCompany.id}`, formDataToSend, {
          headers: getMultipartHeaders(),
        });
      }

      if (response.data.success) {
        await fetchCompanies(); // Refresh the list
        setShowModal(false);
      } else {
        throw new Error(response.data.message || 'Failed to save company');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 422) {
        setError(err.response?.data?.message || 'Validation failed. Please check your inputs.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to save company');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.company_name}?`)) {
      setLoading(true);
      setError('');
      try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/company/${company.id}`, {
          headers: getAuthHeaders(),
        });
        
        if (response.data.success) {
          await fetchCompanies(); // Refresh the list
        } else {
          throw new Error(response.data.message || 'Failed to delete company');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to delete company');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return getAuthToken() !== null;
  };

  // Country options
  const countries = ['India', 'USA', 'UK', 'Canada', 'Australia'];
  
  // State options for other countries (you can expand this)
  const otherCountriesStates = {
    USA: ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
    UK: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    Canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
    Australia: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
  };

  return (
    <div className="min-h-screen py-8 px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Details</h1>
            <p className="text-gray-600 mt-2">Manage all company information</p>
          </div>
          {isAuthenticated() ? (
            <button
              onClick={openAddModal}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Company
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700">Please login to manage companies</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Establish Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && companies.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No companies found. Click "Add Company" to create one.
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {company.logo_url && (
                            <img src={company.logo_url} alt={company.company_name} className="h-8 w-8 rounded-full object-cover mr-3" />
                          )}
                          <div className="text-sm font-medium text-gray-900">{company.company_name}</div>
                        </div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{company.registration_no}</div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatDate(company.establish_date)}</div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{company.email || 'N/A'}</div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openViewModal(company)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="View"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(company)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(company)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'add' && 'Add New Company'}
                  {modalMode === 'edit' && 'Edit Company'}
                  {modalMode === 'view' && 'Company Details'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {modalMode === 'view' ? (
                // View Mode
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCompany?.logo_url && (
                      <div className="col-span-2 flex justify-center">
                        <img src={selectedCompany.logo_url} alt={selectedCompany.company_name} className="h-24 w-24 object-cover rounded-lg" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Company Name</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.company_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Mobile No</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.mobile_no || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Landline No</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.landline_no || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Registration No</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.registration_no}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Company Type</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.company_type || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Sector</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.sector || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Establish Date</label>
                      <p className="mt-1 text-gray-900">{formatDate(selectedCompany?.establish_date)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Website</label>
                      <p className="mt-1 text-gray-900">
                        {selectedCompany?.website ? (
                          <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                            {selectedCompany.website}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">GST No</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.gst_no || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">PAN No</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.pan_no || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-500">Address</label>
                      <p className="mt-1 text-gray-900">
                        {selectedCompany?.address_1 || ''} {selectedCompany?.address_2 || ''}
                      </p>
                      <p className="mt-1 text-gray-600 text-sm">
                        {selectedCompany?.city}, {selectedCompany?.district}, {selectedCompany?.state} - {selectedCompany?.pin_code}
                      </p>
                      <p className="mt-1 text-gray-600 text-sm">{selectedCompany?.country}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Parent Company</label>
                      <p className="mt-1 text-gray-900">{selectedCompany?.is_parent ? 'Yes' : 'No'}</p>
                    </div>
                    {selectedCompany?.parent_company_name && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Parent Company Name</label>
                        <p className="mt-1 text-gray-900">{selectedCompany?.parent_company_name}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        openEditModal(selectedCompany);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                // Add/Edit Mode Form
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile No
                      </label>
                      <input
                        type="tel"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landline No
                      </label>
                      <input
                        type="tel"
                        name="landlineNo"
                        value={formData.landlineNo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration No *
                      </label>
                      <input
                        type="text"
                        name="registrationNo"
                        value={formData.registrationNo}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Type
                      </label>
                      <select
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Company Type</option>
                        {companyTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sector
                      </label>
                      <select
                        name="sector"
                        value={formData.sector}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Sector</option>
                        {sectors.map((sector, index) => (
                          <option key={index} value={sector}>{sector}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Establish Date *
                      </label>
                      <input
                        type="date"
                        name="establishDate"
                        value={formData.establishDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST No
                      </label>
                      <input
                        type="text"
                        name="gstNo"
                        value={formData.gstNo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PAN No
                      </label>
                      <input
                        type="text"
                        name="panNo"
                        value={formData.panNo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select State</option>
                        {formData.country === 'India' 
                          ? states.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))
                          : otherCountriesStates[formData.country]?.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))
                        }
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!formData.state || formData.country !== 'India'}
                      >
                        <option value="">Select District</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!formData.district || formData.country !== 'India'}
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pin Code
                      </label>
                      {formData.country === 'India' && pins.length > 0 ? (
                        <select
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Pin Code</option>
                          {pins.map(pin => (
                            <option key={pin} value={pin}>{pin}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo
                      </label>
                      <input
                        type="file"
                        name="logo"
                        onChange={handleLogoChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {logoPreview && (
                        <div className="mt-2">
                          <img src={logoPreview} alt="Logo Preview" className="h-16 w-16 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Is Parent Company?
                      </label>
                      <input
                        type="checkbox"
                        name="isParent"
                        checked={formData.isParent === 1}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Yes</span>
                    </div>
                    {formData.isParent === 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parent Company Name
                        </label>
                        <input
                          type="text"
                          name="parentCompanyName"
                          value={formData.parentCompanyName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : modalMode === 'add' ? 'Add Company' : 'Update Company'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCompanyDetails;