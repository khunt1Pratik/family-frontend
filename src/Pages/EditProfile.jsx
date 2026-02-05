import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEncryptedToken } from "../utils/encryptToken";

export default function UpdateForm() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    VillageName: "",
    CityName: "",
    Email: "",
    PhoneNumber: "",
    password: "",
    ConfirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

const fetchUser = async () => {
  try {
    console.log("Fetching user", userId);
    const res = await fetch(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": getEncryptedToken(),
      },
    });


    const data = await res.json();


    if (!res.ok) {
      setMessage(data.message || "Failed to fetch user");
      setMessageType("danger");
      return;
    }

    setFormData({
      FirstName: data.FirstName || "",
      MiddleName: data.MiddleName || "",
      LastName: data.LastName || "",
      VillageName: data.VillageName || "",
      CityName: data.CityName || "",
      Email: data.Email || "",
      password: "",
      ConfirmPassword: "",
      PhoneNumber: data.PhoneNumber || "",
    });
  } catch (err) {
    console.error("Fetch error:", err);
    setMessage("Server error");
    setMessageType("danger");
  }
};


    fetchUser();
  }, [token, userId, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ✅ Password match check
    if (formData.password || formData.ConfirmPassword) {
      if (formData.password !== formData.ConfirmPassword) {
        setMessage("Password and Confirm Password do not match");
        setMessageType("danger");
        return;
      }
    }

    const { ConfirmPassword, ...submitData } = formData;

    try {
      const res = await fetch(`${API_URL}/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
            "x-api-key": getEncryptedToken()
        },
        body: JSON.stringify(submitData),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Update failed");
        setMessageType("danger");
        return;
      }

      setMessage("Profile updated successfully");
      setMessageType("success");

      const updatedUser = { ...user, ...submitData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate("/familyList");
      }, 1500);
    } catch {
      setMessage("Server error");
      setMessageType("danger");
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
                Edit Your Profile
              </h2>
              <p style={{ color: "#5D4037", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Update your personal information
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Alert Message */}
              {message && (
                <div
                  className={`alert alert-${messageType} alert-dismissible fade show mb-4`}
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
                  {/* Personal Information Section */}
                  <div className="mb-4">
                    <h5
                      className="mb-3"
                      style={{
                        color: "#8B4513",
                        borderBottom: "2px solid #D4A76A",
                        paddingBottom: "0.5rem"
                      }}
                    >
                      Personal Information
                    </h5>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#5D4037" }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="FirstName"
                      value={formData.FirstName}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
                        color: "#5D4037",
                        padding: "0.75rem",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#5D4037" }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="LastName"
                      value={formData.LastName}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
                        color: "#5D4037",
                        padding: "0.75rem",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#5D4037" }}
                    >
                      Middle Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="MiddleName"
                      value={formData.MiddleName}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
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
                      style={{ color: "#5D4037" }}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="CityName"
                      value={formData.CityName}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
                        color: "#5D4037",
                        padding: "0.75rem",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#5D4037" }}
                    >
                      Village
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="VillageName"
                      value={formData.VillageName}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
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
                      style={{ color: "#5D4037" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
                        color: "#5D4037",
                        padding: "0.75rem",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#5D4037" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="PhoneNumber"
                      value={formData.PhoneNumber}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
                        color: "#5D4037",
                        padding: "0.75rem",
                        fontSize: "0.95rem",
                        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
                      }}
                    />
                  </div>

                  <div className="mb-4 mt-3">
                    <h5
                      className="mb-3"
                      style={{
                        color: "#8B4513",
                        borderBottom: "2px solid #D4A76A",
                        paddingBottom: "0.5rem"
                      }}
                    >
                      Password Information
                    </h5>
                  </div>



                  <div className="col-md-6 mb-4">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#5D4037" }}
                    >
                      Enter Password
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
                        color: "#5D4037",
                        padding: "0.75rem",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#5D4037" }}
                    >
                      Enter Conform Password
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="ConfirmPassword"
                      value={formData.ConfirmPassword}
                      onChange={handleChange}
                      style={{
                        border: "1.5px solid #D4A76A",
                        borderRadius: "8px",
                        color: "#5D4037",
                        padding: "0.75rem",
                        fontSize: "0.95rem",
                        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
                      }}
                    />
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
                    style={{
                      backgroundColor: "#D4A76A",
                      color: "white",
                      border: "none",
                      fontWeight: "bold",
                      padding: "0.75rem 3rem",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      boxShadow: "0 3px 10px rgba(212, 167, 106, 0.3)"
                    }}
                  >
                    Save Changes
                  </button>
                </div>

                {/* Form Note */}
                <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #F5E6D3" }}>
                  <p style={{ color: "#5D4037", fontSize: "0.85rem" }}>
                    Keep your information up to date to help us connect you with family businesses
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-4">
            <p style={{ color: "#5D4037", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>
              Your information helps us build a stronger family business community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}