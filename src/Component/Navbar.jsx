import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Paper,
  ClickAwayListener,
  Collapse,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const admin = user?.isAdmin === true;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Businesses", path: admin ? "/AdminBusinessList" : "/familyList" },
  ];

  if (userId && !admin) {
    navLinks.push({ label: "Edit Businesses", path: `/editbusiness/${userId}` });
  }
  if (admin) {
    navLinks.push({ label: "Users", path: "/userList" });
  }
  if (admin) {
    navLinks.push({ label: "Categories", path: "/CategoryPage" })
  }
  if (admin) {
    navLinks.push({ label: "Keyword", path: "/keyword" })
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#fffbf2", // Warm beige background
        color: "#5D4037", // Dark brown text
        borderBottom: "2px solid #D4A76A", // Gold border
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          mx: "auto",
          width: "100%",
          py: 1,
        }}
      >
        {/* Family Logo & Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src="/taraviya-logo.jpg"
            alt="Taraviya Logo"
            style={{
              height: 50,
              borderRadius: "4px",
              // border: "1px solid #D4A76A" 
            }}
          />
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              fontFamily: "'Playfair Display', serif",
              color: "#8B4513", // Saddle brown
              textDecoration: "none",
            }}
          >
            FamilyBiz
          </Typography>
        </Box>

        {/* Desktop nav links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {navLinks.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={path}
                component={Link}
                to={path}
                sx={{
                  color: isActive ? "#8B4513" : "#5D4037",
                  textTransform: "none",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "1rem",
                  fontFamily: "'Georgia', serif",
                  position: "relative",
                  px: 1,
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#8B4513"
                  },
                }}
              >
                {label}
                {isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: -4,
                      height: 3,
                      borderRadius: 999,
                      backgroundColor: "#D4A76A", // Gold underline
                    }}
                  />
                )}
              </Button>
            );
          })}
        </Box>

        {/* Auth / Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {!userId ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#5D4037",
                    textTransform: "none",
                    fontWeight: 600,
                    fontFamily: "'Georgia', serif",
                    "&:hover": { color: "#8B4513", backgroundColor: "transparent" }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "20px",
                    px: 3,
                    fontFamily: "'Georgia', serif",
                    backgroundColor: "#D4A76A", // Gold background
                    color: "#fff",
                    boxShadow: "0 2px 4px rgba(212, 167, 106, 0.3)",
                    "&:hover": { backgroundColor: "#c59b60" },
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <ClickAwayListener onClickAway={() => setIsProfileMenuOpen(false)}>
                <Box sx={{ position: "relative" }}>
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "2px solid #D4A76A",
                      backgroundColor: "#fff",
                      color: "#8B4513",
                      "&:hover": { backgroundColor: "#F5E6D3" },
                    }}
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  >
                    <PersonIcon />
                  </IconButton>

                  {isProfileMenuOpen && (
                    <Paper
                      sx={{
                        position: "absolute",
                        top: 50,
                        right: 0,
                        minWidth: 160,
                        borderRadius: "8px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        border: "1px solid #D4A76A",
                        backgroundColor: "#fffbf2",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        zIndex: 10,
                      }}
                    >
                      {!admin && (
                        <Button
                          component={Link}
                          to={`/editfamily/${userId}`}
                          onClick={() => setIsProfileMenuOpen(false)}
                          sx={{
                            textTransform: "none",
                            color: "#5D4037",
                            fontFamily: "'Georgia', serif",
                            justifyContent: "flex-start",
                            px: 2,
                            "&:hover": { backgroundColor: "#F5E6D3", color: "#8B4513" }
                          }}
                        >
                          Edit Profile
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                        sx={{
                          textTransform: "none",
                          color: "#5D4037",
                          fontFamily: "'Georgia', serif",
                          justifyContent: "flex-start",
                          px: 2,
                          "&:hover": { backgroundColor: "#F5E6D3", color: "#8B4513" }
                        }}
                      >
                        Logout
                      </Button>
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>
            )}
          </Box>

          {/* Mobile menu toggle */}
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#8B4513"
            }}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile navigation */}
      <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            px: 2,
            pb: 2,
            gap: 1,
            borderTop: "1px solid #F5E6D3",
            backgroundColor: "#fffbf2"
          }}
        >
          {navLinks.map(({ label, path }) => (
            <Button
              key={path}
              component={Link}
              to={path}
              onClick={() => setIsMenuOpen(false)}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontFamily: "'Georgia', serif",
                color: location.pathname === path ? "#8B4513" : "#5D4037",
                fontWeight: location.pathname === path ? 700 : 500,
                "&:hover": { backgroundColor: "#F5E6D3" }
              }}
            >
              {label}
            </Button>
          ))}

          {userId ? (
            <>
              <Box sx={{ my: 1, borderTop: "1px dashed #D4A76A" }} />
              {!admin && (
                <Button
                  component={Link}
                  to={`/editfamily/${userId}`}
                  onClick={() => setIsMenuOpen(false)}
                  sx={{
                    textTransform: "none",
                    justifyContent: "flex-start",
                    color: "#5D4037",
                    fontFamily: "'Georgia', serif",
                    "&:hover": { backgroundColor: "#F5E6D3" }
                  }}
                >
                  Edit Profile
                </Button>
              )}
              <Button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                sx={{
                  textTransform: "none",
                  justifyContent: "flex-start",
                  color: "#5D4037",
                  fontFamily: "'Georgia', serif",
                  "&:hover": { backgroundColor: "#F5E6D3" }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Box sx={{ my: 1, borderTop: "1px dashed #D4A76A" }} />
              <Button
                component={Link}
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                sx={{
                  textTransform: "none",
                  justifyContent: "flex-start",
                  color: "#5D4037",
                  fontFamily: "'Georgia', serif",
                  "&:hover": { backgroundColor: "#F5E6D3" }
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                sx={{
                  textTransform: "none",
                  justifyContent: "flex-start",
                  color: "#fff",
                  backgroundColor: "#D4A76A",
                  fontFamily: "'Georgia', serif",
                  mt: 1,
                  "&:hover": { backgroundColor: "#c59b60" }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Collapse>
    </AppBar>
  );
}
