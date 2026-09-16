import * as heroSms from "../services/hero-sms.service.js";
import asyncWrapper from "../middleware/async-wrapper.js";

export const getPricesV3 = asyncWrapper(async (req, res) => {
  const { service, country } = req.validated.query;
  const result = await heroSms.getPricesV3(service, country);
  res.json({ success: true, data: result });
});

export const getOffers = asyncWrapper(async (req, res) => {
  const { services, countries } = req.validated.query;
  const result = await heroSms.getOffers(services, countries);
  res.json({ success: true, data: result });
});

export default {
  getPricesV3,
  getOffers,
};
