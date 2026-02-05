import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateTransliterations } from "../utils/gujaratiTransliterate";
import {getEncryptedToken} from "../utils/encryptToken";


export default function AdminFamilyList() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [alert, setAlert] = useState({ show: false, msg: "", type: "success" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const url = import.meta.env.VITE_API_URL+"/business";
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) navigate("/login");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/business`,{
        headers: {
            "x-api-key": getEncryptedToken()
          },
      });
      const result = await res.json();
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error(err);
    }
  };

  // Search
  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredData(data);
      setPage(1);
      return;
    }

    const variants = generateTransliterations(search);
    const filtered = data.filter((item) =>
      [item.BusinessName, item.BusinessKeyword , item.UserDatum.PhoneNumber, item.UserDatum.FirstName , item.UserDatum.MiddleName , item.UserDatum.LastName].some(
        (field) =>
          field &&
          variants.some((v) => field.toLowerCase().includes(v))
      )
    );

    setFilteredData(filtered);
    setPage(1);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await fetch(`${API_URL}/business${id}`, { method: "DELETE" ,
         headers: {
     Authorization: `Bearer ${token}`,
       "x-api-key": getEncryptedToken()
  }
      });
      setAlert({ show: true, msg: "Deleted Successfully!", type: "success" });
      fetchData();
    } catch {
      setAlert({ show: true, msg: "Delete Failed!", type: "danger" });
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
      }}
    >


      {/* Search + Add Section (Single Row) */}
      <div className="row mb-4 justify-content-center">
        <div className="col-md-8 d-flex align-items-center justify-content-between flex-wrap">

          {/* Search Box */}
          <div className="input-group mb-2" style={{ maxWidth: "600px" }}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search businesses..."
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
              onClick={() => navigate("/AddBusiness")}
            >
              Add New Business
            </button>
          </div>

        </div>
      </div>


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
            <h4
              className="text-center mb-4"
              style={{
                color: "#8B4513",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontWeight: "bold",
                borderBottom: "2px solid #D4A76A",
                paddingBottom: "10px"
              }}
            >
              Family Business List
            </h4>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr style={{ backgroundColor: "#F5E6D3" }}>
                    <th style={{ fontFamily: "'Georgia', serif", color: "#5D4037" }}>No</th>
                    <th style={{ fontFamily: "'Georgia', serif", color: "#5D4037" }}>Logo</th>
                    <th style={{ fontFamily: "'Georgia', serif", color: "#5D4037" }}>Name</th>
                    <th style={{ color: "#5D4037" }}>Phone</th>
                    <th style={{ fontFamily: "'Georgia', serif", color: "#5D4037" }}>Business</th>
                    <th style={{ fontFamily: "'Georgia', serif", color: "#5D4037" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4" style={{ color: "#5D4037" }}>
                        No Data Found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row, index) => (
                      <tr key={row.id} style={{ borderBottom: "1px solid #F5E6D3" }}>
                        <td style={{color: "#5D4037" }}>
                          {(page - 1) * rowsPerPage + index + 1}
                        </td>
                        <td>
                          {row.BusinessLogo ? (
                            <img
                              src={`${API_URL}/uploads/${row.BusinessLogo}`}
                              alt="logo"
                              style={{
                                width: "80px",
                                height: "50px",
                                borderRadius: "5px",
                                objectFit: "cover",
                                border: "1px solid #D4A76A"
                              }}
                            />
                          ) : (
                            <div style={{
                              width: "80px",
                              height: "50px",
                              backgroundColor: "#F5E6D3",
                              borderRadius: "5px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#8B4513",
                            }}>
                              No Logo
                            </div>
                          )}
                        </td>
                        <td style={{ color: "#5D4037" }}>
                          {row.UserDatum
                            ? `${row.UserDatum.FirstName} ${row.UserDatum.MiddleName ?? ""} ${row.UserDatum.LastName}`
                            : "-"}
                        </td>
                        <td style={{color: "#5D4037" }}>
                          {row.UserDatum?.PhoneNumber || "-"}
                        </td>
                        <td style={{  color: "#5D4037" }}>
                          {row.BusinessName || "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm me-2"
                            onClick={() =>
                              navigate(`/adminEdit/${row.id}`, { state: row })
                            }
                            style={{
                              backgroundColor: "#8B4513",
                              color: "white",
                              border: "none",
                              padding: "0.25rem 1rem"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => handleDelete(row.id)}
                            style={{
                              backgroundColor: "#C41E3A",
                              color: "white",
                              border: "none",
                              padding: "0.25rem 1rem"
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                {Array.from({
                  length: Math.ceil(filteredData.length / rowsPerPage),
                }).map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                      style={{
                        fontFamily: "'Georgia', serif",
                        color: page === i + 1 ? "white" : "#8B4513",
                        backgroundColor: page === i + 1 ? "#8B4513" : "transparent",
                        border: "1px solid #D4A76A",
                        margin: "0 2px"
                      }}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-5 pt-3" style={{ borderTop: "1px solid #D4A76A" }}>
        <p style={{ color: "#5D4037", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>
          Celebrating family businesses and their legacy in our community
        </p>
      </div>
    </div>
  );
}