import { useEffect, useState } from "react";
import { getEncryptedToken } from "../utils/encryptToken";
import { Modal, Form, Button } from "react-bootstrap";


export default function AdminKeyword() {

  const API_URL = import.meta.env.VITE_API_URL + "/keyword";
  const token = localStorage.getItem("token");
  
  const [keywords, setKeywords] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ id: null, keyword_name: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ show: false, text: "", type: "" });

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}`, "x-api-key": getEncryptedToken() },
      });
      const data = await res.json();
      setKeywords(data);
    } catch (err) {
      console.error("Error fetching keywords:", err);
      setMessage({
        show: true,
        text: "Failed to load keywords",
        type: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  const toggleForm = (keyword = null) => {
    if (keyword) {
      setFormData({ id: keyword.id, keyword_name: keyword.keyword_name });
    } else {
      setFormData({ id: null, keyword_name: "" });
    }
    setFormVisible(prev => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.keyword_name.trim()) {
      setMessage({
        show: true,
        text: "Please enter a keyword name",
        type: "warning"
      });
      return;
    }

    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id ? `${API_URL}/${formData.id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": getEncryptedToken()
        },
        body: JSON.stringify({ keyword_name: formData.keyword_name }),
      });

      if (!res.ok) throw new Error("Failed to save keyword");

      setMessage({
        show: true,
        text: formData.id ? "Keyword updated successfully" : "Keyword added successfully",
        type: "success"
      });

      fetchKeywords();
      setFormVisible(false);
      setFormData({ id: null, keyword_name: "" });
    } catch (err) {
      console.error("Error saving keyword:", err);
      setMessage({
        show: true,
        text: "Failed to save keyword",
        type: "danger"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this keyword?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "x-api-key": getEncryptedToken() },
      });

      if (!res.ok) throw new Error("Delete failed");

      setMessage({
        show: true,
        text: "Keyword deleted successfully",
        type: "success"
      });

      fetchKeywords();
    } catch (err) {
      console.error("Error deleting keyword:", err);
      setMessage({
        show: true,
        text: "Failed to delete keyword",
        type: "danger"
      });
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


      {/* Main Content */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            {/* Main Card */}
            <div
              className="card border-0 shadow-sm"
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
                className="card-header py-4"
                style={{
                  backgroundColor: "#F5E6D3",
                  borderBottom: "2px solid #D4A76A"
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2
                      className="mb-0"
                      style={{
                        color: "#8B4513",
                        fontFamily: "'Georgia', serif",
                        fontWeight: "bold"
                      }}
                    >
                      <i className="bi bi-tags-fill me-3" style={{ color: "#8B4513" }}></i>
                      Manage Keywords
                    </h2>
                    <p className="mb-0 mt-2" style={{ color: "#5D4037", fontSize: "0.95rem" }}>
                      Add, edit, or delete business keywords for better searchability
                    </p>
                  </div>

                  <button
                    className="btn"
                    onClick={() => toggleForm()}
                    style={{
                      backgroundColor: "#D4A76A",
                      color: "white",
                      border: "none",
                      fontFamily: "'Georgia', serif",
                      fontWeight: "bold",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {formVisible ? (
                      <>
                        <i className="bi bi-x-lg me-2"></i>
                        Cancel
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Keyword
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body p-4">
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

                {/* Keywords Table */}
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5
                      style={{
                        color: "#8B4513",
                        fontFamily: "'Georgia', serif",
                        fontWeight: "bold"
                      }}
                    >
                      <i className="bi bi-list-ul me-2"></i>
                      All Keywords
                    </h5>
                    <span
                      style={{
                        backgroundColor: "#F5E6D3",
                        color: "#8B4513",
                        fontFamily: "'Georgia', serif",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.9rem"
                      }}
                    >
                      {keywords.length} keywords
                    </span>
                  </div>

                  {/* Add/Edit Form */}
                  {formVisible && (
                    <form onSubmit={handleSubmit} className="mb-4" style={{
                      backgroundColor: "#F9F3E9",
                      padding: "1.5rem",
                      borderRadius: "10px",
                      border: "2px solid #D4A76A"
                    }}>
                      <h6 style={{
                        color: "#8B4513",
                        fontFamily: "'Georgia', serif",
                        fontWeight: "bold",
                        marginBottom: "1rem"
                      }}>
                        {formData.id ? "Edit Keyword" : "Add New Keyword"}
                      </h6>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            color: "#5D4037",
                            fontFamily: "'Georgia', serif",
                            fontWeight: "bold",
                            marginBottom: "0.5rem"
                          }}
                        >
                          Keyword Name
                        </Form.Label>

                        <Form.Control
                          type="text"
                          autoFocus
                          placeholder="Enter keyword (e.g., Restaurant, Retail, Service)"
                          name="keyword_name"
                          value={formData.keyword_name}
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

                        <small style={{ color: "#8B4513" }}>
                          Keywords help users in search
                        </small>
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          onClick={() => toggleForm()}
                          style={{
                            border: "1.5px solid #8B4513",
                            color: "#8B4513",
                            fontFamily: "'Georgia', serif",
                            padding: "0.5rem 1.5rem",
                            borderRadius: "8px"
                          }}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="submit"
                          style={{
                            backgroundColor: "#D4A76A",
                            border: "none",
                            fontFamily: "'Georgia', serif",
                            fontWeight: "bold",
                            padding: "0.5rem 2rem",
                            borderRadius: "8px",
                            color: "white"
                          }}
                        >
                          {formData.id ? "Update Keyword" : "Create Keyword"}
                        </Button>
                      </div>
                    </form>
                  )}

                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status" style={{ color: "#D4A76A" }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3" style={{ color: "#5D4037" }}>
                        Loading keywords...
                      </p>
                    </div>
                  ) : keywords.length === 0 ? (
                    <div
                      className="text-center py-5"
                      style={{
                        backgroundColor: "#F9F3E9",
                        borderRadius: "10px",
                        border: "1px dashed #D4A76A"
                      }}
                    >
                      <div className="mb-3">
                        <i
                          className="bi bi-tag"
                          style={{
                            fontSize: "3rem",
                            color: "#D4A76A",
                            opacity: "0.5"
                          }}
                        ></i>
                      </div>
                      <h5 style={{ color: "#8B4513" }}>No keywords found</h5>
                      <p className="mb-0" style={{ color: "#5D4037" }}>
                        Add your first keyword to get started
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr style={{ backgroundColor: "#F5E6D3" }}>
                            <th style={{
                              fontFamily: "'Georgia', serif",
                              color: "#5D4037",
                              padding: "1rem 1.5rem",
                              fontWeight: "bold"
                            }}>
                              <i className="bi bi-hash me-2"></i>
                              ID
                            </th>
                            <th style={{
                              fontFamily: "'Georgia', serif",
                              color: "#5D4037",
                              padding: "1rem 1.5rem",
                              fontWeight: "bold"
                            }}>
                              <i className="bi bi-tag me-2"></i>
                              Keyword Name
                            </th>
                            <th style={{
                              fontFamily: "'Georgia', serif",
                              color: "#5D4037",
                              padding: "1rem 1.5rem",
                              fontWeight: "bold"
                            }}>
                              <i className="bi bi-gear me-2"></i>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {keywords.map((k) => (
                            <tr
                              key={k.id}
                              style={{
                                borderBottom: "1px solid #F5E6D3",
                                transition: "background-color 0.2s ease"
                              }}
                              className="hover-effect"
                            >
                              <td style={{
                                fontFamily: "'Georgia', serif",
                                color: "#5D4037",
                                padding: "1rem 1.5rem"
                              }}>
                                <div
                                  style={{
                                    backgroundColor: "#F5E6D3",
                                    color: "#8B4513",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "'Georgia', serif",
                                    fontWeight: "500"
                                  }}
                                >
                                  {k.id}
                                </div>
                              </td>
                              <td style={{
                                fontFamily: "'Georgia', serif",
                                color: "#5D4037",
                                padding: "1rem 1.5rem",
                                fontWeight: "500"
                              }}>
                                {k.keyword_name}
                              </td>
                              <td style={{ padding: "1rem 1.5rem" }}>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-sm"
                                    onClick={() => toggleForm(k)}
                                    style={{
                                      backgroundColor: "#8B4513",
                                      color: "white",
                                      border: "none",
                                      fontFamily: "'Georgia', serif",
                                      padding: "0.5rem 1rem",
                                      borderRadius: "6px",
                                      fontSize: "0.85rem"
                                    }}
                                  >
                                    <i className="bi bi-pencil me-1"></i>
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm"
                                    onClick={() => handleDelete(k.id)}
                                    style={{
                                      backgroundColor: "#C41E3A",
                                      color: "white",
                                      border: "none",
                                      fontFamily: "'Georgia', serif",
                                      padding: "0.5rem 1rem",
                                      borderRadius: "6px",
                                      fontSize: "0.85rem"
                                    }}
                                  >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-4">
              <p style={{ color: "#5D4037", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>
                Keywords help categorize and improve searchability of family businesses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for hover effect */}
      <style>{`
        .hover-effect:hover {
          background-color: rgba(245, 230, 211, 0.3) !important;
        }
      `}</style>
    </div>
  );
}