import { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  Badge,
  Container,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { generateTransliterations } from "../utils/gujaratiTransliterate";
import { Search } from "react-bootstrap-icons";
import useBusinessId from "../hooks/useBusinessId";
import {getEncryptedToken} from "../utils/encryptToken";



export default function UserFamilyList() {
  const [search, setSearch] = useState("");
  const [data, setList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const rowsPerPage = 3;


  const { businessId } = useBusinessId();


  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // Fetch data
  useEffect(() => {
    fetch(url + "/business", {
      headers: {
        "x-api-key": getEncryptedToken()
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        const list = Array.isArray(resData)
          ? resData
          : resData.data || resData.rows || [];
        setList(list);
        setFilteredData(list);
      })
      .catch((err) => console.error("Error:", err));

    fetch(url + "/categories", {
      headers: {
        "x-api-key": getEncryptedToken()
      },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => { });
  }, []);


  useEffect(() => {
    applyFilters();
  }, [data, appliedSearch, selectedCategory]);

  const applyFilters = () => {
    let result = [...data];

    if (appliedSearch.trim()) {
      const searchVariants = generateTransliterations(
        appliedSearch.toLowerCase()
      );

      result = result.filter(item => {
        const fields = [
          item.BusinessName,
          ...(Array.isArray(item.keywords) ? item.keywords.map(k => k.keyword_name) : [])
        ];

        return fields.some(field =>
          field &&
          searchVariants.some(variant =>
            field.toLowerCase().includes(variant)
          )
        );
      });

    }

    if (selectedCategory) {
      result = result.filter(
        item => String(item.categoryid) === String(selectedCategory)
      );
    }

    setFilteredData(result);
  };

  const handleSearchClick = async () => {
    if (search.trim() === "") {
      setAppliedSearch("");
      setFilteredData(data);
      setPage(1);
      return;
    }

    setAppliedSearch(search);
    setPage(1);

    if (search.trim().length < 5) return;

    try {
      await fetch(url + "/popularsearches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getEncryptedToken()

        },
        body: JSON.stringify({ keyword: search }),
      });
    } catch (error) {
      console.error("Search API error:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };


  const paginated = Array.isArray(filteredData)
    ? filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  // Pagination items
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === page}
        onClick={() => setPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Container
        fluid
        className="py-4"
        style={{
          background: "linear-gradient(135deg, #f8f4e6 0%, #fff9e6 30%, #ffffff 100%)",
          minHeight: "100vh",
          fontFamily: "'Georgia', 'Times New Roman', serif"
        }}
      >


        <Container className="px-4">
          {/* Search Section */}
          <div className="row mb-4 justify-content-center">
            <div className="col-lg-10">
              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "15px",
                  border: "1px solid rgba(212, 167, 106, 0.3)"
                }}
              >
                <Card.Body className="p-4">
                  <Row className="g-2 align-items-center">
                    <Col xs={12} md={5}>
                      <InputGroup>
                        <InputGroup.Text
                          style={{
                            backgroundColor: "#F5E6D3",
                            border: "1.5px solid #D4A76A",
                            borderRight: "none",
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                            color: "#8B4513"
                          }}
                        >
                          <Search />
                        </InputGroup.Text>
                        <FormControl
                          placeholder="Search by name, business or keyword"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                          style={{
                            border: "1.5px solid #D4A76A",
                            borderLeft: "none",
                            fontFamily: "'Georgia', serif",
                            color: "#5D4037",
                            borderTopRightRadius: "8px",
                            borderBottomRightRadius: "8px"
                          }}
                          onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
                        />
                      </InputGroup>
                    </Col>

                    <Col xs={12} md={4}>
                      <Form.Select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        style={{
                          border: "1.5px solid #D4A76A",
                          fontFamily: "'Georgia', serif",
                          color: "#5D4037",
                          borderRadius: "8px",
                          padding: "0.5rem",
                        }}
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.categoryid} value={cat.categoryid}>
                            {cat.categoryName}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>


                    <Col xs={12} md={3}>
                      <Button
                        onClick={handleSearchClick}
                        style={{
                          width: "100%",
                          backgroundColor: "#8B4513",
                          color: "white",
                          border: "1.5px solid #8B4513",
                          fontFamily: "'Georgia', serif",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          padding: "0.5rem 1rem"
                        }}
                      >
                        Search
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* Results Header */}
          <div className="row mb-4 justify-content-center">
            <div className="col-lg-10">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                <div>
                  <h2
                    className="mb-0"
                    style={{
                      color: "#8B4513",
                      fontFamily: "'Georgia', serif",
                      fontWeight: "bold"
                    }}
                  >
                    Your Family Businesses
                  </h2>
                  <div className="mb-0" style={{ color: "#5D4037", fontSize: "0.95rem" }}>
                    View and manage the businesses linked to your account
                  </div>
                </div>

                <div className="mt-2 mt-md-0">
                  <div
                    style={{
                      backgroundColor: "#F5E6D3",
                      color: "#8B4513",
                      fontFamily: "'Georgia', serif",
                      padding: "0.5rem 1rem",
                      fontSize: "0.9rem",
                      borderRadius: "20px"
                    }}
                  >
                    {filteredData.length} businesses found
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Cards */}
          <Row className="justify-content-center">
            <div className="col-lg-10">
              {paginated.length === 0 ? (
                <Card
                  className="border-0 shadow-sm text-center py-5"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "15px",
                    border: "1px solid rgba(212, 167, 106, 0.3)"
                  }}
                >
                  <Card.Body>
                    <div className="mb-3">
                      <i
                        className="bi bi-building"
                        style={{
                          fontSize: "3rem",
                          color: "#D4A76A",
                          opacity: "0.5"
                        }}
                      ></i>
                    </div>
                    <h5 style={{ color: "#8B4513" }}>No businesses found</h5>
                    <div className="mb-0" style={{ color: "#5D4037" }}>
                      {search || category ? "Try adjusting your search or filter" : "No businesses are currently linked to your account"}
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Row className="g-4">
                  {paginated.map((row, index) => (
                    <Col xs={12} md={6} lg={4} key={index}>
                      <Card
                        className="h-100 border-0 shadow-sm"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "15px",
                          border: "1px solid rgba(212, 167, 106, 0.3)",
                          overflow: "hidden",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease"
                        }}
                      >
                        {/* Business Logo/Image */}
                        {row.BusinessLogo ? (
                          <div
                            style={{
                              width: "100%",
                              height: "160px",
                              overflow: "hidden",
                              borderRadius: "12px",
                            }}
                          >
                            <img
                              src={`${url}/uploads/${row.BusinessLogo}`}
                              alt={row.BusinessName}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "180px",
                              background: "linear-gradient(135deg, #F5E6D3 0%, #D4A76A 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#8B4513",
                              fontWeight: "bold",
                              fontSize: "2.5rem",
                              fontFamily: "'Georgia', serif",
                              borderBottom: "2px solid #D4A76A"
                            }}
                          >
                            {row.BusinessName ? row.BusinessName[0].toUpperCase() : "F"}
                          </div>
                        )}

                        <Card.Body className="d-flex flex-column p-4">

                          <Card.Title
                            className="mb-2 m-2"
                            style={{
                              color: "#8B4513",
                              fontFamily: "'Georgia', serif",
                              fontWeight: "bold",
                              fontSize: "1.25rem"
                            }}
                          >
                            {row.BusinessName || "Unnamed Business"}
                          </Card.Title>
                          <div
                            className="mb-3"
                            style={{
                              color: "#5D4037",
                              fontFamily: "'Georgia', serif",
                            }}
                          >
                            {/* Cate  gory */}
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-tags me-2" style={{ color: "#D4A76A" }}></i>
                              <span className="fw-semibold">
                                {categories.find(c => c.categoryid === row.categoryid)?.categoryName || "Business"}
                              </span>
                            </div>

                            {/* Owner */}
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-person-circle me-2" style={{ color: "#D4A76A" }}></i>
                              <span>
                                {row.UserDatum?.FirstName || "-"} {row.UserDatum?.LastName || ""}
                              </span>
                            </div>

                            {/* Phone */}
                            <div className="d-flex align-items-center">
                              <i className="bi bi-telephone-fill me-2" style={{ color: "#D4A76A" }}></i>
                              <span>{row.UserDatum?.PhoneNumber || "-"}</span>
                            </div>
                          </div>

                          {/* Keywords */}
                          {Array.isArray(row.keywords) && row.keywords.length > 0 && (
                            <div className="mt-2">
                              <small
                                className="fw-semibold d-block mb-1"
                                style={{ color: "#8B4513" }}
                              >
                                Keywords
                              </small>

                              <div className="d-flex flex-wrap gap-2 mb-3">
                                {row.keywords.map((kw) => (
                                  <span
                                    key={kw.id}
                                    className="badge"
                                    style={{
                                      backgroundColor: "rgba(212,167,106,0.15)",
                                      color: "#5D4037",
                                      border: "1px solid rgba(212,167,106,0.4)",
                                      fontSize: "0.75rem",
                                      padding: "0.35rem 0.6rem",
                                      borderRadius: "12px",
                                      fontFamily: "'Georgia', serif",
                                    }}
                                  >
                                    {kw.keyword_name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}


                          <Button
                            onClick={() => navigate(`/BusinessDetail/${row.id}`)}
                            className="mt-auto"
                            style={{
                              backgroundColor: "#8B4513",
                              color: "white",
                              border: "none",
                              fontFamily: "'Georgia', serif",
                              fontWeight: "bold",
                              borderRadius: "8px",
                              padding: "0.75rem",
                              transition: "background-color 0.2s ease"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#6B3510"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#8B4513"}
                          >
                            <i className="bi bi-eye me-2"></i>
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Row>

          {/* Pagination */}
          {filteredData.length > rowsPerPage && (
            <div className="row justify-content-center">
              <div className="col-lg-10">

                <div className="hp-pagination">
                  <button
                    className="hp-page-btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    ‹
                  </button>
                  <span className="hp-page-info">
                    Page {page} of {Math.max(1, Math.ceil(filteredData.length / rowsPerPage))}
                  </span>
                  <button
                    className="hp-page-btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(filteredData.length / rowsPerPage)}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center mt-5 pt-4" style={{ borderTop: "1px solid #D4A76A" }}>
            <div style={{ color: "#5D4037", fontFamily: "Georgia, serif", fontSize: "0.9rem" }}>
              Discover and connect with authentic family-owned businesses
            </div>
            <div style={{ fontSize: "0.85rem", color: "#8B4513", opacity: "0.8" }}>
              Showing {Math.min(filteredData.length, page * rowsPerPage)} of {filteredData.length} businesses
            </div>
          </div>
        </Container >
      </Container >
    </>
  );
}