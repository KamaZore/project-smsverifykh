import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button as MuiButton, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { CheckCircleFilled, EyeInvisibleOutlined, EyeOutlined, KeyOutlined, ReloadOutlined } from "@ant-design/icons";
import { Tag, Typography } from "antd";
import { getHeroKeyStatus, updateHeroKey } from "../api/admin.api";

/**
 * API Key management page (HERO SMS provider).
 * Shows the masked active key + live provider verification, and lets the
 * admin save a new key — validated against HERO SMS BEFORE it replaces
 * the current one, so a bad key can never break the integration.
 */
export default function ApiKeysPage() {
  const [status, setStatus] = useState(null);
  const [newKey, setNewKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setStatus(await getHeroKeyStatus());
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to load key status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!newKey.trim()) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const updated = await updateHeroKey(newKey.trim());
      setStatus(updated);
      setNewKey("");
      setNotice("API key saved and verified — the integration now uses the new key.");
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to update the API key");
    } finally {
      setSaving(false);
    }
  };

  const statusColor = status?.provider?.reachable ? "success" : status?.configured ? "warning" : "default";
  const statusText = loading
    ? "checking…"
    : status?.provider?.reachable
      ? "verified"
      : status?.configured
        ? "unverified"
        : "not configured";

  return (
    <div>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {notice && !error && (
        <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      {/* AdminLTE .card: HERO SMS key */}
      <div className="bg-white rounded-md border border-[#e3e6f0] shadow-sm overflow-hidden max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#e3e6f0]">
          <h3 className="m-0 text-base font-semibold text-[#343a40]">
            <KeyOutlined className="mr-2 text-amber-500" />
            HERO SMS · API Key
          </h3>
          <Tooltip title="Refresh status">
            <IconButton onClick={load} disabled={loading} size="small" sx={{ border: "1px solid #dee2e6", color: "#6c757d" }}>
              <ReloadOutlined />
            </IconButton>
          </Tooltip>
        </div>

        <div className="p-5">
          {/* Current masked key */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-[#e3e6f0] rounded-md px-4 py-3 mb-4">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                Active key
              </div>
              <div className="font-mono text-[15px] text-[#343a40] truncate">
                {loading ? "…" : status?.maskedKey || "— not configured —"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 mb-1">source: {status?.source || "—"}</div>
              <Tag color={statusColor} style={{ marginInlineEnd: 0 }}>
                {status?.provider?.reachable ? <CheckCircleFilled /> : null} {statusText}
              </Tag>
            </div>
          </div>

          {/* Provider verification info */}
          <Box className="mb-5" sx={{ fontSize: 13.5, color: "#6c757d" }}>
            {loading ? (
              "Checking with HERO SMS…"
            ) : status?.provider?.reachable ? (
              <>Provider check passed — account balance: <b>{Number(status.provider.balance).toFixed(2)}</b></>
            ) : status?.configured ? (
              <>Provider check failed — <i>{status.provider.message}</i>. Replace the key below.</>
            ) : (
              <>No API key configured. Paste your HERO SMS key from <b>hero-sms.com</b> below.</>
            )}
          </Box>

          {/* Update form */}
          <Typography variant="body2" sx={{ color: "#495057", fontWeight: 600, mb: 1 }}>
            Replace key
          </Typography>
          <div className="flex flex-wrap items-start gap-3">
            <TextField
              size="small"
              type={showKey ? "text" : "password"}
              placeholder="Paste new HERO SMS API key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              sx={{ width: 380, maxWidth: "100%" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowKey(!showKey)} edge="end">
                        {showKey ? <EyeInvisibleOutlined fontSize="small" /> : <EyeOutlined fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <MuiButton
              variant="contained"
              onClick={save}
              disabled={saving || !newKey.trim()}
              sx={{ textTransform: "none", fontWeight: 600, background: "#6366f1", "&:hover": { background: "#4f46e5" }, px: 3 }}
            >
              {saving ? "Verifying & saving…" : "Save & verify"}
            </MuiButton>
          </div>

          <Typography variant="body2" sx={{ color: "#868e96", mt: 2.5, fontSize: 12.5 }}>
            The key is validated with HERO SMS (getBalance) before it is saved — an invalid key is
            rejected and never replaces the active one. Changes take effect immediately, and every
            update is written to the audit log.
          </Typography>
        </div>
      </div>
    </div>
  );
}
