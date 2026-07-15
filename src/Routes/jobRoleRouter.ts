import { Router } from "express";
import { Role } from "../Auth/role";
import { JobRoleController } from "../Controller/jobRoleController";
import { authorize } from "../Middleware/authMiddleware";
import { JobRoleService } from "../Services/jobRoleService";

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
