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

/** 
 * Find shop by user id
 */ 
export const getShop = async (userId: string) => {
  const shop = await db.shop.findFirst({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  return shop;
};
