import { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { getEncryptedToken } from "../utils/encryptToken"

const PopularSearch = () => {
    const [business, setBusiness] = useState([]);
    const [loading, setLoading] = useState(true);

    const url = import.meta.env.VITE_API_URL;

    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY
    const STATIC_TOKEN = import.meta.env.VITE_STATIC_TOKEN;

    const encryptedToken = CryptoJS.AES.encrypt(STATIC_TOKEN, SECRET_KEY).toString();
const fetchBusiness = async () => {
    try {
        setLoading(true);

        const res = await fetch(`${url}/popularsearches/popular`, {
            method: "GET",
            headers: {
                "x-api-key": getEncryptedToken(),
                "Content-Type": "application/json"
            }
        });

        // handle HTTP errors
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        setBusiness(data.data || []);
    } catch (error) {
        console.log(error);
        setBusiness([]);
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        fetchBusiness();
    }, []);

    return (
        <div
            className="container-fluid py-4"
            style={{
                minHeight: "100vh",
                fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div
                            className="card border-0 p-4"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderRadius: "15px",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <h3 className="mb-4 text-center">🔥 Popular Businesses</h3>

                            {loading && <p className="text-center">Loading...</p>}

                            {!loading && business.length === 0 && (
                                <p className="text-center text-muted">
                                    No popular businesses found
                                </p>
                            )}

                            <div className="row g-4">
                                {business.map((row, index) => (
                                    <div className="col-sm-6 col-md-4" key={index}>
                                        <div
                                            className="card h-100 border-0"
                                            style={{
                                                borderRadius: 16,
                                                boxShadow: "0 6px 18px rgba(15,23,42,.15)",
                                            }}
                                        >
                                            {/* Image */}
                                            {row.business.BusinessLogo ? (
                                                <img
                                                    src={`${url}/uploads/${row.business.BusinessLogo}`}
                                                    className="card-img-top"
                                                    alt={row.BusinessName}
                                                    style={{ height: 160, objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div
                                                    className="d-flex align-items-center justify-content-center text-white fw-bold"
                                                    style={{
                                                        height: 160,
                                                        background:
                                                            "linear-gradient(135deg,#fb923c,#f97316)",
                                                        fontSize: 32,
                                                    }}
                                                >
                                                    {row.BusinessName?.[0] || "B"}
                                                </div>
                                            )}

                                            {/* Body */}
                                            <div className="card-body">
                                                <h5 className="card-title">{row.business.BusinessName}</h5>
                                                <p className="text-muted small">
                                                    {row.business.BusinessAddress || "Address not available"}
                                                </p>
                                                {Array.isArray(row.keywords) && row.keywords.length > 0 && (
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
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-4 pt-3">
                                <small className="text-muted">
                                    Updated in real-time • Showing top {business.length} results
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularSearch;
