import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Divider,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import { userApi } from "../api/user.api";
import { useAuth } from "../store/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setSavingProfile(true);
    try {
      await userApi.updateProfile(profile);
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.error?.message || "Failed to update profile" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });
    setSavingPassword(true);
    try {
      await userApi.changePassword(password);
      setPasswordMsg({ type: "success", text: "Password changed successfully" });
      setPassword({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.response?.data?.error?.message || "Failed to change password" });
    } finally {
      setSavingPassword(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      background: "rgba(255,255,255,0.03)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(99,102,241,0.3)" },
      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#818cf8" },
    "& .MuiInputBase-input": { color: "#fff" },
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}>
          Profile
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
          Manage your account settings
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        {/* Profile Info */}
        <Card
          sx={{
            background: "rgba(30, 41, 59, 0.5)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                }}
              >
                {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff" }}>
                  {user?.username || "User"}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
                  {user?.email || "user@example.com"}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 3 }} />

            {profileMsg.text && (
              <Alert severity={profileMsg.type} sx={{ mb: 2, borderRadius: "10px" }}>
                {profileMsg.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleUpdateProfile}>
              <TextField
                fullWidth
                label="Username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                slotProps={{ input: { startAdornment: <PersonIcon sx={{ color: "rgba(255,255,255,0.3)", mr: 1, fontSize: 20 }} /> } }}
                sx={{ mb: 2.5, ...inputSx }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                slotProps={{ input: { startAdornment: <EmailIcon sx={{ color: "rgba(255,255,255,0.3)", mr: 1, fontSize: 20 }} /> } }}
                sx={{ mb: 3, ...inputSx }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={savingProfile}
                startIcon={<SaveIcon />}
                sx={{
                  py: 1.2,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                  "&:hover": { background: "linear-gradient(135deg, #5558e6, #7c4fdb)" },
                }}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card
          sx={{
            background: "rgba(30, 41, 59, 0.5)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 3 }}>
              Change Password
            </Typography>

            {passwordMsg.text && (
              <Alert severity={passwordMsg.type} sx={{ mb: 2, borderRadius: "10px" }}>
                {passwordMsg.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleChangePassword}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={password.oldPassword}
                onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                required
                slotProps={{ input: { startAdornment: <LockIcon sx={{ color: "rgba(255,255,255,0.3)", mr: 1, fontSize: 20 }} /> } }}
                sx={{ mb: 2.5, ...inputSx }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={password.newPassword}
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                required
                slotProps={{ input: { startAdornment: <LockIcon sx={{ color: "rgba(255,255,255,0.3)", mr: 1, fontSize: 20 }} /> } }}
                sx={{ mb: 3, ...inputSx }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={savingPassword}
                startIcon={<SaveIcon />}
                sx={{
                  py: 1.2,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                  boxShadow: "0 4px 14px rgba(139,92,246,0.3)",
                  "&:hover": { background: "linear-gradient(135deg, #7c4fdb, #9775f0)" },
                }}
              >
                {savingPassword ? "Changing..." : "Change Password"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfilePage;
