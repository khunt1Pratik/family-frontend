import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateTransliterations } from "../utils/gujaratiTransliterate";
import {getEncryptedToken} from "../utils/encryptToken";

export default function UserList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` ,   "x-api-key": getEncryptedToken()},
      });

      if (res.status === 401 || res.status === 403) {
        alert("Token invalid or expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await res.json();

      const normalized = result.map((u) => ({
        ...u,
        isAdmin: Number(u.isAdmin),
      }));

      setData(normalized);
      setFilteredData(normalized);
    } catch (err) {
      console.error(err);
      setAlert({
        show: true,
        message: "Failed to fetch users",
        type: "danger",
      });
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredData(data);
      setPage(1);
      return;
    }

    const variants = generateTransliterations(search.toLowerCase());

    const filtered = data.filter((u) =>
      [
        `${u.FirstName} ${u.MiddleName} ${u.LastName}`,
        u.Email,
        u.PhoneNumber,
      ].some(
        (field) =>
          field &&
          variants.some((v) => field.toLowerCase().includes(v))
      )
    );

    setFilteredData(filtered);
    setPage(1);
  };

  // Toggle admin
  const handleToggleAdmin = async (id, current) => {
  const newStatus = current === 1 ? false : true; // send boolean

  try {
    const res = await fetch(`${API_URL}/user/admin/${id}`, { 
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
          "x-api-key": getEncryptedToken()
      },
      body: JSON.stringify({ isAdmin: newStatus }), // send boolean
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("API Bad Request:", data);
      throw new Error(data.message || "Bad Request");
    }

    setData((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, isAdmin: newStatus } : u
      )
    );

    setFilteredData((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, isAdmin: newStatus } : u
      )
    );

    setAlert({
      show: true,
      message: `Admin ${newStatus ? "Enabled" : "Disabled"}`,
      type: "success",
    });
  } catch (err) {
    console.error(err);
    setAlert({
      show: true,
      message: err.message || "Update failed",
      type: "danger",
    });
  }
};

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await fetch(`${API_URL}/user/${id}`, {  
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`,  "x-api-key": getEncryptedToken()},
      });

      if (!res.ok) throw new Error();

      setAlert({
        show: true,
        message: "User deleted successfully",
        type: "success",
      });

      fetchUsers();
    } catch {
      setAlert({
        show: true,
        message: "Delete failed",
        type: "danger",
      });
    }
  };

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "linear-gradient(135deg, #f8f4e6 0%, #fff9e6 30%, #ffffff 100%)",
        minHeight: "100vh",
        fontFamily: "'Georgia', 'Times New Roman', serif"
      }}
    >

      {/* Search Section */}
      <div className="row mb-4 justify-content-center">
        <div className="col-md-8 d-flex align-items-center justify-content-between flex-wrap">

          {/* Search Box */}
          <div className="input-group mb-2" style={{ maxWidth: "600px" }}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "2px solid #D4A76A",
                borderRadius: "8px 0 0 8px",
                fontFamily: "'Georgia', serif",
                fontSize: "1rem"
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="btn btn-lg"
              onClick={handleSearch}
              style={{
                backgroundColor: "#8B4513",
                color: "white",
                border: "2px solid #8B4513",
                borderRadius: "0 8px 8px 0",
                fontFamily: "'Georgia', serif",
                fontWeight: "bold",
                padding: "0.5rem 2rem"
              }}
            >
              Search
            </button>
          </div>

          {/* Add Button */}
          <div className="mb-2">
            <button
              className="btn"
              style={{
                backgroundColor: "#D4A76A",
                color: "white",
                border: "none",
                fontFamily: "'Georgia', serif",
                fontWeight: "bold",
                padding: "0.5rem 1.5rem"
              }}
              onClick={() => navigate("/addUser")}
            >
              Add New User
            </button>
          </div>

        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <div
          className={`alert alert-${alert.type} text-center mx-auto mb-4`}
          style={{
            maxWidth: "500px",
            fontFamily: "'Georgia', serif",
            fontSize: "0.9rem"
          }}
        >
          {alert.message}
        </div>
      )}

      {/* Table Section */}
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div
            className="table-container p-4"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(212, 167, 106, 0.3)"
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr style={{ backgroundColor: "#F5E6D3" }}>
                    <th>No</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Village</th>
                    <th>City</th>
                    <th>Admin</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row, index) => (
                      <tr key={row.id}>
                        <td>{(page - 1) * rowsPerPage + index + 1}</td>
                        <td>{[row.FirstName, row.MiddleName, row.LastName].filter(Boolean).join(" ")}</td>
                        <td>{row.PhoneNumber || "-"}</td>
                        <td>{row.Email || "-"}</td>
                        <td>{row.VillageName || "-"}</td>
                        <td>{row.CityName || "-"}</td>
                        <td>
                          <div className="form-check form-switch d-flex justify-content-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={row.isAdmin === 1}
                              onChange={() => handleToggleAdmin(row.id, row.isAdmin)}
                            />
                          </div>
                        </td>
                        <td>
                          <button onClick={() => navigate(`/adminUserEdit/${row.id}`, { state: row })} className="btn btn-sm me-2" style={{ backgroundColor: "#8B4513", color: "white" }}>Edit</button>
                          <button onClick={() => handleDelete(row.id)} className="btn btn-sm" style={{ backgroundColor: "#C41E3A", color: "white" }}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                  {Array.from({ length: Math.ceil(filteredData.length / rowsPerPage) }).map((_, i) => (
                    <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                      <button onClick={() => setPage(i + 1)} className="page-link">
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
