import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Checkbox, Form, Input } from "antd";
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { adminLogin } from "../api/auth.api";
import { setAccessToken, setAdmin } from "../store/token_access";

/**
 * Admin login screen (antd Form/Inputs + MUI Paper/Button + Tailwind utilities).
 * On success the admin token + profile are stored and the user is
 * redirected to the dashboard.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    setError("");
    try {
      const { admin, token } = await adminLogin(values.username.trim(), values.password);
      setAccessToken(token);
      setAdmin(admin);
      message.success(`Welcome back, ${admin.username}!`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="app-shell"
      style={{ background: "linear-gradient(135deg, #312e81 0%, #4f46e5 45%, #0284c7 100%)" }}
    >
      <div className="flex-1 flex items-center justify-center p-4">
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.45)",
          }}
        >
          <Box className="p-8 sm:p-10">
            {/* Brand */}
            <div className="flex flex-col items-center mb-8">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 26,
                  mb: 2,
                  background: "linear-gradient(135deg, #6366f1, #0284c7)",
                  boxShadow: "0 10px 24px -8px rgba(79, 70, 229, 0.55)",
                }}
              >
                <SafetyCertificateOutlined />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                SMSVerifyKh
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                Sign in to the admin panel
              </Typography>
            </div>

            {error && (
              <Alert severity="error" variant="filled" sx={{ mb: 2.5 }}>
                {error}
              </Alert>
            )}

            <Form name="admin-login" layout="vertical" size="large" onFinish={onFinish} autoComplete="off">
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Please enter the username" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                  placeholder="Username"
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter the password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex items-center justify-between">
                  <Checkbox defaultChecked>Remember me</Checkbox>
                  <Typography
                    variant="body2"
                    sx={{ color: "#4f46e5", fontWeight: 600, cursor: "pointer" }}
                  >
                    Forgot password?
                  </Typography>
                </div>
              </Form.Item>

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{
                  mt: 0.5,
                  py: 1.3,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 15,
                  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                  boxShadow: "0 8px 20px -6px rgba(79, 70, 229, 0.55)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #4338ca, #4f46e5)",
                    boxShadow: "0 10px 24px -6px rgba(79, 70, 229, 0.65)",
                  },
                }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </Form>

            <div className="mt-6 text-center text-xs text-slate-400">
              SMSVerifyKh Admin · © 2026
            </div>
          </Box>
        </Paper>
      </div>
    </div>
  );
}
