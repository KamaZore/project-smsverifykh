import { Router } from "express";
import v1 from "../controllers/v1.controller.js";
import validate from "../middleware/validation.js";
import * as v1Schema from "../validators/v1.validator.js";

const router = Router();

router.get("/getNumber", validate(v1Schema.getNumber), v1.getNumber);
router.get("/setStatus", validate(v1Schema.setStatus), v1.setStatus);
router.get("/getStatus", validate(v1Schema.getStatus), v1.getStatus);
router.get("/getPrices", validate(v1Schema.getPrices), v1.getPrices);
router.get("/getBalance", validate(v1Schema.getBalance), v1.getBalance);
router.get("/getServiceNumbersCount", validate(v1Schema.getServiceNumbersCount), v1.getServiceNumbersCount);
router.get("/getProviders", validate(v1Schema.getProviders), v1.getProviders);
router.get("/getServicesList", validate(v1Schema.getServicesList), v1.getServicesList);
router.get("/getCountries", validate(v1Schema.getCountries), v1.getCountries);
router.get("/getActiveActivations", validate(v1Schema.getActiveActivations), v1.getActiveActivations);

export default router;
