import React, { use, useEffect, useState } from "react";
import useBusinessId from "../hooks/useBusinessId";
import { useNavigate, useParams } from "react-router-dom";
import { getEncryptedToken } from "../utils/encryptToken";


const API_URL = import.meta.env.VITE_API_URL;

export default function AddUserBusiness() {
    const navigate = useNavigate();
    const { updateBusinessId } = useBusinessId();

    const token = localStorage.getItem("token");

    const { businessId: paramId } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    const id = paramId || user?.id;

    const [form, setForm] = useState({
        user_id: id,
        categoryid: "",
        BusinessName: "",
        BusinessWebsite: "",
        BusinessAddress: "",
        BusinessDescription: "",
        keywordIds: [],
    });

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);

    const [BusinessCard, setBusinessCard] = useState(null);
    const [BusinessLogo, setBusinessLogo] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [allKeywords, setAllKeywords] = useState([]);
    const [businessKeywords, setBusinessKeywords] = useState([]);


    useEffect(() => {
        // 1. Fetch users
        fetch(API_URL + '/user', {
            headers: {
                Authorization: `Bearer ${token}`,
                  "x-api-key": getEncryptedToken()
            },
        })
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));

        // 2. Fetch categories
        fetch(API_URL + '/categories', {
            headers: {
                "x-api-key": getEncryptedToken(),
            },
        })
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));

        // 3. Fetch KeyWord
        fetch(API_URL + '/keyword', {
            header: {
                "x-api-key": getEncryptedToken(),
            },
        })
            .then(res => res.json())
            .then(data => setAllKeywords(data))
            .catch(err => console.error(err));
    }, []);


    // Fetch categories
    useEffect(() => {
        fetch(API_URL + '/categories', {
            headers: {
                "x-api-key": getEncryptedToken()
            }
        })
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch(() => { });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.user_id || !form.categoryid) {
            setError("User and Category are required");
            return;
        }

        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            formData.append(key, form[key]);
        });

        if (BusinessCard) formData.append("BusinessCard", BusinessCard);
        if (BusinessLogo) formData.append("BusinessLogo", BusinessLogo);

        try {
            const res = await fetch(API_URL + '/business', {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                      "x-api-key": getEncryptedToken()
                }
            });

            // ✅ FIRST parse JSON
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to create business");
                return;
            }

            // ✅ NOW store businessId
            updateBusinessId(data.business_id);


            const user = JSON.parse(localStorage.getItem("user"));
            user.businessId = data.business_id;
            localStorage.setItem("user", JSON.stringify(user));

            setSuccess("Business added successfully!");

            setTimeout(() => {
                navigate("/familyList");
            }, 1500);

        } catch (err) {
            console.error(err);
            setError("Server error");
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
                <div className="col-lg-8 col-xl-6">
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
                                Add New Business
                            </h2>
                            <p style={{ color: "#5D4037", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                                Register a new family-owned business to the community
                            </p>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            {/* Alerts */}
                            {error && (
                                <div
                                    className="alert alert-danger alert-dismissible fade show"
                                    style={{ fontFamily: "'Georgia', serif" }}
                                >
                                    {error}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setError("")}
                                    ></button>
                                </div>
                            )}

                            {success && (
                                <div
                                    className="alert alert-success alert-dismissible fade show"
                                    style={{ fontFamily: "'Georgia', serif" }}
                                >
                                    {success}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSuccess("")}
                                    ></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Left Column */}
                                    <div className="col-md-6 mb-4">


                                        <div className="mb-4">
                                            <label
                                                className="form-label fw-bold"
                                                style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                                            >
                                                Business Category *
                                            </label>
                                            <select
                                                className="form-control"
                                                name="categoryid"
                                                value={form.categoryid}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    border: "1.5px solid #D4A76A",
                                                    borderRadius: "8px",
                                                    fontFamily: "'Georgia', serif",
                                                    color: "#5D4037",
                                                    padding: "0.75rem",
                                                    fontSize: "0.95rem"
                                                }}
                                            >
                                                <option value="" style={{ color: "#8B4513" }}>Select a category...</option>
                                                {categories.map((c) => (
                                                    <option
                                                        key={c.categoryid}
                                                        value={c.categoryid}
                                                        style={{ color: "#5D4037" }}
                                                    >
                                                        {c.categoryName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
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
                                                value={form.BusinessName}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter business name"
                                                style={{
                                                    border: "1.5px solid #D4A76A",
                                                    borderRadius: "8px",
                                                    fontFamily: "'Georgia', serif",
                                                    color: "#5D4037",
                                                    padding: "0.75rem",
                                                    fontSize: "0.95rem"
                                                }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="form-label fw-bold"
                                                style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                                            >
                                                Business Website
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="BusinessWebsite"
                                                value={form.BusinessWebsite}
                                                onChange={handleChange}
                                                placeholder="https://example.com"
                                                style={{
                                                    border: "1.5px solid #D4A76A",
                                                    borderRadius: "8px",
                                                    fontFamily: "'Georgia', serif",
                                                    color: "#5D4037",
                                                    padding: "0.75rem",
                                                    fontSize: "0.95rem"
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="col-md-6 mb-4">
                                        <div className="mb-4">
                                            <label
                                                className="form-label fw-bold"
                                                style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                                            >
                                                Business Address
                                            </label>
                                            <textarea
                                                className="form-control"
                                                name="BusinessAddress"
                                                rows="3"
                                                value={form.BusinessAddress}
                                                onChange={handleChange}
                                                placeholder="Full business address"
                                                style={{
                                                    border: "1.5px solid #D4A76A",
                                                    borderRadius: "8px",
                                                    fontFamily: "'Georgia', serif",
                                                    color: "#5D4037",
                                                    padding: "0.75rem",
                                                    fontSize: "0.95rem",
                                                    resize: "vertical"
                                                }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="form-label fw-bold"
                                                style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                                            >
                                                Business Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                name="BusinessDescription"
                                                rows="4"
                                                value={form.BusinessDescription}
                                                onChange={handleChange}
                                                placeholder="Describe the business, its history, and services..."
                                                style={{
                                                    border: "1.5px solid #D4A76A",
                                                    borderRadius: "8px",
                                                    fontFamily: "'Georgia', serif",
                                                    color: "#5D4037",
                                                    padding: "0.75rem",
                                                    fontSize: "0.95rem",
                                                    resize: "vertical"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* File Uploads Section */}
                                <div
                                    className="p-4 mb-4"
                                    style={{
                                        backgroundColor: "#F9F3E9",
                                        borderRadius: "10px",
                                        border: "1px dashed #D4A76A"
                                    }}
                                >
                                    <h5
                                        className="mb-3"
                                        style={{ color: "#8B4513", fontFamily: "'Georgia', serif" }}
                                    >
                                        Business Images
                                    </h5>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label
                                                className="form-label fw-bold"
                                                style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                                            >
                                                Business Card Image
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={(e) => setBusinessCard(e.target.files[0])}
                                                    style={{
                                                        border: "1.5px solid #D4A76A",
                                                        borderRadius: "8px",
                                                        fontFamily: "'Georgia', serif",
                                                        color: "#5D4037"
                                                    }}
                                                />
                                            </div>
                                            <small className="form-text" style={{ color: "#8B4513" }}>
                                                Upload business card (JPG, PNG, max 2MB)
                                            </small>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label
                                                className="form-label fw-bold"
                                                style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                                            >
                                                Business Logo
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={(e) => setBusinessLogo(e.target.files[0])}
                                                    style={{
                                                        border: "1.5px solid #D4A76A",
                                                        borderRadius: "8px",
                                                        fontFamily: "'Georgia', serif",
                                                        color: "#5D4037"
                                                    }}
                                                />
                                            </div>
                                            <small className="form-text" style={{ color: "#8B4513" }}>
                                                Upload logo (JPG, PNG, max 2MB)
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
                                        ← Back to List
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn"
                                        style={{
                                            backgroundColor: "#D4A76A",
                                            color: "white",
                                            border: "none",
                                            fontFamily: "'Georgia', serif",
                                            fontWeight: "bold",
                                            padding: "0.75rem 3rem",
                                            borderRadius: "8px",
                                            fontSize: "1rem",
                                            boxShadow: "0 3px 10px rgba(212, 167, 106, 0.3)"
                                        }}
                                    >
                                        Save Business
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-4">
                        <p style={{ color: "#5D4037", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>
                            All fields marked with * are required. Help us preserve family business legacies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}