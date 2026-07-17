import { Router } from "express";
import { Role } from "../Auth/role";
import { JobRoleController } from "../controller/jobRoleController";
import { authorize } from "../middleware/authMiddleware";
import { JobRoleService } from "../services/jobRoleService";

const router = Router();
const jobRoleService = new JobRoleService();
const jobRoleController = new JobRoleController(jobRoleService);

router.get(
	"/job-roles",
	authorize([Role.Admin, Role.User]),
	jobRoleController.getJobRoles,
);
router.get(
	"/job-roles/:id",
	authorize([Role.Admin, Role.User]),
	jobRoleController.JobRoleDetailedResponse,
);

export default router;
