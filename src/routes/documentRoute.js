import express from "express";
import { getAllDocuments, addDocument } from "../controllers/documentController.js";

const router = express.Router();

router.get("/", getAllDocuments);
router.post("/add", addDocument);

export default router;
