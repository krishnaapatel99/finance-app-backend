import express from "express";
import { getAllDocuments, addDocument, deleteDocument,getDocumentData} from "../controllers/documentController.js";

const router = express.Router();

router.get("/", getAllDocuments);
router.post("/add", addDocument);
router.delete("/:id", deleteDocument);
router.get("/document-data",getDocumentData);
export default router;
