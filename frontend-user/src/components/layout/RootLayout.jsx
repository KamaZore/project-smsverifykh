import { Outlet, Navigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useAuth } from "../../store/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const RootLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
        }}
      >
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f172a" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default RootLayout;
