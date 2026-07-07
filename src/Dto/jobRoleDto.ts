import { z } from "zod";

export interface JobRoleDto {
    id: number;
    roleName: string;
    location: string;
    capability: string;
    band: string;
    closingDate: string;
    status: string;
}

export const JobRoleDtoSchema = z.object({
    id: z.number(),
    roleName: z.string(),
    location: z.string(),
    capability: z.string(),
    band: z.string(),
    closingDate: z.string(),
    status: z.string(),
});

export type JobRoleDtoType = z.infer<typeof JobRoleDtoSchema>;

export const IdParamSchema = z.object({
    id: z.coerce.number().int("ID must be an integer").positive("ID must be a positive integer"),
});