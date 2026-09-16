import * as heroSms from "../services/hero-sms.service.js";
import asyncWrapper from "../middleware/async-wrapper.js";

export const getNumber = asyncWrapper(async (req, res) => {
  const { service, country, multiple, maxPrice, providerIds, exceptProviderIds, ref, activationType, fixedPrice } = req.validated.query;
  const result = await heroSms.getNumber(service, country, {
    multiple,
    maxPrice,
    providerIds,
    exceptProviderIds,
    ref,
    activationType,
    fixedPrice,
  });
  res.json({ success: true, data: result });
});

export const setStatus = asyncWrapper(async (req, res) => {
  const { id, status } = req.validated.query;
  const result = await heroSms.setStatus(id, status);
  res.json({ success: true, data: result });
});

export const getStatus = asyncWrapper(async (req, res) => {
  const { id } = req.validated.query;
  const result = await heroSms.getStatus(id);
  res.json({ success: true, data: result });
});

export const getPrices = asyncWrapper(async (req, res) => {
  const result = await heroSms.getPrices();
  res.json({ success: true, data: result });
});

export const getBalance = asyncWrapper(async (req, res) => {
  const result = await heroSms.getBalance();
  res.json({ success: true, data: result });
});

export const getServiceNumbersCount = asyncWrapper(async (req, res) => {
  const { service } = req.validated.query;
  const result = await heroSms.getServiceNumbersCount(service);
  res.json({ success: true, data: result });
});

export const getProviders = asyncWrapper(async (req, res) => {
  const { service, country } = req.validated.query;
  const result = await heroSms.getProviders(service, country);
  res.json({ success: true, data: result });
});

export const getServicesList = asyncWrapper(async (req, res) => {
  const result = await heroSms.getServicesList();
  res.json({ success: true, data: result });
});

export const getCountries = asyncWrapper(async (req, res) => {
  const result = await heroSms.getCountries();
  res.json({ success: true, data: result });
});

export const getActiveActivations = asyncWrapper(async (req, res) => {
  const result = await heroSms.getActiveActivations();
  res.json({ success: true, data: result });
});

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
};
