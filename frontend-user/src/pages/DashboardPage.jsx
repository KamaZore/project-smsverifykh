import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { userApi } from "../api/user.api";
import { formatDate } from "../util/helper";
import { useAuth } from "../store/AuthContext";

const statusMap = {
  0: { label: "Waiting", color: "warning" },
  1: { label: "SMS Sent", color: "info" },
  3: { label: "Received", color: "success" },
  6: { label: "Completed", color: "success" },
  8: { label: "Canceled", color: "error" },
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await userApi.getDashboard();
        setDashboard(res.data?.data || res.data);
      } catch {
        // Dashboard data not available
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  const balance = dashboard?.balance || user?.balance || "0.00";
  const activations = dashboard?.activations || dashboard?.activeActivations || [];
  const stats = dashboard?.stats || {};

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
          Welcome back, {user?.username || "User"}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 3,
          mb: 4,
        }}
      >
        {[
          {
            title: "Balance",
            value: `$${balance}`,
            icon: <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />,
            gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
          },
          {
            title: "Active Numbers",
            value: activations.length || stats.active || 0,
            icon: <PhoneAndroidIcon sx={{ fontSize: 24 }} />,
            gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          },
          {
            title: "Completed",
            value: stats.completed || stats.success || 0,
            icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
            gradient: "linear-gradient(135deg, #06b6d4, #22d3ee)",
          },
          {
            title: "Total Spent",
            value: `$${stats.totalSpent || "0.00"}`,
            icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
            gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          },
        ].map((card, i) => (
          <Card
            key={i}
            sx={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              "&:hover": { border: "1px solid rgba(99,102,241,0.15)" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: card.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          component={Link}
          to="/buy-number"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            "&:hover": { background: "linear-gradient(135deg, #5558e6, #7c4fdb)" },
          }}
        >
          Buy Number
        </Button>
        <Button
          component={Link}
          to="/activations"
          variant="outlined"
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
            "&:hover": { borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.05)" },
          }}
        >
          View History
        </Button>
      </Box>

      {/* Active Numbers */}
      <Card
        sx={{
          background: "rgba(30, 41, 59, 0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff" }}>
              Active Numbers
            </Typography>
          </Box>
          {activations.length === 0 ? (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <PhoneAndroidIcon sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.4)", mb: 2 }}>
                No active numbers
              </Typography>
              <Button
                component={Link}
                to="/buy-number"
                variant="contained"
                size="small"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              >
                Buy Your First Number
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Phone Number", "Service", "Country", "Status", "Code", "Created"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          color: "rgba(255,255,255,0.4)",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          fontWeight: 500,
                          fontSize: "0.8rem",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activations.slice(0, 5).map((a) => {
                    const st = statusMap[a.status] || { label: "Unknown", color: "default" };
                    return (
                      <TableRow key={a.id || a.activationId}>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {a.phone || a.number || "N/A"}
                            <Tooltip title="Copy">
                              <IconButton
                                size="small"
                                onClick={() => copyToClipboard(a.phone || a.number)}
                              >
                                <ContentCopyIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {a.service || "N/A"}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {a.country || "N/A"}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <Chip label={st.label} color={st.color} size="small" sx={{ fontWeight: 500 }} />
                        </TableCell>
                        <TableCell sx={{ color: "#22c55e", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {a.code || a.smsCode || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.85rem" }}>
                          {a.createdAt ? formatDate(a.createdAt) : "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DashboardPage;
