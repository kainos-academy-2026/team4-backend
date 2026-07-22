import { z } from "zod";

export const JobRoleIdParamSchema = z.object({
	id: z
		.string()
		.regex(/^[1-9]\d*$/, "Invalid job role id")
		.transform((value) => Number(value))
		.refine(Number.isSafeInteger, "Invalid job role id"),
});

export type JobRoleIdParamDto = z.infer<typeof JobRoleIdParamSchema>;
