import express from "express";
import { getFinanceData, addFinance, updateFinance, deleteFinance } from "../controllers/financeController.js";

const router = express.Router();

router.get("/", getFinanceData);
router.post("/add", addFinance);
router.put("/update/:id", updateFinance);
router.delete("/delete/:id", deleteFinance);

export default router;
