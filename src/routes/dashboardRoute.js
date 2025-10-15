import express from "express";
import { getFinanceSummary , getUpcomingEventsData } from "../controllers/dashboardController.js";
const router=express.Router();

router.get("/dashboard",getFinanceSummary);
router.get("/upcomingevents",getUpcomingEventsData);


export default router;