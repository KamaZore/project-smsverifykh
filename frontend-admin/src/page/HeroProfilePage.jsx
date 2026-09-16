import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button as MuiButton, IconButton, Tooltip } from "@mui/material";
import { AppstoreOutlined, ReloadOutlined, LinkOutlined, DollarOutlined } from "@ant-design/icons";
import { Tag, Typography } from "antd";
import { getHeroProfile } from "../api/admin.api";

const { Text } = Typography;

const TOPUP_URL = "https://hero-sms.com";

export default function HeroProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHeroProfile();
      setProfile(data);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const balance =
    profile?.provider?.balance != null
      ? `$${Number(profile.provider.balance).toFixed(4)}`
      : "—";

  const reachable = profile?.provider?.reachable === true;

  return (
    <div className="max-w-3xl space-y-5">
      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── Hero SMS Profile Card ─────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#e3e6f0] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#e3e6f0]">
          <h3 className="m-0 text-base font-semibold text-[#343a40]">
            <AppstoreOutlined className="mr-2 text-indigo-500" />
            Hero SMS — Account
          </h3>
          <Tooltip title="Refresh">
            <IconButton
              onClick={load}
              disabled={loading}
              size="small"
              sx={{ border: "1px solid #dee2e6", color: "#6c757d" }}
            >
              <ReloadOutlined spin={loading} />
            </IconButton>
          </Tooltip>
        </div>

        <div className="p-5">
          {loading ? (
            <Text type="secondary">Loading profile…</Text>
          ) : profile?.configured ? (
            <div className="space-y-4">
              {/* ── Status row ── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag color={reachable ? "success" : "error"}>
                    {reachable ? <LinkOutlined /> : <ReloadOutlined />}{" "}
                    {reachable ? "Online" : "Unreachable"}
                  </Tag>
                  {profile?.source && (
                    <span className="text-xs text-slate-400">
                      Key source: {profile.source}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  {profile?.lastChecked
                    ? new Date(profile.lastChecked).toLocaleString("en-GB")
                    : ""}
                </div>
              </div>

              {/* ── API Key ── */}
              <div className="flex items-center justify-between bg-slate-50 border border-[#e3e6f0] rounded-md px-4 py-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                    API Key
                  </div>
                  <div className="font-mono text-[15px] text-[#343a40]">
                    {profile.maskedKey || "—"}
                  </div>
                </div>
              </div>

              {/* ── Balance + Top Up + Active Activations ── */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Balance card */}
                <div className="flex items-center justify-between bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-lg px-5 py-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400 mb-1">
                      Balance
                    </div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {balance}
                    </div>
                  </div>
                  <MuiButton
                    variant="contained"
                    size="small"
                    href={TOPUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<DollarOutlined />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 600,
                      bgcolor: "#6366f1",
                      "&:hover": { bgcolor: "#4f46e5" },
                    }}
                  >
                    Top up
                  </MuiButton>
                </div>

                {/* Active activations card */}
                <div className="border border-[#e3e6f0] rounded-lg px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Active Activations
                  </div>
                  <div className="text-2xl font-bold text-[#343a40]">
                    {profile?.activeActivations != null
                      ? profile.activeActivations
                      : "—"}
                  </div>
                </div>
              </div>

              {/* ── Provider message ── */}
              {profile?.provider?.message && (
                <Box
                  sx={{
                    fontSize: 13,
                    color: "#6c757d",
                    bgcolor: "#f8f9fa",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  {profile.provider.message}
                </Box>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Text type="secondary">
                No API key configured. Go to{" "}
                <a
                  onClick={() =>
                    (window.location.href = "/settings/api-keys")
                  }
                  className="cursor-pointer text-indigo-600"
                >
                  API Keys
                </a>{" "}
                to add one.
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick links ───────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#e3e6f0] shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e3e6f0]">
          <h3 className="m-0 text-base font-semibold text-[#343a40]">
            <LinkOutlined className="mr-2 text-slate-400" />
            Quick Links
          </h3>
        </div>
        <div className="p-5 flex flex-wrap gap-3">
          <MuiButton
            variant="outlined"
            size="small"
            href={TOPUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DollarOutlined />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Top up balance
          </MuiButton>
          <MuiButton
            variant="outlined"
            size="small"
            href="/settings/api-keys"
            startIcon={<AppstoreOutlined />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Manage API Key
          </MuiButton>
          <MuiButton
            variant="outlined"
            size="small"
            href={TOPUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<LinkOutlined />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Open Hero SMS
          </MuiButton>
        </div>
      </div>
    </div>
  );
}
