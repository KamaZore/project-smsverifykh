import { Router } from "express";
import v2 from "../controllers/v2.controller.js";
import validate from "../middleware/validation.js";
import * as v2Schema from "../validators/v2.validator.js";

const router = Router();

router.get("/getFreePrices", validate(v2Schema.getFreePrices), v2.getFreePrices);
router.get("/getPricesV2", validate(v2Schema.getPricesV2), v2.getPricesV2);
router.get("/getNumberV2", validate(v2Schema.getNumberV2), v2.getNumberV2);
router.get("/getStatusV2", validate(v2Schema.getStatusV2), v2.getStatusV2);
router.get("/setStatusV2", validate(v2Schema.setStatusV2), v2.setStatusV2);

export default router;
