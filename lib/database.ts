"use server";

import { db } from "@/server/db";



/**
 * Find user role by id
 */
export const findUserRoleById = async (id: string) => {
  const userRole = await db.role.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  return userRole;
};