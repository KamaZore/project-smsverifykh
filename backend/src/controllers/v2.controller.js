import * as heroSms from "../services/hero-sms.service.js";
import asyncWrapper from "../middleware/async-wrapper.js";

export const getFreePrices = asyncWrapper(async (req, res) => {
  const { service, country } = req.validated.query;
  const result = await heroSms.getFreePrices(service, country);
  res.json({ success: true, data: result });
});

export const getPricesV2 = asyncWrapper(async (req, res) => {
  const { service, country } = req.validated.query;
  const result = await heroSms.getPricesV2(service, country);
  res.json({ success: true, data: result });
});

export const getNumberV2 = asyncWrapper(async (req, res) => {
  const { service, country, multiple, maxPrice, providerIds, exceptProviderIds, ref, activationType } = req.validated.query;
  const result = await heroSms.getNumberV2(service, country, {
    multiple,
    maxPrice,
    providerIds,
    exceptProviderIds,
    ref,
    activationType,
  });
  res.json({ success: true, data: result });
});

export const getStatusV2 = asyncWrapper(async (req, res) => {
  const { id } = req.validated.query;
  const result = await heroSms.getStatusV2(id);
  res.json({ success: true, data: result });
});

export const setStatusV2 = asyncWrapper(async (req, res) => {
  const { id, status } = req.validated.query;
  const result = await heroSms.setStatusV2(id, status);
  res.json({ success: true, data: result });
});

export default {
  getFreePrices,
  getPricesV2,
  getNumberV2,
  getStatusV2,
  setStatusV2,
};
