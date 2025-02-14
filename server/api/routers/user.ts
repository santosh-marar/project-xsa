import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Input validation schema
const getUsersInputSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  sortBy: z.enum(["name", "email", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
  filters: z
    .object({
      role: z.string().optional(),
      hasVerifiedEmail: z.boolean().optional(),
      createdAfter: z.date().optional(),
      createdBefore: z.date().optional(),
    })
    .optional(),
});

type GetUsersInput = z.infer<typeof getUsersInputSchema>;

export const userRouter = createTRPCRouter({
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    return profile ?? null;
  }),

  getAll: adminProcedure
    .input(getUsersInputSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, sortBy, sortOrder, search, filters } = input;

      // Initialize where conditions array
      const conditions: Prisma.UserWhereInput[] = [];

      // Add search conditions if search is provided
      if (search) {
        conditions.push({
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phoneNumber: { contains: search, mode: "insensitive" } },
          ],
        });
      }

      // Add role filter if provided
      if (filters?.role) {
        conditions.push({
          roles: {
            some: {
              role: {
                name: filters.role,
              },
            },
          },
        });
      }

      // Add email verification filter if provided
      if (filters?.hasVerifiedEmail !== undefined) {
        conditions.push({
          emailVerified: filters.hasVerifiedEmail ? { not: null } : null,
        });
      }

      // Add date range filters if provided
      if (filters?.createdAfter) {
        conditions.push({
          createdAt: { gte: filters.createdAfter },
        });
      }

      if (filters?.createdBefore) {
        conditions.push({
          createdAt: { lte: filters.createdBefore },
        });
      }

      // Build the final where clause
      const where: Prisma.UserWhereInput =
        conditions.length > 0 ? { AND: conditions } : {};

      // Get total count for pagination
      const total = await ctx.db.user.count({ where });

      // Get users with pagination, sorting, and includes
      const users = await ctx.db.user.findMany({
        where,
        include: {
          roles: {
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          address: true,
          _count: {
            select: {
              posts: true,
              shops: true,
              order: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      // Get available roles for filters
      const availableRoles = await ctx.db.role.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              userRoles: true,
            },
          },
        },
      });

      // Transform the response
      const transformedUsers = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        users: transformedUsers,
        metadata: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasNextPage: page * pageSize < total,
          hasPreviousPage: page > 1,
        },
        filters: {
          roles: availableRoles.map((role) => ({
            id: role.id,
            name: role.name,
            userCount: role._count.userRoles,
          })),
        },
      };
    }),
  getById: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: input },
      include: {
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            }, // Fetch the actual role details
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      roles: user.roles.map((userRole) => userRole.role), // Extracting only role details
    };
  }),
});
