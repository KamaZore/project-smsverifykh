import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  ConfigProvider,
  Card,
  Select,
  Button,
  Alert,
  Spin,
  Tag,
  Typography,
  Input,
  theme,
} from "antd";
import {
  MobileOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  WalletOutlined,
  GlobalOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { servicesApi } from "../api/services.api";
import { userApi } from "../api/user.api";
import { useAuth } from "../store/AuthContext";

const { Title, Text } = Typography;

const countryFlags = {
  1: "\u{1F1FA}\u{1F1E6}",
  2: "\u{1F1F0}\u{1F1FF}",
  3: "\u{1F1E8}\u{1F1FA}",
  4: "\u{1F1E7}\u{1F1F7}",
  5: "\u{1F1E8}\u{1F1ED}",
  6: "\u{1F1E9}\u{1F1EA}",
  7: "\u{1F1EA}\u{1F1F8}",
  8: "\u{1F1EB}\u{1F1F7}",
  9: "\u{1F1E9}\u{1F1F0}",
  10: "\u{1F1EC}\u{1F1E7}",
  11: "\u{1F1EE}\u{1F1F8}",
  12: "\u{1F1E7}\u{1F1FE}",
  13: "\u{1F1EC}\u{1F1E9}",
  14: "\u{1F1E8}\u{1F1F3}",
  15: "\u{1F1E8}\u{1F1FF}",
  16: "\u{1F1E7}\u{1F1F6}",
  17: "\u{1F1EA}\u{1F1FA}",
  18: "\u{1F1EE}\u{1F1F1}",
  19: "\u{1F1F1}\u{1F1E7}",
  20: "\u{1F1EC}\u{1F1F1}",
  21: "\u{1F1F2}\u{1F1FE}",
  22: "\u{1F1F3}\u{1F1F1}",
  23: "\u{1F1F3}\u{1F1F7}",
  24: "\u{1F1F5}\u{1F1F1}",
  25: "\u{1F1F5}\u{1F1E6}",
  26: "\u{1F1F7}\u{1F1FA}",
  27: "\u{1F1F8}\u{1F1E6}",
  28: "\u{1F1F8}\u{1F1EC}",
  29: "\u{1F1F8}\u{1F1FE}",
  30: "\u{1F1F9}\u{1F1EC}",
  31: "\u{1F1F9}\u{1F1ED}",
  32: "\u{1F1F9}\u{1F1F7}",
  33: "\u{1F1FA}\u{1F1E8}",
  34: "\u{1F1E6}\u{1F1FA}",
  35: "\u{1F1E6}\u{1F1F7}",
  36: "\u{1F1E6}\u{1F1F1}",
  37: "\u{1F1E6}\u{1F1F6}",
  38: "\u{1F1E6}\u{1F1ED}",
  39: "\u{1F1E6}\u{1F1F0}",
  40: "\u{1F1E6}\u{1F1E9}",
  41: "\u{1F1E6}\u{1F1F8}",
  42: "\u{1F1E6}\u{1F1F2}",
  43: "\u{1F1E6}\u{1F1EA}",
  44: "\u{1F1E6}\u{1F1EC}",
  45: "\u{1F1E6}\u{1F1E7}",
  46: "\u{1F1E6}\u{1F1F4}",
  47: "\u{1F1E6}\u{1F1F9}",
  48: "\u{1F1E7}\u{1F1F2}",
  49: "\u{1F1E7}\u{1F1EB}",
  50: "\u{1F1E7}\u{1F1EF}",
  51: "\u{1F1E7}\u{1F1F2}",
  52: "\u{1F1E7}\u{1F1F9}",
  53: "\u{1F1E7}\u{1F1F4}",
  54: "\u{1F1E7}\u{1F1F1}",
  55: "\u{1F1E7}\u{1F1FC}",
  56: "\u{1F1E7}\u{1F1F8}",
  57: "\u{1F1E7}\u{1F1F3}",
  58: "\u{1F1E7}\u{1F1F7}",
  59: "\u{1F1E7}\u{1F1ED}",
  60: "\u{1F1E7}\u{1F1F6}",
  61: "\u{1F1E7}\u{1F1FB}",
  62: "\u{1F1E7}\u{1F1EE}",
  63: "\u{1F1E8}\u{1F1F1}",
  64: "\u{1F1E8}\u{1F1F2}",
  65: "\u{1F1E8}\u{1F1F4}",
  66: "\u{1F1E8}\u{1F1F8}",
  67: "\u{1F1E8}\u{1F1ED}",
  68: "\u{1F1E8}\u{1F1E9}",
  69: "\u{1F1E8}\u{1F1F0}",
  70: "\u{1F1E8}\u{1F1F7}",
  71: "\u{1F1E8}\u{1F1F2}",
  72: "\u{1F1E8}\u{1F1E6}",
  73: "\u{1F1E8}\u{1F1F3}",
  74: "\u{1F1E8}\u{1F1EB}",
  75: "\u{1F1E8}\u{1F1ED}",
  76: "\u{1F1E8}\u{1F1EA}",
  77: "\u{1F1E8}\u{1F1EE}",
  78: "\u{1F1E8}\u{1F1F9}",
  79: "\u{1F1E8}\u{1F1EC}",
  80: "\u{1F1E8}\u{1F1FB}",
  81: "\u{1F1E8}\u{1F1FE}",
  82: "\u{1F1E8}\u{1F1FC}",
  83: "\u{1F1E9}\u{1F1F2}",
  84: "\u{1F1E9}\u{1F1F4}",
  85: "\u{1F1E9}\u{1F1EF}",
  86: "\u{1F1E9}\u{1F1F1}",
  87: "\u{1F1E9}\u{1F1F8}",
  88: "\u{1F1E9}\u{1F1EC}",
  89: "\u{1F1E9}\u{1F1F2}",
  90: "\u{1F1E9}\u{1F1EF}",
  91: "\u{1F1E9}\u{1F1F7}",
  92: "\u{1F1EA}\u{1F1F8}",
  93: "\u{1F1EA}\u{1F1EC}",
  94: "\u{1F1EA}\u{1F1F7}",
  95: "\u{1F1EA}\u{1F1F1}",
  96: "\u{1F1EA}\u{1F1ED}",
  97: "\u{1F1EA}\u{1F1F6}",
  98: "\u{1F1EA}\u{1F1F2}",
  99: "\u{1F1EA}\u{1F1F4}",
  100: "\u{1F1EA}\u{1F1F9}",
  101: "\u{1F1EA}\u{1F1FA}",
  102: "\u{1F1EA}\u{1F1F0}",
  103: "\u{1F1EA}\u{1F1EA}",
  104: "\u{1F1EA}\u{1F1F3}",
  105: "\u{1F1EA}\u{1F1F5}",
  106: "\u{1F1EA}\u{1F1FB}",
  107: "\u{1F1EA}\u{1F1F1}",
  108: "\u{1F1EA}\u{1F1F7}",
  109: "\u{1F1EB}\u{1F1EE}",
  110: "\u{1F1EB}\u{1F1EF}",
  111: "\u{1F1EB}\u{1F1F2}",
  112: "\u{1F1EB}\u{1F1F4}",
  113: "\u{1F1EB}\u{1F1EA}",
  114: "\u{1F1EB}\u{1F1F7}",
  115: "\u{1F1EB}\u{1F1F9}",
  116: "\u{1F1EB}\u{1F1FB}",
  117: "\u{1F1EB}\u{1F1FA}",
  118: "\u{1F1EB}\u{1F1EC}",
  119: "\u{1F1EB}\u{1F1E9}",
  120: "\u{1F1EB}\u{1F1F1}",
  121: "\u{1F1EC}\u{1F1F6}",
  122: "\u{1F1EC}\u{1F1EA}",
  123: "\u{1F1EC}\u{1F1ED}",
  124: "\u{1F1EC}\u{1F1FA}",
  125: "\u{1F1EC}\u{1F1F3}",
  126: "\u{1F1EC}\u{1F1F2}",
  127: "\u{1F1EC}\u{1F1F7}",
  128: "\u{1F1EC}\u{1F1EC}",
  129: "\u{1F1EC}\u{1F1F9}",
  130: "\u{1F1EC}\u{1F1F1}",
  131: "\u{1F1EC}\u{1F1E6}",
  132: "\u{1F1EC}\u{1F1FE}",
  133: "\u{1F1ED}\u{1F1F0}",
  134: "\u{1F1ED}\u{1F1F2}",
  135: "\u{1F1ED}\u{1F1EA}",
  136: "\u{1F1ED}\u{1F1F7}",
  137: "\u{1F1ED}\u{1F1F3}",
  138: "\u{1F1ED}\u{1F1F9}",
  139: "\u{1F1ED}\u{1F1F1}",
  140: "\u{1F1ED}\u{1F1FA}",
  141: "\u{1F1EE}\u{1F1E8}",
  142: "\u{1F1EE}\u{1F1F3}",
  143: "\u{1F1EE}\u{1F1F6}",
  144: "\u{1F1EE}\u{1F1EA}",
  145: "\u{1F1EE}\u{1F1F7}",
  146: "\u{1F1EE}\u{1F1F4}",
  147: "\u{1F1EE}\u{1F1E9}",
  148: "\u{1F1EE}\u{1F1F8}",
  149: "\u{1F1EE}\u{1F1F3}",
  150: "\u{1F1EE}\u{1F1F6}",
  151: "\u{1F1EF}\u{1F1F2}",
  152: "\u{1F1EF}\u{1F1F5}",
  153: "\u{1F1EF}\u{1F1EA}",
  154: "\u{1F1EF}\u{1F1F9}",
  155: "\u{1F1EF}\u{1F1F7}",
  156: "\u{1F1F0}\u{1F1EA}",
  157: "\u{1F1F0}\u{1F1F2}",
  158: "\u{1F1F0}\u{1F1ED}",
  159: "\u{1F1F0}\u{1F1FC}",
  160: "\u{1F1F0}\u{1F1EC}",
  161: "\u{1F1F0}\u{1F1EE}",
  162: "\u{1F1F0}\u{1F1F3}",
  163: "\u{1F1F0}\u{1F1F7}",
  164: "\u{1F1F0}\u{1F1F8}",
  165: "\u{1F1F0}\u{1F1FA}",
  166: "\u{1F1F0}\u{1F1FC}",
  167: "\u{1F1F1}\u{1F1E6}",
  168: "\u{1F1F1}\u{1F1FB}",
  169: "\u{1F1F1}\u{1F1EE}",
  170: "\u{1F1F1}\u{1F1F8}",
  171: "\u{1F1F1}\u{1F1F6}",
  172: "\u{1F1F1}\u{1F1FA}",
  173: "\u{1F1F1}\u{1F1F7}",
  174: "\u{1F1F1}\u{1F1ED}",
  175: "\u{1F1F1}\u{1F1E7}",
  176: "\u{1F1F1}\u{1F1EC}",
  177: "\u{1F1F1}\u{1F1FE}",
  178: "\u{1F1F1}\u{1F1F9}",
  179: "\u{1F1F1}\u{1F1F3}",
  180: "\u{1F1F1}\u{1F1F1}",
  181: "\u{1F1F2}\u{1F1F4}",
  182: "\u{1F1F2}\u{1F1EB}",
  183: "\u{1F1F2}\u{1F1F8}",
  184: "\u{1F1F2}\u{1F1FE}",
  185: "\u{1F1F2}\u{1F1FD}",
  186: "\u{1F1F2}\u{1F1F3}",
  187: "\u{1F1F2}\u{1F1EA}",
  188: "\u{1F1F2}\u{1F1FA}",
  189: "\u{1F1F2}\u{1F1F6}",
  190: "\u{1F1F2}\u{1F1EC}",
  191: "\u{1F1F2}\u{1F1FC}",
  192: "\u{1F1F2}\u{1F1F2}",
  193: "\u{1F1F2}\u{1F1F9}",
  194: "\u{1F1F2}\u{1F1F7}",
  195: "\u{1F1F2}\u{1F1F5}",
};

const getFlag = (id) => countryFlags[id] || "\u{1F3F3}\u{FE0F}";

import { getIconComponent, getServiceColor } from "../data/serviceLogos.jsx";

const extractError = (err) => {
  if (err?.response?.data?.error?.message)
    return err.response.data.error.message;
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.message) return err.message;
  return "An unexpected error occurred";
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
  gap: 10,
};

const cardBase = {
  cursor: "pointer",
  borderRadius: 12,
  textAlign: "center",
  padding: "14px 8px",
  transition: "all 0.2s ease",
  border: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(30, 41, 59, 0.4)",
  userSelect: "none",
};

const cardSelected = {
  ...cardBase,
  border: "1px solid #6366f1",
  background: "rgba(99,102,241,0.12)",
  boxShadow: "0 0 20px rgba(99,102,241,0.15)",
};

const cardHover = "rgba(99,102,241,0.08)";

const BuyNumberPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [balance, setBalance] = useState(null);
  const [svcSearch, setSvcSearch] = useState("");
  const [hoveredSvc, setHoveredSvc] = useState(null);
  const [prices, setPrices] = useState({});
  const [sortByPrice, setSortByPrice] = useState("asc");
  const [maxPrice, setMaxPrice] = useState(null);
  const [fetchingPrices, setFetchingPrices] = useState(false);

  const parseServices = (raw) => {
    const svcRaw = raw?.data?.data || raw?.data;
    const svcList = Array.isArray(svcRaw)
      ? svcRaw
      : Array.isArray(svcRaw?.services)
        ? svcRaw.services
        : [];
    return svcList
      .filter((s) => s && (s.code || s.id))
      .map((s) => ({
        id: s.code || s.id,
        name: s.name || s.title || String(s.code || s.id),
      }));
  };

  const parseCountries = (raw) => {
    const ctyRaw = raw?.data?.data || raw?.data;
    if (Array.isArray(ctyRaw)) {
      return ctyRaw
        .filter((c) => c && typeof c === "object")
        .map((c) => ({
          id: c.id || c.code,
          name: c.eng || c.name || c.title || String(c.id || c.code),
        }));
    }
    if (ctyRaw && typeof ctyRaw === "object") {
      return Object.values(ctyRaw)
        .filter((v) => v && typeof v === "object" && v.visible !== 0)
        .map((c) => ({
          id: c.id || c.code,
          name: c.eng || c.name || String(c.id || c.code),
        }));
    }
    return [];
  };

  const fetchData = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [svcRes, ctyRes] = await Promise.all([
        servicesApi.getServicesList(),
        servicesApi.getCountries(),
      ]);
      setServices(parseServices(svcRes));
      setCountries(parseCountries(ctyRes));
    } catch (err) {
      console.error("[BuyNumberPage] fetchData error:", err);
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await userApi.getBalance();
      setBalance(res.data?.data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
      fetchBalance();
    }
  }, [authLoading, user, fetchData, fetchBalance]);

  const fetchPrices = useCallback(async (countryId, retries = 3) => {
    if (!countryId) { setPrices({}); return; }
    setFetchingPrices(true);
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await servicesApi.getPrices();
        const raw = res.data?.data || res.data;
        const priceMap = {};
        if (raw && typeof raw === "object") {
          Object.entries(raw).forEach(([svcCode, countries]) => {
            if (countries && typeof countries === "object") {
              const price = countries[countryId] || countries[String(countryId)];
              if (price !== undefined && price !== null && price !== "") {
                const numPrice = parseFloat(price);
                if (!isNaN(numPrice) && numPrice > 0) {
                  priceMap[svcCode] = numPrice;
                }
              }
            }
          });
        }
        setPrices(priceMap);
        setFetchingPrices(false);
        return;
      } catch (err) {
        console.error("[BuyNumberPage] fetchPrices attempt", attempt + 1, "error:", err);
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
        }
      }
    }
    setPrices({});
    setFetchingPrices(false);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchPrices(selectedCountry);
    }
  }, [selectedCountry, fetchPrices]);

  const filteredServices = useMemo(() => {
    let list = services;
    if (svcSearch) {
      const q = svcSearch.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q),
      );
    }
    if (maxPrice !== null && Object.keys(prices).length > 0) {
      list = list.filter((s) => {
        const p = prices[s.id];
        return p !== undefined && p <= maxPrice;
      });
    }
    if (sortByPrice && Object.keys(prices).length > 0) {
      list = [...list].sort((a, b) => {
        const pa = prices[a.id] ?? 9999;
        const pb = prices[b.id] ?? 9999;
        return sortByPrice === "asc" ? pa - pb : pb - pa;
      });
    }
    return list;
  }, [services, svcSearch, sortByPrice, maxPrice, prices]);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleBuy = async () => {
    if (!selectedService || !selectedCountry) {
      setError("Please select both a service and a country");
      return;
    }
    setError("");
    setSuccess("");
    setBuying(true);
    try {
      const res = await userApi.rentNumber({
        service: selectedService,
        country: selectedCountry,
      });
      const result = res.data?.data || res.data;
      const phone = result?.phoneNumber || result?.phone || result?.number;
      setSuccess(
        phone
          ? `Number purchased! Phone: ${phone}`
          : "Number purchased! Check your activations page.",
      );
      setTimeout(() => navigate("/activations"), 2000);
    } catch (err) {
      console.error("[BuyNumberPage] handleBuy error:", err);
      setError(extractError(err));
    } finally {
      setBuying(false);
    }
  };

  const selectedCountryObj = countries.find((c) => c.id === selectedCountry);
  const selectedServiceObj = services.find((s) => s.id === selectedService);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          colorBgContainer: "rgba(30, 41, 59, 0.7)",
          colorBgElevated: "rgba(15, 23, 42, 0.98)",
          colorBgLayout: "#0f172a",
          colorBorder: "rgba(255,255,255,0.08)",
          colorBorderSecondary: "rgba(255,255,255,0.06)",
          colorText: "#ffffff",
          colorTextSecondary: "rgba(255,255,255,0.5)",
          borderRadius: 12,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          controlHeight: 48,
        },
        components: {
          Select: {
            dropdownStyle: {
              background: "rgba(15, 23, 42, 0.98)",
              border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: 12,
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            },
            optionSelectedBg: "rgba(99,102,241,0.15)",
            optionHoverBg: "rgba(99,102,241,0.08)",
          },
        },
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ marginBottom: 28 }}>
          <Title level={3} style={{ color: "#fff", margin: 0 }}>
            <ShoppingCartOutlined
              style={{ marginRight: 10, color: "#818cf8" }}
            />
            Buy Number
          </Title>
          <Text type="secondary">
            Select a service and country to get a temporary phone number
          </Text>
          {balance && (
            <div style={{ marginTop: 10 }}>
              <Tag
                icon={<WalletOutlined />}
                style={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 8,
                  padding: "4px 12px",
                  fontSize: 13,
                }}
              >
                Balance: ${Number(balance.balance ?? 0).toFixed(2)}
              </Tag>
            </div>
          )}
        </div>

        {error && (
          <Alert
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
            title={error}
            style={{
              marginBottom: 20,
              borderRadius: 12,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
            action={
              !loading && services.length === 0 ? (
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={fetchData}
                  type="text"
                >
                  Retry
                </Button>
              ) : null
            }
          />
        )}
        {success && (
          <Alert
            type="success"
            showIcon
            title={success}
            style={{
              marginBottom: 20,
              borderRadius: 12,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          />
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Loading services and countries...</Text>
            </div>
          </div>
        ) : (
          <>
            {/* Country Selector */}
            <Card style={{ borderRadius: 16, marginBottom: 20, background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.06)" }} styles={{ body: { padding: 24 } }}>
              <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)", marginBottom: 12, display: "block" }}>
                <GlobalOutlined style={{ marginRight: 6, color: "#a78bfa" }} />
                Country ({countries.length} available)
              </Text>
              <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="label"
                style={{ width: "100%" }}
                size="large"
                value={selectedCountry}
                onChange={(val) => setSelectedCountry(val)}
                options={countries.map((c) => ({ value: c.id, label: `${getFlag(c.id)}  ${c.name} (${c.id})` }))}
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                notFoundContent="No countries found"
              />
            </Card>

            {/* Price Filter Bar */}
            {selectedCountry && (
              <Card style={{ borderRadius: 12, marginBottom: 20, background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.06)" }} styles={{ body: { padding: "12px 18px" } }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Price
                  </span>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
                    {[{ label: "All", value: null }, { label: "< $1", value: 1 }, { label: "< $2", value: 2 }, { label: "< $5", value: 5 }, { label: "< $10", value: 10 }].map((tier) => (
                      <button key={tier.label} onClick={() => setMaxPrice(tier.value)}
                        style={{ padding: "4px 10px", borderRadius: 6, border: maxPrice === tier.value ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.08)", background: maxPrice === tier.value ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.03)", color: maxPrice === tier.value ? "#4ade80" : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                        {tier.label}
                      </button>
                    ))}
                  </div>
                  {Object.keys(prices).length > 0 && (
                    <button onClick={() => setSortByPrice(sortByPrice === "asc" ? "desc" : "asc")}
                      style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #6366f1", background: "rgba(99,102,241,0.15)", color: "#a5b4fc", cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {sortByPrice === "asc" ? "\u2191" : "\u2193"} Price
                    </button>
                  )}
                  {fetchingPrices && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Loading...</span>}
                  {Object.keys(prices).length === 0 && !fetchingPrices && (
                    <button onClick={() => fetchPrices(selectedCountry)}
                      style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.1)", color: "#a5b4fc", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                      Load Prices
                    </button>
                  )}
                </div>
              </Card>
            )}

            {/* Service Grid */}
            <Card style={{ borderRadius: 16, marginBottom: 20, background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.06)" }} styles={{ body: { padding: 24 } }}>
              <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)", marginBottom: 12, display: "block" }}>
                <MobileOutlined style={{ marginRight: 6, color: "#818cf8" }} />
                Service ({filteredServices.length}{filteredServices.length !== services.length ? ` of ${services.length}` : ""} available)
              </Text>
              <Input prefix={<SearchOutlined style={{ color: "rgba(255,255,255,0.3)" }} />} placeholder="Search services..." allowClear value={svcSearch} onChange={(e) => setSvcSearch(e.target.value)} style={{ marginBottom: 16, borderRadius: 10, background: "rgba(255,255,255,0.03)" }} />
              <div style={{ ...gridStyle, maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
                {filteredServices.map((svc) => {
                  const color = getServiceColor(svc.id);
                  const IconComp = getIconComponent(svc.id);
                  const isSelected = selectedService === svc.id;
                  const isHovered = hoveredSvc === svc.id;
                  return (
                    <div key={svc.id} style={isSelected ? cardSelected : isHovered ? { ...cardBase, background: cardHover, border: "1px solid rgba(99,102,241,0.2)" } : cardBase} onClick={() => setSelectedService(svc.id)} onMouseEnter={() => setHoveredSvc(svc.id)} onMouseLeave={() => setHoveredSvc(null)}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: IconComp ? "rgba(0,0,0,0.3)" : color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", boxShadow: `0 4px 12px ${color}30`, overflow: "hidden" }}>
                        {IconComp ? <IconComp style={{ width: 24, height: 24, color: "#fff" }} /> : <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{svc.name.charAt(0).toUpperCase()}</span>}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.name}</div>
                      {prices[svc.id] !== undefined ? (
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", marginTop: 3 }}>${prices[svc.id].toFixed(2)}</div>
                      ) : (
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{svc.id}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Order Summary */}
            {selectedService && selectedCountry && (
              <Card style={{ borderRadius: 16, marginBottom: 20, background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))", border: "1px solid rgba(99,102,241,0.12)" }} styles={{ body: { padding: 20 } }}>
                <Text type="secondary" style={{ fontSize: 12, marginBottom: 12, display: "block" }}>Order Summary</Text>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <Tag icon={<MobileOutlined />} style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, padding: "6px 14px", fontSize: 13 }}>
                    {selectedServiceObj?.name || selectedService}
                  </Tag>
                  <Tag icon={<GlobalOutlined />} style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 8, padding: "6px 14px", fontSize: 13 }}>
                    {getFlag(selectedCountry)} {selectedCountryObj?.name || selectedCountry}
                  </Tag>
                  {prices[selectedService] !== undefined && (
                    <Tag style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700 }}>
                      ${prices[selectedService].toFixed(2)}
                    </Tag>
                  )}
                </div>
              </Card>
            )}

            {/* Buy Button */}
            <Button type="primary" block size="large" icon={buying ? undefined : <CheckCircleOutlined />} loading={buying} disabled={!selectedService || !selectedCountry} onClick={handleBuy} style={{ height: 52, borderRadius: 14, fontWeight: 700, fontSize: 16, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", boxShadow: "0 6px 24px rgba(99,102,241,0.35)" }}>
              {buying ? "Purchasing..." : "Buy Number"}
            </Button>
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default BuyNumberPage;
