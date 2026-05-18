import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";
import {
  createLead, getLeads, getLeadById,
  updateLead, deleteLead, exportCSV
} from "../controllers/lead.controller";

const router = Router();

router.use(protect); // all lead routes require login

router.get("/", getLeads);
router.get("/export", adminOnly, exportCSV);
router.post("/", createLead);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", adminOnly, deleteLead); // only admin can delete

export default router;