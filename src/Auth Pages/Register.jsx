import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!form.FirstName || !form.PhoneNumber || !form.password) {
      setSeverity("error");
      setMessage("First name, phone number, and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL+"/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,   "x-api-key": "my_secret_static_token"},
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setSeverity("error");
        setMessage(data.message || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setSeverity("success");
      setMessage("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setSeverity("error");
      setMessage("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
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


      {/* Main Registration Card */}
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
                Join Our Family Community
              </h2>
              <p style={{ color: "#5D4037", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Register to connect with family-owned businesses
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Alert Message */}
              {message && (
                <div 
                  className={`alert alert-${severity === "error" ? "danger" : "success"} alert-dismissible fade show mb-4`}
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
                  {/* Left Column - Personal Information */}
                  <div className="col-md-6 mb-4">
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

                    <div className="mb-3">
                      <label 
                        className="form-label fw-bold"
                        style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your first name"
                        name="FirstName"
                        value={form.FirstName}
                        onChange={handleChange}
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

                    <div className="mb-3">
                      <label 
                        className="form-label"
                        style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                      >
                        Middle Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your middle name"
                        name="MiddleName"
                        value={form.MiddleName}
                        onChange={handleChange}
                        style={{
                          border: "1.5px solid #D4A76A",
                          borderRadius: "8px",
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          padding: "0.75rem"
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label 
                        className="form-label"
                        style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your last name"
                        name="LastName"
                        value={form.LastName}
                        onChange={handleChange}
                        style={{
                          border: "1.5px solid #D4A76A",
                          borderRadius: "8px",
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          padding: "0.75rem"
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column - Contact & Location */}
                  <div className="col-md-6 mb-4">
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
                        Location & Contact
                      </h5>
                    </div>

                    <div className="mb-3">
                      <label 
                        className="form-label"
                        style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                      >
                        Village Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your village name"
                        name="VillageName"
                        value={form.VillageName}
                        onChange={handleChange}
                        style={{
                          border: "1.5px solid #D4A76A",
                          borderRadius: "8px",
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          padding: "0.75rem"
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label 
                        className="form-label"
                        style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                      >
                        City Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your city name"
                        name="CityName"
                        value={form.CityName}
                        onChange={handleChange}
                        style={{
                          border: "1.5px solid #D4A76A",
                          borderRadius: "8px",
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          padding: "0.75rem"
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label 
                        className="form-label"
                        style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email address"
                        name="Email"
                        value={form.Email}
                        onChange={handleChange}
                        style={{
                          border: "1.5px solid #D4A76A",
                          borderRadius: "8px",
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          padding: "0.75rem"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="row">
                  <div className="col-12 mb-4">
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
                        Security Information
                      </h5>
                    </div>
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
                      placeholder="Enter your phone number"
                      name="PhoneNumber"
                      value={form.PhoneNumber}
                      onChange={handleChange}
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
                        padding: "0.75rem"
                      }}
                    />
                    <small className="form-text" style={{ color: "#8B4513", fontSize: "0.85rem" }}>
                      Password must be at least 6 characters long
                    </small>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-3">
                  <Link 
                    to="/login" 
                    className="btn mb-3 mb-md-0"
                    style={{
                      backgroundColor: "#8B4513",
                      color: "white",
                      border: "none",
                      fontFamily: "'Georgia', serif",
                      fontWeight: "bold",
                      padding: "0.75rem 2rem",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textDecoration: "none",
                      textAlign: "center"
                    }}
                  >
                    ← Back to Login
                  </Link>
                  
                  <button 
                    type="submit" 
                    className="btn"
                    disabled={isLoading}
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
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>

                {/* Form Note */}
                <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #F5E6D3" }}>
                  <p style={{ color: "#5D4037", fontSize: "0.85rem" }}>
                    Fields marked with * are required. By registering, you agree to our terms and conditions.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-4">
            <p style={{ color: "#5D4037", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>
              Join our community of family businesses and help preserve traditional craftsmanship
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}