import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getEncryptedToken } from "../utils/encryptToken";
import { FiUpload, FiGlobe, FiMapPin, FiTag, FiBriefcase, FiFileText, FiImage, FiX, FiCheck, FiEdit2, FiCamera, FiTrash2, FiArrowLeft } from "react-icons/fi";

export default function AdminUpdateForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id: paramId } = useParams();
  const id = state?.id || paramId;

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [allKeywords, setAllKeywords] = useState([]);
  const [businessKeywords, setBusinessKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewCard, setPreviewCard] = useState(null);

  const [errors, setErrors] = useState({});


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

  const [existingImages, setExistingImages] = useState({
    BusinessLogo: "",
    BusinessCard: "",
  });

  // Warm, earthy color scheme matching the image
  const colors = {
    primary: {
      main: "#8B4513", // Saddle Brown
      light: "#A0522D", // Sienna
      dark: "#654321", // Dark Brown
      bg: "#F5E6D3" // Light Beige
    },
    secondary: {
      main: "#D2691E", // Chocolate
      light: "#DEB887", // Burlywood
      dark: "#6B4423" // Dark Brown
    },
    neutral: {
      bg: "#FDF5E6", // Old Lace (cream background)
      cardHeader: "#F5E6D3", // Light Beige
      cardBody: "#FFFFFF", // White
      text: "#5D4037", // Dark Brown
      textLight: "#8B6F47", // Light Brown
      border: "#D2B48C", // Tan
      borderLight: "#E6D5B8" // Light Tan
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/AdminBusinessList");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [catRes, keyRes, bkRes, bizRes] = await Promise.all([
          fetch(`${API_URL}/categories`, {
            headers: { "x-api-key": getEncryptedToken() }
          }),
          fetch(`${API_URL}/keyword`, {
            headers: { "x-api-key": getEncryptedToken() }
          }),
          fetch(`${API_URL}/businessKeywords/business/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": getEncryptedToken()
            },
          }),
          fetch(`${API_URL}/business/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": getEncryptedToken()
            },
          }),
        ]);

        const categories = await catRes.json();
        const keywords = await keyRes.json();
        const bk = await bkRes.json();
        const business = await bizRes.json();

        setCategories(categories);
        setAllKeywords(keywords);
        setBusinessKeywords(bk);

        setFormData({
          BusinessName: business.BusinessName || "",
          categoryid: business.categoryid || "",
          BusinessWebsite: business.BusinessWebsite || "",
          BusinessAddress: business.BusinessAddress || "",
          BusinessDescription: business.BusinessDescription || "",
          keywordIds: bk.map((k) => k.keyword_id),
        });

        setExistingImages({
          BusinessLogo: business.BusinessLogo || "",
          BusinessCard: business.BusinessCard || "",
        });
      } catch (err) {
        console.error("Load error:", err);
        alert("Failed to load business data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, token, navigate, API_URL]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [e.target.name]: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        if (e.target.name === "BusinessLogo") {
          setPreviewLogo(reader.result);
        } else {
          setPreviewCard(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeKeyword = (kid) =>
    setFormData((prev) => ({
      ...prev,
      keywordIds: prev.keywordIds.filter((k) => k !== kid),
    }));

  const clearLogo = () => {
    setFiles({ ...files, BusinessLogo: null });
    setPreviewLogo(null);
  };

  const clearBusinessCard = () => {
    setFiles({ ...files, BusinessCard: null });
    setPreviewCard(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }


    setLoading(true);





    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k !== "keywordIds") fd.append(k, v);
      });

      if (files.BusinessLogo) fd.append("BusinessLogo", files.BusinessLogo);
      if (files.BusinessCard) fd.append("BusinessCard", files.BusinessCard);

      const businessRes = await fetch(`${API_URL}/business/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": getEncryptedToken()
        },
        body: fd,
      });

      if (!businessRes.ok) throw new Error("Failed to update business");

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
            business_id: id,
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
            "x-api-key": getEncryptedToken(),
          },
          body: JSON.stringify({
            business_id: id,
            keyword_id,
          }),
        });
      }

      alert("Business updated successfully!");
      navigate("/AdminBusinessList");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update business. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getKeywordName = (id) => {
    const keyword = allKeywords.find(k => k.id === id);
    return keyword ? keyword.keyword_name : "Unknown";
  };

  if (loading && !formData.BusinessName) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: colors.neutral.bg }}>
        <div className="text-center">
          <div className="spinner-border" role="status" style={{ color: colors.primary.main, width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-4" style={{ color: colors.neutral.text }}>Loading business data...</p>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.BusinessName.trim()) {
      newErrors.BusinessName = "Business name is required";
    }

    if (!formData.categoryid) {
      newErrors.categoryid = "Please select a category";
    }

    if (formData.BusinessWebsite && !/^https?:\/\/.+\..+/.test(formData.BusinessWebsite)) {
      newErrors.BusinessWebsite = "Enter a valid website URL (https://...)";
    }

    if (formData.BusinessDescription.length > 500) {
      newErrors.BusinessDescription = "Description cannot exceed 500 characters";
    }

    if (files.BusinessLogo) {
      const allowed = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
      if (!allowed.includes(files.BusinessLogo.type)) {
        newErrors.BusinessLogo = "Logo must be PNG, JPG, or SVG";
      }
      if (files.BusinessLogo.size > 2 * 1024 * 1024) {
        newErrors.BusinessLogo = "Logo size must be less than 2MB";
      }
    }

    if (files.BusinessCard) {
      const allowed = ["image/png", "image/jpeg", "application/pdf"];
      if (!allowed.includes(files.BusinessCard.type)) {
        newErrors.BusinessCard = "Business card must be PNG, JPG, or PDF";
      }
      if (files.BusinessCard.size > 5 * 1024 * 1024) {
        newErrors.BusinessCard = "Business card size must be less than 5MB";
      }
    }

    if (formData.keywordIds.length === 0) {
      newErrors.keywordIds = "Please add at least one keyword";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  return (
    <div className="container-fluid d-flex align-items-center justify-content-center py-5" style={{ minHeight: "100vh", backgroundColor: colors.neutral.bg }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Main Card */}
        <div className="card shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
          {/* Card Header - Beige Background */}
          <div className="card-header border-0 py-4 px-5" style={{ backgroundColor: colors.neutral.cardHeader }}>
            <button
              onClick={() => navigate("/AdminBusinessList")}
              className="btn btn-link text-decoration-none p-0 mb-3"
              style={{ color: colors.primary.main }}
            >
              <FiArrowLeft className="me-2" /> Back to Business List
            </button>
            <h1 className="mb-2" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: colors.neutral.text
            }}>
              Edit Your Business
            </h1>
            <p className="mb-0" style={{ color: colors.neutral.textLight, fontSize: "1rem" }}>
              Update your business information
            </p>
          </div>

          {/* Card Body - White Background */}
          <div className="card-body p-5" style={{ backgroundColor: colors.neutral.cardBody }}>

            <form onSubmit={handleSubmit}>
              {/* Business Information Section */}
              <div className="mb-5">
                <h3 className="mb-3 pb-2 border-bottom" style={{
                  color: colors.neutral.text,
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  borderColor: colors.neutral.border + " !important",
                  borderWidth: "1px !important"
                }}>
                  Business Information
                </h3>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: colors.neutral.text }}>
                      <span style={{ color: "#dc3545" }}>*</span> Business Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="BusinessName"
                      value={formData.BusinessName}
                      onChange={handleChange}
                      placeholder="Enter business name"
                      required
                      style={{
                        borderRadius: "8px",
                        borderColor: colors.neutral.border,
                        color: colors.neutral.textLight
                      }}
                    />
                  </div>

                  {errors.BusinessName && <small className="text-danger">{errors.BusinessName}</small>}



                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: colors.neutral.text }}>
                      <span style={{ color: "#dc3545" }}>*</span> Category
                    </label>
                    <select
                      className="form-select"
                      name="categoryid"
                      value={formData.categoryid}
                      onChange={handleChange}
                      required
                      style={{
                        borderRadius: "8px",
                        borderColor: colors.neutral.border,
                        color: colors.neutral.textLight
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.categoryid} value={c.categoryid}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>

                    {errors.categoryid && <small className="text-danger">{errors.categoryid}</small>}
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ color: colors.neutral.text }}>
                      Business Website
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      name="BusinessWebsite"
                      value={formData.BusinessWebsite}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      style={{
                        borderRadius: "8px",
                        borderColor: errors.BusinessWebsite ? "#dc3545" : colors.neutral.border,
                        color: colors.neutral.textLight
                      }}
                    />

                    {/* ✅ Error Message */}
                    {errors.BusinessWebsite && (
                      <small className="text-danger">{errors.BusinessWebsite}</small>
                    )}
                  </div>
                </div>


                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: colors.neutral.text }}>
                    Business Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="BusinessAddress"
                    value={formData.BusinessAddress}
                    onChange={handleChange}
                    placeholder="Enter business address"
                    style={{
                      borderRadius: "8px",
                      borderColor: colors.neutral.border,
                      color: colors.neutral.textLight
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: colors.neutral.text }}>
                  Business Description
                </label>
                <textarea
                  className="form-control"
                  name="BusinessDescription"
                  value={formData.BusinessDescription}
                  onChange={handleChange}
                  placeholder="Describe your business..."
                  rows="4"
                  maxLength={500}
                  style={{
                    borderRadius: "8px",
                    borderColor: colors.neutral.border,
                    color: colors.neutral.textLight
                  }}
                />
                {errors.BusinessDescription && <small className="text-danger">{errors.BusinessDescription}</small>}
                <small className="text-muted">
                  {formData.BusinessDescription.length}/500 characters
                </small>
              </div>
          </div>

          {/* Keywords Section */}
          <div className="mb-5">
            <h3 className="mb-3 pb-2 border-bottom" style={{
              color: colors.neutral.text,
              fontWeight: "600",
              fontSize: "1.1rem",
              borderColor: colors.neutral.border + " !important",
              borderWidth: "1px !important"
            }}>
              Keywords & Tags
            </h3>

            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ color: colors.neutral.text }}>
                Add Keywords
              </label>
              <select
                className="form-select mb-3"
                onChange={(e) => {
                  const kid = Number(e.target.value);
                  if (!kid) return;
                  if (!formData.keywordIds.includes(kid)) {
                    setFormData((p) => ({
                      ...p,
                      keywordIds: [...p.keywordIds, kid]
                    }));
                  }
                  e.target.value = "";
                }}
                style={{
                  borderRadius: "8px",
                  borderColor: colors.neutral.border,
                  color: colors.neutral.textLight
                }}
              >
                <option value="">+ Add a keyword</option>
                {allKeywords.map((k) => (
                  <option
                    key={k.id}
                    value={k.id}
                    disabled={formData.keywordIds.includes(k.id)}
                  >
                    {k.keyword_name}
                    {formData.keywordIds.includes(k.id) && " ✓"}
                  </option>
                ))}
              </select>

              {errors.keywordIds && <small className="text-danger d-block mt-2">{errors.keywordIds}</small>}


              <div className="d-flex flex-wrap gap-2 p-3 border rounded" style={{
                minHeight: "100px",
                backgroundColor: colors.neutral.cardHeader + "40",
                borderColor: colors.neutral.borderLight + " !important"
              }}>
                {formData.keywordIds.map((id) => (
                  <span
                    key={id}
                    className="badge d-flex align-items-center gap-2 px-3 py-2"
                    style={{
                      backgroundColor: colors.primary.bg,
                      color: colors.primary.main,
                      fontSize: "0.875rem",
                      borderRadius: "20px"
                    }}
                  >
                    {getKeywordName(id)}
                    <button
                      type="button"
                      className="btn-close btn-close-sm"
                      onClick={() => removeKeyword(id)}
                      style={{ fontSize: "0.6rem" }}
                    ></button>
                  </span>
                ))}
                {formData.keywordIds.length === 0 && (
                  <span className="text-muted">No keywords added yet</span>
                )}
              </div>
            </div>
          </div>

          {errors.keywordIds && <small className="text-danger d-block mt-2">{errors.keywordIds}</small>}


          {/* Media Section */}
          <div className="mb-5">
            <h3 className="mb-3 pb-2 border-bottom" style={{
              color: colors.neutral.text,
              fontWeight: "600",
              fontSize: "1.1rem",
              borderColor: colors.neutral.border + " !important",
              borderWidth: "1px !important"
            }}>
              Media Files
            </h3>

            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ color: colors.neutral.text }}>
                  Business Logo
                </label>
                <div className="text-center mb-3">
                  <div className="d-inline-block position-relative">
                    <div className="border rounded p-3" style={{
                      width: "150px",
                      height: "150px",
                      backgroundColor: colors.neutral.cardHeader,
                      borderColor: colors.neutral.border + " !important"
                    }}>
                      {previewLogo ? (
                        <img src={previewLogo} alt="Logo Preview" className="w-100 h-100 object-fit-contain" />
                      ) : existingImages.BusinessLogo ? (
                        <img src={existingImages.BusinessLogo} alt="Current Logo" className="w-100 h-100 object-fit-contain" />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <FiCamera style={{ color: colors.neutral.textLight, fontSize: "2rem" }} />
                        </div>
                      )}
                    </div>
                    {(previewLogo || existingImages.BusinessLogo) && (
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-0 end-0 translate-middle rounded-circle"
                        onClick={clearLogo}
                        style={{ backgroundColor: "#dc3545", color: "white", width: "24px", height: "24px", padding: 0 }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  className="form-control"
                  name="BusinessLogo"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{
                    borderRadius: "8px",
                    borderColor: colors.neutral.border
                  }}
                />
                <small className="text-muted">PNG, JPG, SVG - Max 2MB</small>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ color: colors.neutral.text }}>
                  Business Card
                </label>
                <div className="text-center mb-3">
                  <div className="d-inline-block position-relative">
                    <div className="border rounded p-3" style={{
                      width: "200px",
                      height: "120px",
                      backgroundColor: colors.neutral.cardHeader,
                      borderColor: colors.neutral.border + " !important"
                    }}>
                      {previewCard ? (
                        <img src={previewCard} alt="Card Preview" className="w-100 h-100 object-fit-contain" />
                      ) : existingImages.BusinessCard ? (
                        <img src={existingImages.BusinessCard} alt="Current Card" className="w-100 h-100 object-fit-contain" />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <FiBriefcase style={{ color: colors.neutral.textLight, fontSize: "2rem" }} />
                        </div>
                      )}
                    </div>
                    {(previewCard || existingImages.BusinessCard) && (
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-0 end-0 translate-middle rounded-circle"
                        onClick={clearBusinessCard}
                        style={{ backgroundColor: "#dc3545", color: "white", width: "24px", height: "24px", padding: 0 }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  className="form-control"
                  name="BusinessCard"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  style={{
                    borderRadius: "8px",
                    borderColor: colors.neutral.border
                  }}
                />
                <small className="text-muted">PNG, JPG, PDF - Max 5MB</small>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center pt-4 border-top" style={{ borderColor: colors.neutral.border + " !important" }}>
            <button
              type="button"
              onClick={() => navigate("/AdminBusinessList")}
              className="btn"
              style={{
                color: colors.neutral.text,
                backgroundColor: colors.neutral.cardHeader,
                borderColor: colors.neutral.border,
                borderRadius: "8px",
                padding: "10px 30px"
              }}
              disabled={loading}
            >
              Cancel
            </button>

            <div className="d-flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setFiles({ BusinessLogo: null, BusinessCard: null });
                  setPreviewLogo(null);
                  setPreviewCard(null);
                }}
                className="btn"
                style={{
                  color: colors.secondary.dark,
                  backgroundColor: colors.secondary.light + "40",
                  borderColor: colors.secondary.main,
                  borderRadius: "8px",
                  padding: "10px 25px"
                }}
                disabled={loading}
              >
                Reset Changes
              </button>

              <button
                type="submit"
                className="btn text-white fw-bold"
                style={{
                  backgroundColor: colors.primary.main,
                  borderRadius: "8px",
                  padding: "10px 35px"
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheck className="me-2" />
                    Update Business
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Note */}
      <div className="card-footer text-center py-3" style={{ backgroundColor: colors.neutral.cardHeader }}>
        <small style={{ color: colors.neutral.textLight }}>
          <span style={{ color: "#dc3545" }}>*</span> indicates required fields
        </small>
      </div>
    </div>
      </div >
    </div >
  );
}
