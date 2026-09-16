import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useAuth } from "../../store/AuthContext";

const navLinks = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Buy Number", path: "/buy-number", icon: <PhoneAndroidIcon /> },
  { label: "Activations", path: "/activations", icon: <HistoryIcon /> },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1280,
            mx: "auto",
            width: "100%",
            px: { xs: 2, md: 3 },
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Link to="/" className="w-30 h-auto">
            <img
              src="/assets/images/logo_smsverifykh.png"
              alt="Logo"
              className={`h-auto transition-all w-full`}
            />
          </Link>
          {!isMobile && user && (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    color: isActive(link.path)
                      ? "#fff"
                      : "rgba(255,255,255,0.6)",
                    background: isActive(link.path)
                      ? "rgba(99,102,241,0.15)"
                      : "transparent",
                    borderRadius: "10px",
                    px: 2,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    "&:hover": {
                      background: "rgba(99,102,241,0.1)",
                      color: "#fff",
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {user ? (
            <>
              <Chip
                icon={<AccountBalanceWalletIcon sx={{ fontSize: 16 }} />}
                label={`$${user.balance || "0.00"}`}
                size="small"
                sx={{
                  mr: 2,
                  background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  fontWeight: 600,
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: { xs: "none", sm: "flex" },
                }}
              />
              <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.main",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  }}
                >
                  {user.username?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(30, 41, 59, 0.95)",
                    backdropFilter: "blur(20px)",
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                    {user.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/profile");
                  }}
                  sx={{ gap: 1.5, py: 1.5 }}
                >
                  <PersonIcon
                    sx={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}
                  />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{ gap: 1.5, py: 1.5, color: "#ef4444" }}
                >
                  <LogoutIcon sx={{ fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: "10px",
                  "&:hover": {
                    color: "#fff",
                    background: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5558e6, #7c4fdb)",
                    boxShadow: "0 6px 20px rgba(99,102,241,0.5)",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            background: "rgba(15, 23, 42, 0.98)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PhoneAndroidIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#fff" }}
            >
              SMSVerify<span style={{ color: "#8b5cf6" }}>KH</span>
            </Typography>
          </Box>

          {user && (
            <List>
              {navLinks.map((link) => (
                <ListItem
                  key={link.path}
                  component={Link}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: "10px",
                    mb: 0.5,
                    background: isActive(link.path)
                      ? "rgba(99,102,241,0.15)"
                      : "transparent",
                    color: isActive(link.path)
                      ? "#fff"
                      : "rgba(255,255,255,0.6)",
                    "&:hover": { background: "rgba(99,102,241,0.1)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
              <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.06)" }} />
              <ListItem
                component={Link}
                to="/profile"
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: "10px",
                  mb: 0.5,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: "10px",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
