import React, { useState, useEffect } from "react";
import { useUser } from "../../../../hooks/useUser";
import storage from "../../../../src/utils/storage";
import axios from "axios";
import logger from "../../../utils/logger";

const DocumentUploadForm = () => {
  const [documentsList, setDocumentsList] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [uploading, setUploading] = useState(false);
  const [reuploadingId, setReuploadingId] = useState(null);
  const [serviceName, setServiceName] = useState("");

  const hookUser = useUser();
  const storedUser = storage.getUser();
  const idsFromStorage = storage.getIds() || {};

  const userId =
    hookUser?.id ||
    hookUser?.user_id ||
    hookUser?.data?.id ||
    storedUser?.id ||
    idsFromStorage.userId ||
    idsFromStorage.user_id;

  const serviceId = idsFromStorage.serviceId || idsFromStorage.service_id;

  useEffect(() => {
    const loadRequiredDocuments = async () => {
      try {
        if (!serviceId) return;

        const userObj = storage.getUser() || {};
        const token =
          userObj.token || userObj.access_token || sessionStorage.getItem("token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/services/document/upload`,
          { user_id: userId, service_id: serviceId },
          { headers }
        );

        const data = res?.data ?? {};

        const fetchedServiceName =
          data?.service_name ||
          data?.data?.service_name ||
          data?.service?.name ||
          data?.data?.service?.name ||
          "Your Service";

        setServiceName(fetchedServiceName);

        let service =
          data?.service_doc_map ??
          data?.data?.service_doc_map ??
          data?.required_documents ??
          data?.data?.required_documents ??
          [];

        if (!Array.isArray(service)) {
          if (service && typeof service === "object") {
            service = Object.values(service);
          } else service = [];
        }

        const mapped = service.map((d) => ({
          id: d?.id ?? d?.document_id ?? d?.key,
          name: d?.document_name || d?.name || d?.label || "Unnamed Document",
          type: d?.document_type || d?.type || "file",
          data: d?.data || null,
        }));

        setDocumentsList(mapped);

        const initialFormValues = {};
        mapped.forEach((d) => {
          initialFormValues[d.id] = {
            text: d.type !== "Document" && typeof d.data === "string" ? d.data : "",
            file: null,
          };
        });
        setFormValues(initialFormValues);
      } catch (e) {
        logger.error("Failed to load documents", e);
      }
    };

    loadRequiredDocuments();
  }, [serviceId, userId]);

  const handleChange = (docId, fieldType, e) => {
    const value = fieldType === "file" ? e.target.files[0] : e.target.value;
    setFormValues((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], [fieldType]: value },
    }));
  };

  const handleUpload = async (doc) => {
    const entry = formValues[doc.id];
    if (!entry?.file && !entry?.text)
      return alert("Please enter text or upload a file.");

    const userObj = storage.getUser() || {};
    const token =
      userObj.token || userObj.access_token || sessionStorage.getItem("token");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("service_id", serviceId);
    formData.append("document_id", doc.id);
    formData.append("document_name", doc.name);

    if (entry.file) {
      formData.append("document_type", "Document");
      formData.append("file", entry.file);
    } else if (entry.text) {
      formData.append("document_type", "Text");
      formData.append("text", entry.text);
    }

    try {
      setUploading(true);
      setReuploadingId(doc.id);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/services/document/upload/store`,
        {
          method: "POST",
          body: formData,
          headers,
        }
      );

      const json = await res.json();
      if (json.success || json.status === "success") {
        alert(`✅ ${doc.name} saved successfully!`);
        setDocumentsList((prev) =>
          prev.map((d) =>
            d.id === doc.id ? { ...d, data: json.url || json.file_url || d.data } : d
          )
        );
      } else {
        alert(`⚠ Upload failed for ${doc.name}`);
      }
    } catch (err) {
      logger.error("Upload Error:", err);
      alert("⚠ Something went wrong during upload.");
    } finally {
      setUploading(false);
      setReuploadingId(null);
    }
  };

  return (
    <div className="min-h-screen mt-30 py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-900 mb-3">
          Required Documents {serviceName}
        </h1>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          📄 Please upload or update the required documents for your service.
        </p>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-4 text-left w-1/4">Document Name</th>
                <th className="p-4 text-left w-1/3">Upload / Input</th>
                <th className="p-4 text-center w-1/6">Status</th>
                <th className="p-4 text-center w-1/6">Action</th>
              </tr>
            </thead>
            <tbody>
              {documentsList.length > 0 ? (
                documentsList.map((doc) => {
                  const entry = formValues[doc.id] || {};
                  const isReuploading = reuploadingId === doc.id && uploading;
                  const isMissing = !doc.data && !entry.text && !entry.file;

                  let buttonLabel = "Upload";
                  if (doc.type !== "Document") {
                    buttonLabel = doc.data ? "Save" : "Upload";
                  } else if (doc.type === "Document") {
                    buttonLabel = doc.data ? "Reupload" : "Upload";
                  }

                  return (
                    <tr
                      key={doc.id}
                      className="border-t border-gray-100 hover:bg-blue-50 transition-all"
                    >
                      <td className="p-4 font-medium text-gray-800">{doc.name}</td>

                      <td className="p-4">
                        {doc.type === "Document" ? (
                          <input
                            type="file"
                            onChange={(e) => handleChange(doc.id, "file", e)}
                            className={`w-full border rounded-lg p-2 focus:ring-2 outline-none transition-all ${
                              isMissing
                                ? "bg-red-100 border-red-400 focus:ring-red-500"
                                : "bg-gray-50 border-gray-300 focus:ring-green-500"
                            }`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={entry.text || ""}
                            onChange={(e) => handleChange(doc.id, "text", e)}
                            placeholder={`Enter ${doc.name}`}
                            className={`w-full border rounded-lg p-2 focus:ring-2 outline-none transition-all ${
                              isMissing
                                ? "bg-red-100 border-red-400 focus:ring-red-500"
                                : "bg-gray-50 border-gray-300 focus:ring-green-500"
                            }`}
                          />
                        )}
                      </td>

                      <td className="p-4 text-center">
                        {doc.data || entry.text ? (
                          <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full text-sm">
                            Ready
                          </span>
                        ) : (
                          <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-3 flex-wrap">
                          {doc.data && doc.type === "Document" && (
                            <a
                              href={doc.data}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
                            >
                              View
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleUpload(doc)}
                            disabled={uploading}
                            className={`px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all text-sm ${
                              uploading
                                ? "opacity-70 cursor-not-allowed"
                                : doc.data
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {isReuploading ? "Saving..." : buttonLabel}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No required documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {documentsList.length > 0 ? (
            documentsList.map((doc) => {
              const entry = formValues[doc.id] || {};
              const isReuploading = reuploadingId === doc.id && uploading;
              const isMissing = !doc.data && !entry.text && !entry.file;

              let buttonLabel = "Upload";
              if (doc.type !== "Document") {
                buttonLabel = doc.data ? "Save" : "Upload";
              } else if (doc.type === "Document") {
                buttonLabel = doc.data ? "Reupload" : "Upload";
              }

              return (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:bg-blue-50 transition-all"
                >
                  {/* Document Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800 text-base">{doc.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.data || entry.text
                          ? "text-green-600 bg-green-100"
                          : "text-gray-500 bg-gray-100"
                      }`}
                    >
                      {doc.data || entry.text ? "Ready" : "Pending"}
                    </span>
                  </div>

                  {/* Input Field */}
                  <div className="mb-4">
                    {doc.type === "Document" ? (
                      <input
                        type="file"
                        onChange={(e) => handleChange(doc.id, "file", e)}
                        className={`w-full border rounded-lg p-3 focus:ring-2 outline-none transition-all text-sm ${
                          isMissing
                            ? "bg-red-100 border-red-400 focus:ring-red-500"
                            : "bg-gray-50 border-gray-300 focus:ring-green-500"
                        }`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={entry.text || ""}
                        onChange={(e) => handleChange(doc.id, "text", e)}
                        placeholder={`Enter ${doc.name}`}
                        className={`w-full border rounded-lg p-3 focus:ring-2 outline-none transition-all text-sm ${
                          isMissing
                            ? "bg-red-100 border-red-400 focus:ring-red-500"
                            : "bg-gray-50 border-gray-300 focus:ring-green-500"
                        }`}
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {doc.data && doc.type === "Document" && (
                      <a
                        href={doc.data}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all text-center text-sm flex-1"
                      >
                        View Document
                      </a>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleUpload(doc)}
                      disabled={uploading}
                      className={`px-4 py-3 rounded-lg font-semibold text-white shadow-md transition-all text-sm flex-1 ${
                        uploading
                          ? "opacity-70 cursor-not-allowed"
                          : doc.data
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isReuploading ? "Saving..." : buttonLabel}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
              No required documents found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;