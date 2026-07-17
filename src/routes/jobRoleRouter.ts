import { Router } from "express";
import { Role } from "../Auth/role";
import { JobApplicationController } from "../controller/jobApplicationController";
import { JobRoleController } from "../controller/jobRoleController";
import { authorize } from "../middleware/authMiddleware";
import { optionalAuth, requireAuth } from "../middleware/authMiddleware";
import { validateJobRoleIdParam } from "../middleware/jobRoleIdParamMiddleware";
import { JobApplicationService } from "../services/jobApplicationService";
import { JobRoleService } from "../services/jobRoleService";

const router = Router();
const jobRoleService = new JobRoleService();
const jobRoleController = new JobRoleController(jobRoleService);

const jobApplicationService = new JobApplicationService();
const jobApplicationController = new JobApplicationController(
	jobApplicationService,
);

router.get(
	"/job-roles", optionalAuth,
	authorize([Role.Admin, Role.User]),
	jobRoleController.getJobRoles,
);
router.get(
	"/job-roles/:id",
	optionalAuth,
	authorize([Role.Admin, Role.User]),
	jobRoleController.JobRoleDetailedResponse,
);
router.get(
	"/job-roles/:id/applications/upload-url",
	validateJobRoleIdParam,
	requireAuth,
	jobApplicationController.getUploadUrl,
);
router.get(
	"/job-roles/:id/applications/me",
	validateJobRoleIdParam,
	requireAuth,
	jobApplicationController.getApplicationForRole,
);
router.post(
	"/job-roles/:id/applications",
	validateJobRoleIdParam,
	requireAuth,
	jobApplicationController.createApplication,
);

export default router;
