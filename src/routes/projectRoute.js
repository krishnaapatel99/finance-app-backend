import express from "express";
import {getProjectData,sendProjectData} from "../controllers/projectController.js";

const router= express.Router();

router.get("/project",getProjectData);
router.post("/create-project",sendProjectData)

export default router;