import { z } from "zod";

export const rolesSchema = z.object({
  name: z.string().trim().toLowerCase(),
  description:z.string().trim().toLowerCase(),
});

export const rolesSchemaUpdate = rolesSchema.extend({
  id: z.string().ulid(),
});

export const rolesSchemaDelete = z.object({
  id: z.string().ulid(),
});


export const userRolesSchema = z.object({
  userId: z.string(),
  roleId: z.string()
});

export const userRolesSchemaUpdate = userRolesSchema.extend({
  id: z.string().ulid(),
});

export const userRolesSchemaDelete = z.object({
  id: z.string().ulid(),
});

// Generate TypeScript types from schemas
export type RolesSchema = z.infer<typeof rolesSchema>;
export type RolesSchemaUpdate = z.infer<typeof rolesSchemaUpdate>;
export type RolesSchemaDelete = z.infer<typeof rolesSchemaDelete>;

export type UserRolesSchema = z.infer<typeof userRolesSchema>;
export type UserRolesSchemaUpdate = z.infer<typeof userRolesSchemaUpdate>;  
export type UserRolesSchemaDelete = z.infer<typeof userRolesSchemaDelete>;
