import express from "express";
import {
  addIncome,
  addExpense,
  getFinance,
  updateFinance,
  deleteFinance
} from "../controllers/financeController.js";

const router = express.Router();

// Income routes
router.post("/income/add", addIncome);

// Expense routes
router.post("/expense/add", addExpense);

// Fetch all finance data
router.get("/", getFinance);

// Update record
router.put("/update/:id", updateFinance);

// Delete record
router.delete("/delete/:id", deleteFinance);

export default router;
