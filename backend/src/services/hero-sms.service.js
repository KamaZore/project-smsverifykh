import heroSmsConfig from "../config/heroSms.js";
import logger from "../utils/logger.js";
import { getSetting, SETTING_KEYS } from "./settings.service.js";
import {
  BadKeyError,
  BadActionError,
  BadServiceError,
  BadCountryError,
  BadNumberError,
  BadStatusError,
  TooManyRequestsError,
  FullNumberError,
  NoNumbersError,
  AppError,
} from "../errors/AppError.js";

const { baseUrl, apiKey: envApiKey, timeout } = heroSmsConfig;

const priceCache = { data: null, ts: 0 };
const PRICE_CACHE_TTL = 5 * 60 * 1000;

// Resolves the active API key: DB setting (admin-editable, live) wins,
// falling back to the .env value set at boot.
async function resolveApiKey() {
  try {
    const dbKey = await getSetting(SETTING_KEYS.HERO_SMS_API_KEY);
    if (dbKey) return dbKey;
  } catch (err) {
    logger.warn("settings lookup failed, using env HERO_SMS_API_KEY", { error: err.message });
  }
  return envApiKey;
}

async function request(action, params = {}) {
  // `__overrideKey` is a control parameter (not sent upstream) used to
  // validate a candidate API key before it is saved.
  let { __overrideKey: overrideKey, ...rest } = params;
  params = rest;

  const url = new URL(`${baseUrl}/stubs/handler_api.php`);
  url.searchParams.set("action", action);
  url.searchParams.set("api_key", overrideKey || (await resolveApiKey()));

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  logger.debug(`HERO SMS API: ${action}`, { params });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(timeout),
  });

  const contentType = response.headers.get("content-type") || "";
  let body;

  if (contentType.includes("application/json")) {
    body = await response.json();
  } else if (contentType.includes("text/html")) {
    // Cloudflare / provider error pages come back as HTML; raise a clean
    // message instead of treating HTML as a plain-text hero-sms error.
    throw new TooManyRequestsError(
      "Hero SMS provider unreachable (provider blocked the request)",
    );
  } else {
    body = await response.text();
  }

  if (typeof body === "string") {
    handlePlainTextResponse(body);
  }

  if (body && body.error) {
    handleApiError(body.error);
  }

  return body;
}

function handlePlainTextResponse(body) {
  const errorMap = {
    BAD_KEY: () => new BadKeyError("Invalid API key"),
    BAD_ACTION: () => new BadActionError("Invalid action"),
    BAD_SERVICE: () => new BadServiceError("Unknown service code"),
    BAD_COUNTRY: () => new BadCountryError("Unknown country code"),
    BAD_NUMBER: () => new BadNumberError("Invalid number"),
    BAD_STATUS: () => new BadStatusError("Invalid status"),
    "Too Many Requests": () => new TooManyRequestsError("Rate limit exceeded"),
    FULL_NUMBER: () => new FullNumberError("All numbers for this service are currently unavailable"),
    NO_NUMBERS: () => new NoNumbersError("No numbers available"),
  };

  const trimmed = body.trim();
  if (errorMap[trimmed]) {
    throw errorMap[trimmed]();
  }

  if (trimmed.startsWith("ACCESS_NUMBER")) {
    return body;
  }
}

function handleApiError(error) {
  const errorMap = {
    BAD_KEY: () => new BadKeyError("Invalid API key"),
    BAD_ACTION: () => new BadActionError("Invalid action"),
    BAD_SERVICE: () => new BadServiceError("Unknown service code"),
    BAD_COUNTRY: () => new BadCountryError("Unknown country code"),
    BAD_NUMBER: () => new BadNumberError("Invalid number"),
    BAD_STATUS: () => new BadStatusError("Invalid status"),
    "Too Many Requests": () => new TooManyRequestsError("Rate limit exceeded"),
    FULL_NUMBER: () => new FullNumberError("All numbers for this service are currently unavailable"),
    NO_NUMBERS: () => new NoNumbersError("No numbers available"),
  };

  if (errorMap[error]) {
    throw errorMap[error]();
  }

  throw new AppError(error, 502);
}

// ─── V1 Methods ───────────────────────────────────────────

export function getNumber(service, country, options = {}) {
  return request("getNumber", {
    service,
    country,
    multiple: options.multiple ? 1 : undefined,
    maxPrice: options.maxPrice,
    providerIds: options.providerIds,
    exceptProviderIds: options.exceptProviderIds,
    ref: options.ref,
    activationType: options.activationType,
    fixedPrice: options.fixedPrice,
  });
}

export function setStatus(id, status) {
  return request("setStatus", { id, status });
}

export function getStatus(id) {
  return request("getStatus", { id });
}

export async function getPrices() {
  if (priceCache.data && Date.now() - priceCache.ts < PRICE_CACHE_TTL) {
    return priceCache.data;
  }
  try {
    const data = await request("getPrices");
    priceCache.data = data;
    priceCache.ts = Date.now();
    return data;
  } catch (err) {
    if (priceCache.data) {
      logger.warn("getPrices: returning stale cache due to error", { error: err.message });
      return priceCache.data;
    }
    throw err;
  }
}

export function getBalance(overrideKey) {
  // Optional key override lets the admin panel validate a candidate key
  // before saving it. `__overrideKey` is consumed in request() below.
  return request("getBalance", overrideKey ? { __overrideKey: overrideKey } : {});
}

export function getServiceNumbersCount(service) {
  return request("getServiceNumbersCount", { service });
}

export function getProviders(service, country) {
  return request("getProviders", { service, country });
}

export function getServicesList() {
  return request("getServicesList");
}

export function getCountries() {
  return request("getCountries");
}

export function getActiveActivations() {
  return request("getActiveActivations");
}

export function getHistory() {
  return request("getHistory");
}

export function getMyAccount() {
  // SMS-Activate-compatible API: getBalance returns the account balance.
  // HERO SMS does not expose getProfile/getAccount/getUser endpoints.
  // We return balance + active count as the available account info.
  const balance = request("getBalance");
  const active = request("getActiveActivations");
  return Promise.all([balance, active]).then(([bal, acts]) => {
    let balanceValue = null;
    if (typeof bal === "string") {
      const m = bal.match(/ACCESS_BALANCE:(\d+\.?\d*)/);
      if (m) balanceValue = parseFloat(m[1]);
    } else if (bal && typeof bal === "object" && bal.balance !== undefined) {
      balanceValue = bal.balance;
    }
    const activeCount =
      Array.isArray(acts) ? acts.length : typeof acts === "number" ? acts : null;
    return { balance: balanceValue, activeActivations: activeCount };
  });
}

// ─── V2 Methods ───────────────────────────────────────────

export function getFreePrices(service, country) {
  return request("getFreePrices", { service, country });
}

export function getPricesV2(service, country) {
  return request("getPricesV2", { service, country });
}

export function getNumberV2(service, country, options = {}) {
  return request("getNumberV2", {
    service,
    country,
    multiple: options.multiple ? 1 : undefined,
    maxPrice: options.maxPrice,
    providerIds: options.providerIds,
    exceptProviderIds: options.exceptProviderIds,
    ref: options.ref,
    activationType: options.activationType,
  });
}

export function getStatusV2(id) {
  return request("getStatusV2", { id });
}

export function setStatusV2(id, status) {
  return request("setStatusV2", { id, status });
}

// ─── V3 Methods ───────────────────────────────────────────

export function getPricesV3(service, country) {
  return request("getPricesV3", { service, country });
}

export function getOffers(services, countries) {
  return request("getOffers", { services, countries });
}

export default {
  getNumber,
  setStatus,
  getStatus,
  getPrices,
  getBalance,
  getServiceNumbersCount,
  getProviders,
  getServicesList,
  getCountries,
  getActiveActivations,
  getHistory,
  getMyAccount,
  getFreePrices,
  getPricesV2,
  getNumberV2,
  getStatusV2,
  setStatusV2,
  getPricesV3,
  getOffers,
};