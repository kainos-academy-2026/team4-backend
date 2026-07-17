import type { JobRoleDao } from "../dao/jobRoleDao";
import { PrismaJobRoleDao } from "../dao/jobRoleDao";
import { type IJobRoleMapper, JobRoleMapper } from "../mappers/jobRoleMapper";
import type { JobRoleDetailedResponse } from "../models/jobRoleDetailedResponse";
import type { JobRoleResponse } from "../models/jobRoleResponse";
import { JobApplicationService } from "./jobApplicationService";

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao = new PrismaJobRoleDao(),
		private readonly jobRoleMapper: IJobRoleMapper = new JobRoleMapper(),
		private readonly jobApplicationService: JobApplicationService = new JobApplicationService(),
	) {}

	public async getJobRoles(userId?: string): Promise<JobRoleResponse[]> {
		const jobRoles = await this.jobRoleDao.getJobRoles();
		const responses = this.jobRoleMapper.toResponses(jobRoles);

		if (!userId) {
			return responses;
		}

		return Promise.all(
			responses.map(async (response) => {
				try {
					const application =
						await this.jobApplicationService.getApplicationForRole(
							response.id,
							userId,
						);

					if (application) {
						return {
							...response,
							myApplication: {
								status: application.status,
								cvFileName: application.cvFileName,
							},
						};
					}
				} catch (error) {
					console.error(
						`Error fetching application for role ${response.id}, user ${userId}:`,
						error,
					);
				}

				return response;
			}),
		);
	}

	public async JobRoleDetailedResponse(
		jobRoleId: number,
		userId?: string,
	): Promise<JobRoleDetailedResponse | null> {
		const jobRole = await this.jobRoleDao.JobRoleDetailedResponse(jobRoleId);

		if (!jobRole) {
			return null;
		}

		const response = this.jobRoleMapper.JobRoleDetailedResponse(jobRole);

		if (!userId) {
			return response;
		}

		try {
			const application =
				await this.jobApplicationService.getApplicationForRole(
					jobRoleId,
					userId,
				);

			if (application) {
				return {
					...response,
					myApplication: {
						status: application.status,
						cvFileName: application.cvFileName,
					},
				};
			}
		} catch (error) {
			console.error(
				`Error fetching application for role ${jobRoleId}, user ${userId}:`,
				error,
			);
		}

		return response;
	}
}
