import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Table,
  Form,
  Alert,
  Card,
  Badge,
  Container,
  Row,
  Col,
  InputGroup,
  Spinner
} from "react-bootstrap";
import {
  Pencil,
  Trash,
  Plus,
  Search,
  Folder,
  CheckCircle,
  XCircle
} from "react-bootstrap-icons";
import { getEncryptedToken } from "../utils/encryptToken"



export default function CategoryPage() {
  const API_URL = import.meta.env.VITE_API_URL + "/categories";

  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [msg, setMsg] = useState({ show: false, text: "", variant: "success" });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { "x-api-key": getEncryptedToken() }
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      setMsg({
        show: true,
        text: "Failed to load categories",
        variant: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Save category
  const handleSave = async () => {
    if (!categoryName.trim()) {
      setMsg({
        show: true,
        text: "Please enter a category name",
        variant: "warning"
      });
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
           "x-api-key": getEncryptedToken(),
        },
       
        body: JSON.stringify({ categoryName }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setShowModal(false);
      setEditId(null);
      setCategoryName("");
      fetchCategories();

      setMsg({
        show: true,
        text: editId ? "Category updated successfully!" : "Category added successfully!",
        variant: "success"
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMsg({ show: false, text: "", variant: "success" });
      }, 3000);
    } catch (error) {
      setMsg({
        show: true,
        text: "Failed to save category",
        variant: "danger"
      });
    }
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Delete category
  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/${categoryToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-api-key": getEncryptedToken()
        }
      });
      fetchCategories();
      setShowDeleteConfirm(false);
      setMsg({
        show: true,
        text: "Category deleted successfully!",
        variant: "success"
      });

      setTimeout(() => {
        setMsg({ show: false, text: "", variant: "success" });
      }, 3000);
    } catch (error) {
      setMsg({
        show: true,
        text: "Failed to delete category",
        variant: "danger"
      });
    }
  };

  // Edit category
  const handleEdit = (cat) => {
    setEditId(cat.categoryid);
    setCategoryName(cat.categoryName);
    setShowModal(true);
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


      <Container className="px-4">
        {/* Alert Message */}
        {msg.show && (
          <Alert
            variant={msg.variant}
            className="mx-auto mb-4"
            style={{
              maxWidth: "800px",
              fontFamily: "'Georgia', serif",
              borderRadius: "8px"
            }}
            onClose={() => setMsg({ ...msg, show: false })}
            dismissible
          >
            {msg.variant === "success" ? <CheckCircle className="me-2" /> : null}
            {msg.text}
          </Alert>
        )}


        {/* Search Bar */}
        <Row className="mb-4 justify-content-center">
          <Col lg={10}>
            <Card
              className="border-0 shadow-sm"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "15px",
                border: "1px solid rgba(212, 167, 106, 0.3)"
              }}
            >
              <Card.Body className="py-3">
                <Row className="align-items-center">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text
                        style={{
                          backgroundColor: "#F5E6D3",
                          border: "1.5px solid #D4A76A",
                          borderRight: "none",
                          color: "#8B4513"
                        }}
                      >
                        <Search />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          border: "1.5px solid #D4A76A",
                          borderLeft: "none",
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          borderRadius: "0 8px 8px 0"
                        }}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6} className="mt-3 mt-md-0">
                    <div className="d-flex justify-content-end">
                      <Button
                        className="d-flex align-items-center"
                        onClick={() => setShowModal(true)}
                        style={{
                          backgroundColor: "#D4A76A",
                          border: "none",
                          fontFamily: "'Georgia', serif",
                          fontWeight: "bold",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "8px",
                          fontSize: "1rem"
                        }}
                      >
                        <Plus size={18} className="me-2" />
                        Add New Category
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Categories Table */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card
              className="border-0 shadow-sm"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "15px",
                border: "1px solid rgba(212, 167, 106, 0.3)",
                overflow: "hidden"
              }}
            >
              <Card.Header
                style={{
                  backgroundColor: "#F5E6D3",
                  borderBottom: "2px solid #D4A76A",
                  padding: "1.25rem 1.5rem"
                }}
              >
                <h5
                  className="mb-0"
                  style={{
                    color: "#8B4513",
                    fontFamily: "'Georgia', serif",
                    fontWeight: "bold"
                  }}
                >
                  All Categories
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner
                      animation="border"
                      style={{ color: "#D4A76A", borderColor: "#D4A76A" }}
                    />
                    <p className="mt-3" style={{ color: "#5D4037" }}>Loading categories...</p>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <XCircle
                        size={48}
                        style={{ color: "#8B4513", opacity: 0.7 }}
                      />
                    </div>
                    <h5 style={{ color: "#8B4513" }}>No categories found</h5>
                    <p style={{ color: "#5D4037" }}>
                      {searchTerm ? "Try a different search term" : "Add your first category to get started"}
                    </p>
                  </div>
                ) : (
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr style={{ backgroundColor: "#FAF2E8" }}>
                        <th style={{
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          padding: "1rem 1.5rem"
                        }}>
                          ID
                        </th>
                        <th style={{
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          padding: "1rem 1.5rem"
                        }}>
                          Category Name
                        </th>
                        <th style={{
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          padding: "1rem 1.5rem"
                        }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((cat) => (
                        <tr
                          key={cat.categoryid}
                        >
                          <td style={{
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            padding: "1rem 1.5rem"
                          }}>
                            <div
                              style={{
                                color: "#8B4513",
                                fontFamily: "'Georgia', serif",
                              }}
                            >
                              {cat.categoryid}
                            </div>
                          </td>
                          <td style={{
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            padding: "1rem 1.5rem",
                            fontWeight: "500"
                          }}>
                            {cat.categoryName}
                          </td>
                          <td style={{ padding: "1rem 1.5rem" }}>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(cat)}
                                style={{
                                  border: "1.5px solid #8B4513",
                                  color: "#8B4513",
                                  fontFamily: "'Georgia', serif",
                                  padding: "0.25rem 0.75rem",
                                  borderRadius: "6px"
                                }}
                              >
                                <Pencil size={14} className="me-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(cat.categoryid)}
                                style={{
                                  border: "1.5px solid #C41E3A",
                                  color: "#C41E3A",
                                  fontFamily: "'Georgia', serif",
                                  padding: "0.25rem 0.75rem",
                                  borderRadius: "6px"
                                }}
                              >
                                <Trash size={14} className="me-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Footer Note */}
        <div className="text-center mt-5 pt-3">
          <p style={{ color: "#5D4037", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>
            Categories help organize family businesses for better community discovery
          </p>
        </div>
      </Container>

      {/* Add/Edit Category Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditId(null);
          setCategoryName("");
        }}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#F5E6D3",
            borderBottom: "2px solid #D4A76A"
          }}
        >
          <Modal.Title style={{ color: "#8B4513", fontFamily: "'Georgia', serif" }}>
            {editId ? (
              <>
                <Pencil size={20} className="me-2" />
                Edit Category
              </>
            ) : (
              <>
                <Plus size={20} className="me-2" />
                Add New Category
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                color: "#5D4037",
                fontFamily: "'Georgia', serif",
                fontWeight: "bold",
                marginBottom: "0.5rem"
              }}
            >
              Category Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name (e.g., Restaurants, Retail, Services)"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              autoFocus
              style={{
                border: "1.5px solid #D4A76A",
                borderRadius: "8px",
                fontFamily: "'Georgia', serif",
                color: "#5D4037",
                padding: "0.75rem",
                fontSize: "0.95rem"
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline"
            onClick={() => {
              setShowModal(false);
              setEditId(null);
              setCategoryName("");
            }}
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
            onClick={handleSave}
            style={{
              backgroundColor: "#D4A76A",
              border: "none",
              fontFamily: "'Georgia', serif",
              fontWeight: "bold",
              padding: "0.5rem 2rem",
              borderRadius: "8px"
            }}
          >
            {editId ? 'Update Category' : 'Create Category'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#FFEBEE",
            borderBottom: "2px solid #C41E3A"
          }}
        >
          <Modal.Title style={{ color: "#C41E3A", fontFamily: "'Georgia', serif" }}>
            <Trash size={20} className="me-2" />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div
              className="rounded-circle d-inline-flex p-3 mb-3"
              style={{ backgroundColor: "#FFEBEE" }}
            >
              <Trash size={32} style={{ color: "#C41E3A" }} />
            </div>
            <h5 style={{ color: "#5D4037", fontFamily: "'Georgia', serif" }}>
              Are you sure you want to delete this category?
            </h5>
            <p style={{ color: "#5D4037" }}>
              This action cannot be undone. All businesses under this category will need to be reassigned.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(false)}
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
            variant="danger"
            onClick={handleDelete}
            style={{
              backgroundColor: "#C41E3A",
              border: "none",
              fontFamily: "'Georgia', serif",
              padding: "0.5rem 2rem",
              borderRadius: "8px"
            }}
          >
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}