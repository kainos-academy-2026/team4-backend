import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { JobRoleController } from "../Controller/jobRoleController";
import { JobRoleService } from "../Services/jobRoleService";

const router = Router();
const jobRoleService = new JobRoleService();
const jobRoleController = new JobRoleController(jobRoleService);

router.get("/job-roles", jobRoleController.getJobRoles);

export default router;