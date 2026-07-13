import { Router } from "express";
import { JobRoleController } from "../Controller/jobRoleController";
import { JobRoleService } from "../Services/jobRoleService";

const router = Router();
const jobRoleService = new JobRoleService();
const jobRoleController = new JobRoleController(jobRoleService);

router.get("/job-roles", jobRoleController.getJobRoles);
router.get("/job-roles/:id", jobRoleController.JobRoleDetailedResponse);

export default router;
