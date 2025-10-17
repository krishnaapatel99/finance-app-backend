import express from "express";
import { getAllDocuments, addDocument, deleteDocument } from "../controllers/documentController.js";

const router = express.Router();

router.get("/", getAllDocuments);
router.post("/add", addDocument);
router.delete("/:id", deleteDocument);

export default router;
