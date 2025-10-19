import express from "express";
import {getProjectData,sendProjectData, updateProject} from "../controllers/projectController.js";

const router= express.Router();

router.get("/project",getProjectData);
router.post("/create-project",sendProjectData)
router.put("/update-project/:id",updateProject);

export default router;