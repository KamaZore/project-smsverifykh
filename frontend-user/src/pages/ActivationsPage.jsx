import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CancelIcon from "@mui/icons-material/Cancel";
import { userApi } from "../api/user.api";
import { formatDate } from "../util/helper";

const statusMap = {
  0: { label: "Waiting", color: "warning" },
  1: { label: "SMS Sent", color: "info" },
  3: { label: "Received", color: "success" },
  6: { label: "Completed", color: "success" },
  8: { label: "Canceled", color: "error" },
};

const ActivationsPage = () => {
  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchActivations = async () => {
    setLoading(true);
    try {
      const res = await userApi.getActivations({ page: page + 1, limit: rowsPerPage });
      const data = res.data?.data || res.data?.activations || res.data;
      setActivations(Array.isArray(data) ? data : []);
    } catch {
      setActivations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivations();
  }, [page, rowsPerPage]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleCancel = async (id) => {
    try {
      await userApi.cancelActivation(id);
      fetchActivations();
    } catch {
      // handle error
    }
  };

  const filtered = activations.filter((a) => {
    const term = search.toLowerCase();
    return (
      !term ||
      (a.phone || a.number || "").toLowerCase().includes(term) ||
      (a.service || "").toLowerCase().includes(term) ||
      (a.country || "").toLowerCase().includes(term)
    );
  });

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}>
            Activations
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
            View and manage your phone number activations
          </Typography>
        </Box>
        <Button
          onClick={fetchActivations}
          startIcon={<RefreshIcon />}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            borderColor: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
            "&:hover": { borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.05)" },
          }}
        >
          Refresh
        </Button>
      </Box>

      <Card
        sx={{
          background: "rgba(30, 41, 59, 0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2, display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search by number, service, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                flex: 1,
                maxWidth: 400,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                  "&:hover fieldset": { borderColor: "rgba(99,102,241,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                },
                "& .MuiInputBase-input": { color: "#fff", fontSize: "0.875rem" },
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#6366f1" }} />
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <PhoneAndroidIcon sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.4)" }}>
                No activations found
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {["ID", "Phone Number", "Service", "Country", "Status", "Code", "Date", "Actions"].map((h) => (
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
                    {filtered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((a) => {
                        const st = statusMap[a.status] || { label: "Unknown", color: "default" };
                        const phone = a.phone || a.number || "N/A";
                        const code = a.code || a.smsCode || a.moreCodes || "—";
                        return (
                          <TableRow key={a.id || a.activationId}>
                            <TableCell sx={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.85rem" }}>
                              #{a.id || a.activationId}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 500 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {a.phoneCode && (
                                  <Chip label={a.phoneCode} size="small" sx={{ height: 22, fontSize: "0.7rem", background: "rgba(99,102,241,0.1)", color: "#818cf8" }} />
                                )}
                                {phone}
                                <Tooltip title="Copy">
                                  <IconButton size="small" onClick={() => copyToClipboard(phone)}>
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
                              {code}
                            </TableCell>
                            <TableCell sx={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.85rem" }}>
                              {a.createdAt ? formatDate(a.createdAt) : a.createDate ? formatDate(a.createDate) : "N/A"}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              {(a.status === 0 || a.status === 1) && (
                                <Tooltip title="Cancel">
                                  <IconButton size="small" onClick={() => handleCancel(a.id || a.activationId)}>
                                    <CancelIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": { color: "rgba(255,255,255,0.4)" },
                  ".MuiIconButton-root": { color: "rgba(255,255,255,0.4)" },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ActivationsPage;
