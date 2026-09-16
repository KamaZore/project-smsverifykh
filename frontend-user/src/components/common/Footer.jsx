import { Box, Typography, Container, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Buy Number", path: "/buy-number" },
      { label: "Pricing", path: "/#pricing" },
      { label: "API Docs", path: "/#" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Activations", path: "/activations" },
      { label: "Profile", path: "/profile" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", path: "/#" },
      { label: "Terms of Service", path: "/#" },
      { label: "Privacy Policy", path: "/#" },
    ],
  },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "rgba(15, 23, 42, 0.95)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" },
            gap: 6,
            mb: 8,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Link to="/" className="w-45 h-auto">
                <img
                  src="/assets/images/logo_smsverifykh.png"
                  alt="Logo"
                  className={`h-auto transition-all w-full`}
                />
              </Link>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.4)",
                maxWidth: 280,
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              Temporary phone numbers for SMS verification. Fast, reliable, and
              affordable verification for 1000+ services worldwide.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  "&:hover": { color: "#8b5cf6" },
                }}
              >
                <TelegramIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  "&:hover": { color: "#8b5cf6" },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {footerLinks.map((group) => (
            <Box key={group.title}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {group.title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {group.links.map((link) => (
                  <Typography
                    key={link.label}
                    component={Link}
                    to={link.path}
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      textDecoration: "none",
                      "&:hover": { color: "#8b5cf6" },
                      transition: "color 0.2s",
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            pt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
            &copy; {new Date().getFullYear()} SMSVerifyKH. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
            Powered by HeroSMS API
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
