import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import PaymentsIcon from "@mui/icons-material/Payments";
import PublicIcon from "@mui/icons-material/Public";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuth } from "../store/AuthContext";

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 28 }} />,
    title: "Instant Activation",
    description: "Get a phone number within seconds. Our automated system delivers numbers instantly.",
    gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 28 }} />,
    title: "Private & Secure",
    description: "Your data is encrypted and protected. We never share your personal information.",
    gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  },
  {
    icon: <PaymentsIcon sx={{ fontSize: 28 }} />,
    title: "Pay Per Use",
    description: "Only pay for what you use. No subscriptions, no hidden fees.",
    gradient: "linear-gradient(135deg, #06b6d4, #22d3ee)",
  },
  {
    icon: <PublicIcon sx={{ fontSize: 28 }} />,
    title: "1000+ Services",
    description: "Support for Telegram, WhatsApp, Google, and hundreds more platforms.",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
    title: "Global Coverage",
    description: "Numbers from 180+ countries. Find the perfect number for your needs.",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
  },
  {
    icon: <PhoneAndroidIcon sx={{ fontSize: 28 }} />,
    title: "Easy API",
    description: "Simple REST API integration. Compatible with SMS-Activate format.",
    gradient: "linear-gradient(135deg, #ef4444, #f87171)",
  },
];

const stats = [
  { value: "1M+", label: "Numbers Delivered" },
  { value: "50K+", label: "Active Users" },
  { value: "180+", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

const steps = [
  { step: "01", title: "Create Account", description: "Sign up in seconds with your email address." },
  { step: "02", title: "Add Funds", description: "Top up your wallet with any payment method." },
  { step: "03", title: "Buy Number", description: "Select service & country, get a number instantly." },
  { step: "04", title: "Receive SMS", description: "Verification code appears in your dashboard." },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ background: "#0f172a" }}>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 10, md: 16 },
          pb: { xs: 12, md: 20 },
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <Chip
            label="Trusted by 50,000+ users worldwide"
            size="small"
            sx={{
              mb: 3,
              background: "rgba(99,102,241,0.1)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.2)",
              fontWeight: 500,
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "4rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#fff",
              mb: 3,
            }}
          >
            Temporary Phone Numbers
            <Box
              component="span"
              sx={{
                display: "block",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for SMS Verification
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.5)",
              maxWidth: 560,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.7,
              mb: 5,
              fontSize: { xs: "1rem", md: "1.15rem" },
            }}
          >
            Rent virtual numbers for instant SMS verification on any platform.
            Fast, affordable, and available in 180+ countries.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              to={user ? "/buy-number" : "/register"}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5558e6, #7c4fdb)",
                  boxShadow: "0 12px 32px rgba(99,102,241,0.5)",
                },
              }}
            >
              {user ? "Buy a Number" : "Get Started Free"}
            </Button>
            <Button
              component={Link}
              to="/#features"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                borderColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.03)",
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ py: 6, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 4,
            }}
          >
            {stats.map((stat) => (
              <Box key={stat.label} sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              label="Features"
              size="small"
              sx={{
                mb: 2,
                background: "rgba(99,102,241,0.1)",
                color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                color: "#fff",
                mb: 2,
              }}
            >
              Everything you need
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", maxWidth: 480, mx: "auto" }}>
              A complete solution for SMS verification with enterprise-grade reliability.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {features.map((f, i) => (
              <Card
                key={i}
                sx={{
                  background: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "1px solid rgba(99,102,241,0.2)",
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      background: f.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2.5,
                      color: "#fff",
                    }}
                  >
                    {f.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                    {f.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: "rgba(15, 23, 42, 0.5)" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              label="How It Works"
              size="small"
              sx={{
                mb: 2,
                background: "rgba(139,92,246,0.1)",
                color: "#a78bfa",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: "1.8rem", md: "2.5rem" }, color: "#fff" }}>
              Up and running in 4 steps
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
              gap: 3,
            }}
          >
            {steps.map((s, i) => (
              <Box
                key={i}
                sx={{
                  p: 4,
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(30, 41, 59, 0.3)",
                  position: "relative",
                  "&:hover": {
                    border: "1px solid rgba(99,102,241,0.15)",
                  },
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: "3rem",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                  }}
                >
                  {s.step}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 1 }}>
                  {s.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                  {s.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Pricing */}
      <Box id="pricing" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              label="Pricing"
              size="small"
              sx={{
                mb: 2,
                background: "rgba(16,185,129,0.1)",
                color: "#34d399",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: "1.8rem", md: "2.5rem" }, color: "#fff", mb: 2 }}>
              Simple, transparent pricing
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)" }}>
              Pay only for the numbers you rent. No hidden fees.
            </Typography>
          </Box>

          <Card
            sx={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
              },
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>
                    SMS Verification
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mt: 0.5 }}>
                    Per number activation
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#fff" }}>
                  From <Box component="span" sx={{ color: "#8b5cf6" }}>$0.02</Box>
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  "Access to 1000+ services",
                  "Numbers from 180+ countries",
                  "Instant SMS delivery",
                  "API access included",
                  "No subscription required",
                  "24/7 support",
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: "#22c55e" }} />
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                component={Link}
                to={user ? "/buy-number" : "/register"}
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5558e6, #7c4fdb)",
                  },
                }}
              >
                {user ? "Buy a Number Now" : "Create Free Account"}
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: "center",
              p: { xs: 6, md: 10 },
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
              border: "1px solid rgba(99,102,241,0.15)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-50%",
                right: "-20%",
                width: 400,
                height: 400,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "#fff", mb: 2, position: "relative" }}
            >
              Ready to get started?
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,0.5)", mb: 4, position: "relative" }}
            >
              Join thousands of users who trust SMSVerifyKH for their verification needs.
            </Typography>
            <Button
              component={Link}
              to={user ? "/buy-number" : "/register"}
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                position: "relative",
                "&:hover": {
                  background: "linear-gradient(135deg, #5558e6, #7c4fdb)",
                },
              }}
            >
              {user ? "Go to Dashboard" : "Get Started Now"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
