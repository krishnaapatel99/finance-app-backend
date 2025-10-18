import express from "express";
import {
  addIncome,
  addExpense,
  getFinance,
  updateFinance,
  deleteFinance
} from "../controllers/financeController.js";

const router = express.Router();

// Fetch all finance
router.get("/", getFinance);

// Add income/expense separately
router.post("/income/add", addIncome);
router.post("/expense/add", addExpense);

// Update & Delete
router.put("/update/:id", updateFinance);
router.delete("/delete/:id", deleteFinance);

export default router;
