import { Router } from "express";
import v3 from "../controllers/v3.controller.js";
import validate from "../middleware/validation.js";
import * as v3Schema from "../validators/v3.validator.js";

const router = Router();

router.get("/getPricesV3", validate(v3Schema.getPricesV3), v3.getPricesV3);
router.get("/getOffers", validate(v3Schema.getOffers), v3.getOffers);

export default router;
