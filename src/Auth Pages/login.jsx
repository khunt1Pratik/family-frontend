import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
} from "@mui/material";

import SHA256 from "crypto-js/sha256";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {getEncryptedToken} from "../utils/encryptToken";


const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isExpired, setIsExpired] = useState(false);

  
  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const expiry = decoded.exp * 1000;

    const timeout = setTimeout(() => {
      setIsExpired(true);
      localStorage.removeItem("token");
      alert("Token expired! Please login again.");
    }, expiry - Date.now());

    return () => clearTimeout(timeout);
  }, [token]);

  const [PhoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!PhoneNumber || !password) {
      setSeverity("error");
      setMessage("Phone number and password are required");
      return;
    }
    const hashedPassword = SHA256(password).toString();
    try {
      const res = await fetch(API_URL + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": getEncryptedToken()
        },
        body: JSON.stringify({
          PhoneNumber: PhoneNumber,
          password: hashedPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSeverity("error");
        setMessage(data.message || "Login failed");
        return;
      }

      // ✅ Save auth data
      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAdmin", data.user.isAdmin);
      setIsExpired(false);

      setSeverity("success");
      setMessage("Login successful");

      setTimeout(() => {
        if (data.user.isAdmin === true) {
          navigate("/adminBusinessList", { replace: true });
        } else {
          navigate("/FamilyList", { replace: true });
        }
      }, 800);


    } catch (err) {
      console.error(err);
      setSeverity("error");
      setMessage("Server not responding");
    }
  };


  const handleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    const res = await fetch(API_URL + "/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" ,  "x-api-key": getEncryptedToken()},
      body: JSON.stringify({
        Email: decoded.email,
        FirstName: decoded.given_name,
        LastName: decoded.family_name,
        google_id: decoded.sub
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/");
  };


  const handleError = () => {
    console.log("Google Login Failed");
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "radial-gradient(circle at top left, #fff7ed 0, #fef3c7 30%, #ffffff 80%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 18px 40px rgba(15,23,42,0.15)",
          borderRadius: 3,
          backgroundColor: "#ffffff",
          border: "1px solid #fee2c5",
        }}
      >
        <CardContent>
          {/* Icon */}
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <span style={{ fontSize: 36 }}>🏠</span>
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 0.5,
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
              color: "#111827",
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Enter your phone number and password to sign in to your family
            business account.
          </Typography>

          {message && (
            <Alert severity={severity} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={PhoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 999,
                  backgroundColor: "#f9fafb",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
                mb: 0.5,
              }}
            >
            </Box>

            <TextField
              placeholder="••••••••"
              type="password"
              fullWidth
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: {
                  mt: 0.5,
                  borderRadius: 999,
                  backgroundColor: "#f9fafb",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1,
                borderRadius: 999,
                background:
                  "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #facc15 100%)",
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #ea580c 0%, #f97316 45%, #facc15 100%)",
                },
              }}
            >
              Login
            </Button>
          </form>
          <div className="mt-3">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{" "}
              <Link to="/register" style={{ color: "#f97316", fontWeight: 500 }}>
                Register
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}



