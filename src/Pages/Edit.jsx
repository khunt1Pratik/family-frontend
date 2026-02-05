import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UpdateForm() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const API_URL = "http://localhost:3001/user";

  const [formData, setFormData] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    VillageName: "",
    CityName: "",
    Email: "",
    PhoneNumber: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to fetch data");
          return;
        }

        setFormData({
          FirstName: data.FirstName || "",
          MiddleName: data.MiddleName || "",
          LastName: data.LastName || "",
          VillageName: data.VillageName || "",
          CityName: data.CityName || "",
          Email: data.Email || "",
          PhoneNumber: data.PhoneNumber || "",
        });
      } catch {
        setMessage("Server error");
      }
    };

    fetchUser();
  }, [token, userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Update failed");
        return;
      }

      setMessage("Profile updated successfully");
      setTimeout(() => navigate("/familyList"), 500);
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#fff7ed" }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: "1000px", width: "100%" }}>
        <div className="text-center mb-3">
          <h2 className="fw-bold">Edit Profile</h2>
          <p className="text-muted">
            Update your personal information
          </p>
        </div>

        {message && (
          <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Row 1 */}
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                className="form-control"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                className="form-control"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
              />
            </div>

            {/* Row 2 */}
            <div className="col-md-6">
              <label className="form-label">Middle Name</label>
              <input
                className="form-control"
                name="MiddleName"
                value={formData.MiddleName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">City</label>
              <input
                className="form-control"
                name="CityName"
                value={formData.CityName}
                onChange={handleChange}
              />
            </div>

            {/* Row 3 */}
            <div className="col-md-6">
              <label className="form-label">Village</label>
              <input
                className="form-control"
                name="VillageName"
                value={formData.VillageName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
              />
            </div>

            {/* Row 4 */}
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                className="form-control"
                name="PhoneNumber"
                value={formData.PhoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Button */}
            <div className="col-12">
              <button className="btn btn-warning w-100 mt-3 fw-semibold">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
