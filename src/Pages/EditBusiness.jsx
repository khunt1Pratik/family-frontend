import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {getEncryptedToken} from "../utils/encryptToken";


export default function EditBusiness() {
  const params = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const id = params.id || params.businessId || user?.businessId;
  const businessId = user.businessId;

  const API_URL = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([]);
  const [allKeywords, setAllKeywords] = useState([]);
  const [businessKeywords, setBusinessKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    BusinessName: "",
    categoryid: "",
    BusinessWebsite: "",
    BusinessAddress: "",
    BusinessDescription: "",
    keywordIds: [],
  });

  const [files, setFiles] = useState({
    BusinessLogo: null,
    BusinessCard: null,
  });

  const [preview, setPreview] = useState({
    BusinessLogo: "",
    BusinessCard: "",
  });



  useEffect(() => {
    if (!id) return;

    if (businessId === null) {
      navigate("/adduserbusiness");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const catRes = await fetch(`${API_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": getEncryptedToken()

          },
        }
        );
        const catData = await catRes.json();
        setCategories(catData);

        // Fetch all keywords
        const keyRes = await fetch(`${API_URL}/keyword`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": getEncryptedToken()
          },
        });
        const keyData = await keyRes.json();
        setAllKeywords(keyData);

        // Fetch business data
        const businessRes = await fetch(`${API_URL}/business/${businessId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
              "x-api-key": getEncryptedToken()
          }
        });
        const business = await businessRes.json();

        // Fetch current business keywords
        const bkRes = await fetch(`${API_URL}/businessKeywords/business/${businessId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": getEncryptedToken()
          },
        });
        const currentKeywords = await bkRes.json();
        setBusinessKeywords(currentKeywords);

        // Set form data
        setFormData({
          BusinessName: business.BusinessName || "",
          categoryid: business.categoryid || "",
          BusinessWebsite: business.BusinessWebsite || "",
          BusinessAddress: business.BusinessAddress || "",
          BusinessDescription: business.BusinessDescription || "",
          keywordIds: currentKeywords.map(k => k.keyword_id) || [],
        });

        // Set previews
        setPreview({
          BusinessLogo: business.BusinessLogo ? `${API_URL}/uploads/${business.BusinessLogo}` : "",
          BusinessCard: business.BusinessCard ? `${API_URL}/uploads/${business.BusinessCard}` : "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage({
          show: true,
          text: "Failed to load business data",
          type: "danger"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, businessId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeywordAdd = (e) => {
    const kid = Number(e.target.value);
    if (!kid) return;
    setFormData((prev) => {
      if (prev.keywordIds.includes(kid)) return prev;
      return { ...prev, keywordIds: [...prev.keywordIds, kid] };
    });
    e.target.value = "";
  };

  const removeKeyword = (kid) => {
    setFormData((prev) => ({
      ...prev,
      keywordIds: prev.keywordIds.filter((k) => k !== kid),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles((prev) => ({ ...prev, [e.target.name]: file }));
    setPreview((prev) => ({
      ...prev,
      [e.target.name]: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ show: false, text: "", type: "" });

    try {
      // 1️⃣ Update business info
      const fd = new FormData();
      fd.append("BusinessName", formData.BusinessName);
      fd.append("categoryid", formData.categoryid);
      fd.append("BusinessWebsite", formData.BusinessWebsite);
      fd.append("BusinessAddress", formData.BusinessAddress);
      fd.append("BusinessDescription", formData.BusinessDescription);
      if (files.BusinessLogo) fd.append("BusinessLogo", files.BusinessLogo);
      if (files.BusinessCard) fd.append("BusinessCard", files.BusinessCard);

      const businessRes = await fetch(`${API_URL}/business/${businessId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
            "x-api-key": getEncryptedToken()
        },
        body: fd,
      });

      if (!businessRes.ok) throw new Error("Failed to update business");

      // 2️⃣ Update keywords
      // Delete old keywords
      for (const bk of businessKeywords) {
        await fetch(`${API_URL}/businessKeywords`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": getEncryptedToken()
          },
          body: JSON.stringify({
            business_id: businessId,
            keyword_id: bk.keyword_id,
          }),
        });
      }

      // Add new keywords
      for (const keyword_id of formData.keywordIds) {
        await fetch(`${API_URL}/businessKeywords`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": getEncryptedToken()
          },
          body: JSON.stringify({
            business_id: businessId,
            keyword_id,
          }),
        });
      }

      setMessage({
        show: true,
        text: "Business updated successfully!",
        type: "success"
      });

      setTimeout(() => {
        navigate("/familyList");
      }, 1500);

    } catch (err) {
      console.error("Update failed:", err);
      setMessage({
        show: true,
        text: "Failed to update business. Please try again.",
        type: "danger"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "linear-gradient(135deg, #f8f4e6 0%, #fff9e6 30%, #ffffff 100%)",
        minHeight: "100vh",
        fontFamily: "'Georgia', 'Times New Roman', serif"
      }}
    >


      {/* Main Form Card */}
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <div
            className="card mx-auto"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(212, 167, 106, 0.3)",
              overflow: "hidden"
            }}
          >
            {/* Card Header */}
            <div
              className="card-header text-center py-4"
              style={{
                backgroundColor: "#F5E6D3",
                borderBottom: "2px solid #D4A76A"
              }}
            >
              <h2
                className="mb-0"
                style={{
                  color: "#8B4513",
                  fontFamily: "'Georgia', serif",
                  fontWeight: "bold"
                }}
              >
                Edit Your Business
              </h2>
              <p style={{ color: "#5D4037", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Update your business information to stay connected with the community
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status" style={{ color: "#D4A76A" }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3" style={{ color: "#5D4037" }}>
                    Loading business information...
                  </p>
                </div>
              ) : (
                <>
                  {/* Alert Message */}
                  {message.show && (
                    <div
                      className={`alert alert-${message.type} alert-dismissible fade show mb-4`}
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {message.text}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage({ ...message, show: false })}
                      ></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Business Information Section */}
                    <div className="mb-4">
                      <h5
                        className="mb-3"
                        style={{
                          color: "#8B4513",
                          fontFamily: "'Georgia', serif",
                          borderBottom: "2px solid #D4A76A",
                          paddingBottom: "0.5rem"
                        }}
                      >
                        Business Information
                      </h5>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label fw-bold"
                          style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                        >
                          Business Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="BusinessName"
                          value={formData.BusinessName}
                          onChange={handleChange}
                          placeholder="Enter your business name"
                          required
                          style={{
                            border: "1.5px solid #D4A76A",
                            borderRadius: "8px",
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            padding: "0.75rem"
                          }}
                        />
                      </div>

                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label fw-bold"
                          style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                        >
                          Business Category *
                        </label>
                        <select
                          className="form-control"
                          name="categoryid"
                          value={formData.categoryid}
                          onChange={handleChange}
                          required
                          style={{
                            border: "1.5px solid #D4A76A",
                            borderRadius: "8px",
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            padding: "0.75rem"
                          }}
                        >
                          <option value="">Select a category...</option>
                          {categories.map((c) => (
                            <option key={c.categoryid} value={c.categoryid}>
                              {c.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 mb-4">
                        <label
                          className="form-label fw-bold"
                          style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                        >
                          Website
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="BusinessWebsite"
                          value={formData.BusinessWebsite}
                          onChange={handleChange}
                          placeholder="https://yourbusiness.com"
                          style={{
                            border: "1.5px solid #D4A76A",
                            borderRadius: "8px",
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            padding: "0.75rem"
                          }}
                        />
                      </div>

                      <div className="col-12 mb-4">
                        <label
                          className="form-label fw-bold"
                          style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                        >
                          Business Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="BusinessAddress"
                          value={formData.BusinessAddress}
                          onChange={handleChange}
                          placeholder="Full business address"
                          style={{
                            border: "1.5px solid #D4A76A",
                            borderRadius: "8px",
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            padding: "0.75rem"
                          }}
                        />
                      </div>

                      <div className="col-12 mb-4">
                        <label
                          className="form-label fw-bold"
                          style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                        >
                          Business Description
                        </label>
                        <textarea
                          className="form-control"
                          name="BusinessDescription"
                          value={formData.BusinessDescription}
                          onChange={handleChange}
                          placeholder="Tell us about your business, its history, and services..."
                          rows="4"
                          style={{
                            border: "1.5px solid #D4A76A",
                            borderRadius: "8px",
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            padding: "0.75rem",
                            resize: "vertical"
                          }}
                        />
                      </div>
                    </div>

                    {/* Keywords Section */}
                    <div className="mb-4">
                      <h5
                        className="mb-3"
                        style={{
                          color: "#8B4513",
                          fontFamily: "'Georgia', serif",
                          borderBottom: "2px solid #D4A76A",
                          paddingBottom: "0.5rem"
                        }}
                      >
                        Business Keywords
                      </h5>
                      <p style={{ color: "#5D4037", fontSize: "0.9rem" }}>
                        Add keywords to help customers find your business
                      </p>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-8 mb-3">
                        <label
                          className="form-label"
                          style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                        >
                          Add Keywords
                        </label>
                        <select
                          className="form-control"
                          onChange={handleKeywordAdd}
                          style={{
                            border: "1.5px solid #D4A76A",
                            borderRadius: "8px",
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            padding: "0.75rem"
                          }}
                        >
                          <option value="">Select a keyword to add...</option>
                          {allKeywords.map((k) => (
                            <option key={k.id} value={k.id}>
                              {k.keyword_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Selected Keywords */}
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                      >
                        Selected Keywords
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {formData.keywordIds.length === 0 ? (
                          <div
                            className="text-center py-3 w-100"
                            style={{
                              backgroundColor: "#F9F3E9",
                              borderRadius: "8px",
                              border: "1px dashed #D4A76A"
                            }}
                          >
                            <p className="mb-0" style={{ color: "#5D4037" }}>
                              No keywords selected. Add keywords to improve searchability.
                            </p>
                          </div>
                        ) : (
                          formData.keywordIds.map((id) => {
                            const keyword = allKeywords.find((k) => k.id === id);
                            return (
                              <div
                                key={id}
                                className="d-flex align-items-center px-3 py-2"
                                style={{
                                  backgroundColor: "#F5E6D3",
                                  borderRadius: "20px",
                                  border: "1px solid #D4A76A"
                                }}
                              >
                                <span style={{ color: "#8B4513", fontFamily: "'Georgia', serif" }}>
                                  {keyword?.keyword_name || "Unknown"}
                                </span>
                                <button
                                  type="button"
                                  className="btn-close ms-2"
                                  onClick={() => removeKeyword(id)}
                                  style={{ fontSize: "0.6rem" }}
                                  aria-label="Remove keyword"
                                />
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="mb-4">
                      <h5
                        className="mb-3"
                        style={{
                          color: "#8B4513",
                          fontFamily: "'Georgia', serif",
                          borderBottom: "2px solid #D4A76A",
                          paddingBottom: "0.5rem"
                        }}
                      >
                        Business Images
                      </h5>
                    </div>

                    <div
                      className="p-4 mb-4"
                      style={{
                        backgroundColor: "#F9F3E9",
                        borderRadius: "10px",
                        border: "1px dashed #D4A76A"
                      }}
                    >
                      <div className="row">
                        {/* Business Logo */}
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label fw-bold"
                            style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                          >
                            Business Logo
                          </label>

                          {preview.BusinessLogo && (
                            <div className="mb-3 text-center">
                              <img
                                src={preview.BusinessLogo}
                                alt="Business Logo"
                                className="img-fluid rounded"
                                style={{
                                  maxHeight: "180px",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                  border: "2px solid #D4A76A",
                                  padding: "5px",
                                  backgroundColor: "white"
                                }}
                              />
                              <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
                                Current logo
                              </p>
                            </div>
                          )}

                          <input
                            type="file"
                            className="form-control"
                            name="BusinessLogo"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                              border: "1.5px solid #D4A76A",
                              borderRadius: "8px",
                              fontFamily: "'Georgia', serif",
                              color: "#5D4037"
                            }}
                          />
                          <small className="form-text" style={{ color: "#8B4513" }}>
                            Upload new logo (optional)
                          </small>
                        </div>

                        {/* Business Card */}
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label fw-bold"
                            style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                          >
                            Business Card
                          </label>

                          {preview.BusinessCard && (
                            <div className="mb-3 text-center">
                              <img
                                src={preview.BusinessCard}
                                alt="Business Card"
                                className="img-fluid rounded"
                                style={{
                                  maxHeight: "180px",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                  border: "2px solid #D4A76A",
                                  padding: "5px",
                                  backgroundColor: "white"
                                }}
                              />
                              <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
                                Current business card
                              </p>
                            </div>
                          )}

                          <input
                            type="file"
                            className="form-control"
                            name="BusinessCard"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                              border: "1.5px solid #D4A76A",
                              borderRadius: "8px",
                              fontFamily: "'Georgia', serif",
                              color: "#5D4037"
                            }}
                          />
                          <small className="form-text" style={{ color: "#8B4513" }}>
                            Upload new business card (optional)
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between align-items-center mt-4 pt-3">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => navigate("/familyList")}
                        style={{
                          backgroundColor: "#8B4513",
                          color: "white",
                          border: "none",
                          fontFamily: "'Georgia', serif",
                          fontWeight: "bold",
                          padding: "0.75rem 2rem",
                          borderRadius: "8px",
                          fontSize: "1rem"
                        }}
                      >
                        ← Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn"
                        disabled={submitting}
                        style={{
                          backgroundColor: "#D4A76A",
                          color: "white",
                          border: "none",
                          fontFamily: "'Georgia', serif",
                          fontWeight: "bold",
                          padding: "0.75rem 3rem",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          boxShadow: "0 3px 10px rgba(212, 167, 106, 0.3)",
                          opacity: submitting ? 0.7 : 1
                        }}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                          </>
                        ) : (
                          "Update Business"
                        )}
                      </button>
                    </div>

                    {/* Form Note */}
                    <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #F5E6D3" }}>
                      <p style={{ color: "#5D4037", fontSize: "0.85rem" }}>
                        Fields marked with * are required. Keep your information up to date.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-4">
            <p style={{ color: "#5D4037", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>
              Updating your business information helps you connect better with the community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}