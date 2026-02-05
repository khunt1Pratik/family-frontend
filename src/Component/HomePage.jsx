import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { generateTransliterations } from "../utils/gujaratiTransliterate";
import { Search, Grid3x3Gap } from "react-bootstrap-icons";
import PopularSearch from "./PopularBusiness";
import "./HomePage.css";
import CryptoJS from "crypto-js";
import {getEncryptedToken} from "../utils/encryptToken"

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const rowsPerPage = 3;

  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    fetch(API_URL + "/business", {
      headers: {
        "x-api-key": getEncryptedToken()
      }
    })
      .then(res => res.json())
      .then(res => {
        setData(res);
        setFilteredData(res);
      });

    fetch(API_URL + "/categories", {
       credentials: "include",
      headers: {
        "x-api-key": getEncryptedToken()
      },
    })
      .then(res => res.json())
      .then(res => setCategories(res));
  }, []);

  const handleSearchClick = async () => {
    if (search.trim() === "") {
      setFilteredData(data);
      setPage(1);
      return;
    }

    setAppliedSearch(search);
    setPage(1);

    if (search.trim().length < 5) return;

    try {
      await fetch(API_URL + "/popularsearches", {
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

  useEffect(() => {
    applyFilters();
  }, [data, appliedSearch, selectedCategory]);

  const applyFilters = () => {
    let result = [...data];

    if (appliedSearch.trim()) {
      const searchVariants = generateTransliterations(
        appliedSearch.toLowerCase()
      );

      result = result.filter(item =>
        searchVariants.some(variant => {
          if (
            item.Name &&
            item.Name.toLowerCase().includes(variant)
          ) return true;

          if (
            item.BusinessName &&
            item.BusinessName.toLowerCase().includes(variant)
          ) return true;

          if (Array.isArray(item.keywords)) {
            return item.keywords.some(k =>
              k.keyword_name &&
              k.keyword_name.toLowerCase().includes(variant)
            );
          }

          return false;
        })
      );
    }


    if (selectedCategory) {
      result = result.filter(item => item.categoryid === Number(selectedCategory));
    }

    setFilteredData(result);
    setPage(1);
  };


  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
  };

  const paginated = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="hp-container">
      {/* Hero Section */}
      <div className="hp-hero">
        <span className="hp-badge">
          🌟 Discover Local Family Businesses
        </span>

        <h1 className="hp-title">
          Generations of Trust <br />
          <span className="hp-title-highlight">Quality & Service</span>
        </h1>

        <p className="hp-subtitle">
          Connect with authentic family-owned businesses in your community.
          Support local, shop with confidence.
        </p>

        {/* Search & Categories Box */}
        <div className="hp-search-card">
          <div className="hp-search-wrapper">
            <div className="hp-search-input-group">
              <span className="hp-search-icon">
                <Search />
              </span>
              <input
                type="text"
                className="hp-search-input"
                placeholder="Search businesses (e.g., 'Bakery', 'Shah')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              />
            </div>
            <button onClick={handleSearchClick} className="hp-search-btn">
              Search
            </button>
          </div>

          <div className="hp-category-section mt-2">
            <span className="hp-category-label">Browse Categories</span>
            <div className="hp-category-list mt-3">
              <button
                className={`hp-cat-btn ${selectedCategory === "" ? "active" : ""}`}
                onClick={() => setSelectedCategory("")}
              >
                <Grid3x3Gap /> All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.categoryid}
                  className={`hp-cat-btn ${selectedCategory === String(cat.categoryid) ? "active" : ""}`}
                  onClick={() => handleCategoryClick(String(cat.categoryid))}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="hp-grid-container">
        <div className="hp-results-header">
          <span>Showing {paginated.length} of {filteredData.length} businesses</span>
          <span>Verified listings</span>
        </div>

        {filteredData.length === 0 ? (
          <div className="hp-empty-state">
            <h5 className="hp-empty-title">No businesses found</h5>
            <p className="text-muted">
              Try another search or{" "}
              <Link to="/register" className="hp-link">
                add your business
              </Link>
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {paginated.map((row, i) => (
              <div className="col-sm-6 col-md-4" key={i}>
                <div className="hp-card">
                  <div className="hp-card-img-wrapper">
                    {row.BusinessLogo ? (
                      <img
                        src={`${API_URL}/uploads/${row.BusinessLogo}`}
                        className="hp-card-img"
                        alt={row.BusinessName}
                      />
                    ) : (
                      <div className="hp-card-placeholder">
                        {row.BusinessName?.[0] || "FB"}
                      </div>
                    )}
                  </div>

                  <div className="hp-card-body">
                    <h6 className="hp-card-title">{row.BusinessName}</h6>
                    <p className="hp-card-owner">
                      by {row.UserDatum ? `${row.UserDatum.FirstName || ""} ${row.UserDatum.LastName || ""}` : "Unknown"}
                    </p>
                    <p className="hp-card-address">
                      {row.BusinessAddress || "Address not available"}
                    </p>
                    {/* {Array.isArray(row.keywords) && row.keywords.length > 0 && (
                      <div className="mt-2">
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
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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

      <div className="hp-popular-section">
        <div className="container">
          <div className="py-4">
            <PopularSearch />
          </div>
        </div>
      </div>
    </div >
  );
}
