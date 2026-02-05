import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Box, Typography, Button
} from "@mui/material";
import {
    ArrowBack, Phone, Email
} from "@mui/icons-material";
import { getEncryptedToken } from "../utils/encryptToken";

const BusinessDetail = () => {
    const { state } = useLocation();
    const { id: paramId } = useParams();
    const id = state?.id || paramId;


    const [formData, setFormData] = useState({});
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (state && state.id) {
            setFormData({ ...state });
        } else if (id) {
            fetch(`${API_URL}/business/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                      "x-api-key": getEncryptedToken()
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data && Object.keys(data).length > 0) {
                        setFormData({ ...data });
                    } else {
                        setAlert({ open: true, message: "❌ No record found!", severity: "error" });
                    }
                })
                .catch(() => setAlert({ open: true, message: "❌ Error fetching data", severity: "error" }));
        }
    }, [state, id]);




    if (!formData || Object.keys(formData).length === 0) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                py: 6,
                px: { xs: 2, md: 4 },
                background:
                    "linear-gradient(to bottom, rgba(254, 243, 199, 0.6), #ffffff 55%)",
            }}
        >
            <Box sx={{ maxWidth: 900, mx: "auto" }}>
                {/* Back Button */}
                <Button
                    component={Link}
                    to="/familyList"
                    startIcon={<ArrowBack />}
                    sx={{ mb: 3, textTransform: "none" }}
                >
                    Back to directory
                </Button>

                <Box
                    sx={{
                        borderRadius: 4,
                        backgroundColor: "#ffffff",
                        boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
                        overflow: "hidden",
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
                    }}
                >
                    {/* Left: details */}
                    <Box sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography
                            variant="overline"
                            sx={{
                                letterSpacing: 2,
                                color: "#f97316",
                                fontWeight: 700,
                            }}
                        >
                            FAMILY BUSINESS PROFILE
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 800,
                                mt: 1,
                                mb: 1,
                            }}
                        >
                            {formData.BusinessName || formData.name || "Unnamed business"}
                        </Typography>

                        {formData.BusinessKeyword && (
                            <Typography
                                variant="body2"
                                sx={{ color: "#c05621", mb: 2, fontWeight: 500 }}
                            >
                                {formData.BusinessKeyword}
                            </Typography>
                        )}

                        {formData.BusinessDescription && (
                            <Typography
                                variant="body1"
                                sx={{ mb: 3, lineHeight: 1.6, color: "text.secondary" }}
                            >
                                {formData.BusinessDescription}
                            </Typography>
                        )}

                        {/* Contact Information */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 700, mb: 1 }}
                            >
                                Contact information
                            </Typography>

                            {formData.BusinessAddress && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Address:</strong> {formData.BusinessAddress}
                                </Typography>
                            )}


                            {formData.BusinessKeyword && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Keyword:</strong> {formData.BusinessKeyword}
                                </Typography>
                            )}
                            {formData.UserDatum?.PhoneNumber && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Phone:</strong> {formData.UserDatum.PhoneNumber}
                                </Typography>
                            )}

                            {formData.UserDatum?.Email && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Email:</strong> {formData.UserDatum.Email}
                                </Typography>
                            )}

                            {formData.UserDatum?.FirstName && (
                                <Typography variant="body2">
                                    <strong>Owner:</strong>{" "}
                                    {`${formData.UserDatum.FirstName || ""} ${formData.UserDatum.MiddleName || ""
                                        } ${formData.UserDatum.LastName || ""}`.trim()}
                                </Typography>
                            )}
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            {formData.UserDatum?.PhoneNumber && (
                                <Button
                                    variant="contained"
                                    startIcon={<Phone />}
                                    href={`tel:${formData.UserDatum.PhoneNumber}`}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 999,
                                        background:
                                            "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #facc15 100%)",
                                    }}
                                >
                                    Call
                                </Button>
                            )}

                            {formData.UserDatum?.Email && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Email />}
                                    href={`mailto:${formData.UserDatum.Email}`}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 999,
                                        borderColor: "#fed7aa",
                                        color: "#c05621",
                                        "&:hover": {
                                            borderColor: "#f97316",
                                            backgroundColor: "#fff7ed",
                                        },
                                    }}
                                >
                                    Email
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Right: image */}
                    <Box
                        sx={{
                            position: "relative",
                            backgroundColor: "#fff7ed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                        }}
                    >
                        {formData.BusinessLogo || formData.BusinessCard ? (
                            <Box
                                component="img"
                                src={`${API_URL}/uploads/${formData.BusinessCard || formData.BusinessLogo
                                    }`}
                                alt={formData.BusinessName}
                                sx={{
                                    width: "100%",
                                    maxHeight: 320,
                                    objectFit: "cover",
                                    borderRadius: 3,
                                    boxShadow: "0 12px 30px rgba(15,23,42,0.35)",
                                }}
                            />
                        ) : (
                            <Typography
                                variant="h6"
                                sx={{ color: "#c05621", textAlign: "center" }}
                            >
                                No business image available
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default BusinessDetail;