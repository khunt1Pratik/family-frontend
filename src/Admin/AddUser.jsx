import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEncryptedToken } from "../utils/encryptToken";


const API_URL = import.meta.env.VITE_API_URL+"/user";

export default function AddUser() {
  const [form, setForm] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    VillageName: "",
    CityName: "",
    Email: "",
    PhoneNumber: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const navigate = useNavigate();

  const token = localStorage.getItem("token")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

     console.log("Submitting form:", form);

    if (!form.FirstName || !form.PhoneNumber || !form.password) {
      setSeverity("danger");
      setMessage("First name, phone number, and password are required");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json",   Authorization: `Bearer ${token}`,  "x-api-key": getEncryptedToken()},
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("Server response:", data);

      if (!res.ok) {
        setSeverity("danger");
        setMessage(data.message || "Registration failed");
        return;
      }

      setSeverity("success");
      setMessage("User added successfully!");
      setTimeout(() => navigate("/userList"), 1500);
    } catch (err) {
      console.error(err);
      setSeverity("danger");
      setMessage("Server error");
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
        <div className="col-lg-7 col-xl-6">
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
                Add New Family Member
              </h2>
              <p style={{ color: "#5D4037", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Register a new family member to the community
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Alert Message */}
              {message && (
                <div 
                  className={`alert alert-${severity} alert-dismissible fade show mb-4`}
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {message}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setMessage("")}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Name Section */}
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
                      Personal Information
                    </h5>
                  </div>

                  <div className="col-md-4 mb-4">
                    <label 
                      className="form-label fw-bold"
                      style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter first name"
                      name="FirstName"
                      value={form.FirstName}
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
                    />
                  </div>

                  <div className="col-md-4 mb-4">
                    <label 
                      className="form-label fw-bold"
                      style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                    >
                      Middle Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter middle name"
                      name="MiddleName"
                      value={form.MiddleName}
                      onChange={handleChange}
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

                  <div className="col-md-4 mb-4">
                    <label 
                      className="form-label fw-bold"
                      style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter last name"
                      name="LastName"
                      value={form.LastName}
                      onChange={handleChange}
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

                  {/* Location Information */}
                  <div className="mb-4 mt-3">
                    <h5 
                      className="mb-3"
                      style={{
                        color: "#8B4513",
                        fontFamily: "'Georgia', serif",
                        borderBottom: "2px solid #D4A76A",
                        paddingBottom: "0.5rem"
                      }}
                    >
                      Location Information
                    </h5>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label 
                      className="form-label fw-bold"
                      style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                    >
                      Village Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter village name"
                      name="VillageName"
                      value={form.VillageName}
                      onChange={handleChange}
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

                  <div className="col-md-6 mb-4">
                    <label 
                      className="form-label fw-bold"
                      style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                    >
                      City Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter city name"
                      name="CityName"
                      value={form.CityName}
                      onChange={handleChange}
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

                  {/* Contact Information */}
                  <div className="mb-4 mt-3">
                    <h5 
                      className="mb-3"
                      style={{
                        color: "#8B4513",
                        fontFamily: "'Georgia', serif",
                        borderBottom: "2px solid #D4A76A",
                        paddingBottom: "0.5rem"
                      }}
                    >
                      Contact Information
                    </h5>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label 
                      className="form-label fw-bold"
                      style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email address"
                      name="Email"
                      value={form.Email}
                      onChange={handleChange}
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

                  <div className="col-md-6 mb-4">
                    <label 
                      className="form-label fw-bold"
                      style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                    >
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter phone number"
                      name="PhoneNumber"
                      value={form.PhoneNumber}
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
                    />
                  </div>

                  {/* Security Section */}
                  <div className="mb-4 mt-3">
                    <h5 
                      className="mb-3"
                      style={{
                        color: "#8B4513",
                        fontFamily: "'Georgia', serif",
                        borderBottom: "2px solid #D4A76A",
                        paddingBottom: "0.5rem"
                      }}
                    >
                      Security Information
                    </h5>
                  </div>

                  <div className="col-12 mb-4">
                    <label 
                      className="form-label fw-bold"
                      style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                    >
                      Password *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Create a secure password"
                      name="password"
                      value={form.password}
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
                    />
                    <small className="form-text" style={{ color: "#8B4513" }}>
                      Password must be at least 6 characters long
                    </small>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => navigate("/userList")}
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
                    Add Family Member
                  </button>
                </div>

                {/* Form Note */}
                <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #F5E6D3" }}>
                  <p style={{ color: "#5D4037", fontSize: "0.85rem" }}>
                    Fields marked with * are required. All information will be kept confidential.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-4">
            <p style={{ color: "#5D4037", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>
              Building a stronger family business community together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}