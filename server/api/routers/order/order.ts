import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  sellerProcedure,
} from "../../trpc";
import { nanoid } from "nanoid";
import {
  Prisma,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";

const generateOrderNumber = () => `ORD-${nanoid(8)}`;
// Input validation schema
const getOrdersInputSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  sortBy: z
    .enum(["orderNumber", "createdAt", "total", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
  filters: z
    .object({
      status: z.nativeEnum(OrderStatus).optional(),
      paymentStatus: z.nativeEnum(PaymentStatus).optional(),
      paymentMethod: z.nativeEnum(PaymentMethod).optional(),
      minTotal: z.number().optional(),
      maxTotal: z.number().optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional(),
      userId: z.string().optional(),
    })
    .optional(),
});

type GetOrdersInput = z.infer<typeof getOrdersInputSchema>;

const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            productVariationId: z.string(),
            quantity: z.number().int().positive(),
            price: z.number().positive(),
          })
        ),
        shippingAddress: z.object({
          fullName: z.string(),
          phoneNumber1: z.string(),
          phoneNumber2: z.string().optional(),
          addressLine1: z.string(),
          addressLine2: z.string().optional(),
          country: z.string().default("Nepal"),
          state: z.string(),
          district: z.string(),
          city: z.string().optional(),
          village: z.string().optional(),
          street: z.string(),
          zipCode: z.string().optional(),
          addressType: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
        }),
        paymentMethod: z.enum(["CASH_ON_DELIVERY", "ESEWA", "KHALTI"]),
        total: z.number().positive(),
        transactionId: z.string().optional(),
        shippingCost: z.number().optional().default(0),
        tax: z.number().optional().default(0),
        notes: z.string().optional(),
      })
    )
  .mutation(async ({ ctx, input }) => {
  const userId = ctx.session.user.id as string;
  const subTotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subTotal + input.shippingCost + input.tax;
  
  return ctx.db.$transaction(async (db) => {
    // Check inventory for all products before creating the order
    for (const item of input.items) {
      const productVariation = await db.productVariation.findUnique({
        where: {
          id: item.productVariationId,
        },
        select: {
          stock: true,
          product: {
            select: {
              name: true
            }
          }
        }
      });
      
      if (!productVariation) {
        throw new Error(`Product variation with ID ${item.productVariationId} not found`);
      }
      
      if (productVariation.stock < item.quantity) {
        throw new Error(
          `Not enough stock for product ${productVariation.product.name}. ` +
          `Requested: ${item.quantity}, Available: ${productVariation.stock}`
        );
      }
    }
    
    // Create the order if all inventory checks pass
    const order = await db.order.create({
      data: {
        userId: userId,
        shippingAddress: input.shippingAddress,
        orderNumber: generateOrderNumber(),
        subTotal,
        shippingCost: input.shippingCost,
        tax: input.tax,
        total,
        notes: input.notes,
      },
    });
    
    // Create order items and update inventory
    await db.orderItem.createMany({
      data: input.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productVariationId: item.productVariationId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
      })),
    });
    
    // Update product variation stock quantities
    for (const item of input.items) {
      await db.productVariation.update({
        where: {
          id: item.productVariationId,
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }
    
    // Create payment record
    await db.payment.create({
      data: {
        orderId: order.id,
        method: input.paymentMethod,
        amount: input.total,
        status: "PENDING",
        transactionId: input.transactionId,
      },
    });
    
    // Find and delete the user's cart items
    await db.cartItem.deleteMany({
      where: {
        cart: {
          userId: userId
        }
      }
    });
    
    // Delete the cart itself (optional, depending on your schema design)
    const cart = await db.cart.findFirst({
      where: {
        userId: userId
      }
    });
    
    if (cart) {
      // Option 1: Delete the cart entirely
      await db.cart.delete({
        where: {
          id: cart.id
        }
      });
    }
    
    return order;
  });
}),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        orderNumber: true,
        createdAt: true, // Order date
        status: true,
        total: true,
        items: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      totalItems: order.items.length,
      status: order.status,
      total: order.total,
    }));
  }),

  getMyOrderById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findUnique({
        where: { id: input, userId: ctx.session.user.id },
        include: {
          items: {
            include: {
              product: true, // Fetch product details along with items
            },
          },
          payment: true,
        },
      });
    }),

  updateOrderByAdminById: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z
          .enum([
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
          ])
          .optional(),
        shippingCost: z.number().optional(),
        tax: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.$transaction(async (db) => {
        const currentOrder = await db.order.findUnique({ where: { id } });
        if (!currentOrder) throw new TRPCError({ code: "NOT_FOUND" });

        const newShippingCost =
          data.shippingCost ?? currentOrder.shippingCost ?? 0;
        const newTax = data.tax ?? currentOrder.tax ?? 0;
        const total = currentOrder.subTotal + newShippingCost + newTax;

        return db.order.update({
          where: { id },
          data: {
            ...data,
            shippingCost: newShippingCost,
            tax: newTax,
            total,
          },
        });
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.order.delete({ where: { id: input.id } })
    ),

  getAllOrder: adminProcedure
    .input(getOrdersInputSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, sortBy, sortOrder, search, filters } = input;

      // Initialize where conditions array
      const conditions: Prisma.OrderWhereInput[] = [];

      // Add search conditions if search is provided
      if (search) {
        conditions.push({
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        });
      }

      // Add status filter
      if (filters?.status) {
        conditions.push({ status: filters.status });
      }

      // Add payment status filter
      if (filters?.paymentStatus) {
        conditions.push({
          payment: { status: filters.paymentStatus },
        });
      }

      // Add payment method filter
      if (filters?.paymentMethod) {
        conditions.push({
          payment: { method: filters.paymentMethod },
        });
      }

      // Add total amount range filter
      if (filters?.minTotal !== undefined) {
        conditions.push({ total: { gte: filters.minTotal } });
      }
      if (filters?.maxTotal !== undefined) {
        conditions.push({ total: { lte: filters.maxTotal } });
      }

      // Add date range filter
      if (filters?.dateFrom) {
        conditions.push({ createdAt: { gte: filters.dateFrom } });
      }
      if (filters?.dateTo) {
        conditions.push({ createdAt: { lte: filters.dateTo } });
      }

      // Add user filter
      if (filters?.userId) {
        conditions.push({ userId: filters.userId });
      }

      // Build the final where clause
      const where: Prisma.OrderWhereInput =
        conditions.length > 0 ? { AND: conditions } : {};

      // Get total count for pagination
      const total = await ctx.db.order.count({ where });

      // Get orders with pagination, sorting, and includes
      const orders = await ctx.db.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  description: true,
                  image: true,
                },
              },
              productVariation: {
                select: {
                  size: true,
                  color: true,
                  price: true,
                  image: true,
                },
              },
            },
          },
          payment: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      // Get statistics for filters
      const [orderStats, paymentStats] = await Promise.all([
        ctx.db.order.groupBy({
          by: ["status"],
          _count: true,
        }),
        ctx.db.payment.groupBy({
          by: ["status"],
          _count: true,
        }),
      ]);

      // Calculate price range
      const priceRange = await ctx.db.order.aggregate({
        _min: { total: true },
        _max: { total: true },
      });

      return {
        orders,
        metadata: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasNextPage: page * pageSize < total,
          hasPreviousPage: page > 1,
        },
        filters: {
          orderStatuses: orderStats.map((stat) => ({
            status: stat.status,
            count: stat._count,
          })),
          paymentStatuses: paymentStats.map((stat) => ({
            status: stat.status,
            count: stat._count,
          })),
          priceRange: {
            min: priceRange._min.total,
            max: priceRange._max.total,
          },
          paymentMethods: Object.values(PaymentMethod),
        },
      };
    }),

  getOrderById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.order.findUnique({
        where: { id: input.id },
        include: { items: true },
      })
    ),

  getSellerOrders: sellerProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).default(10),
        status: z.nativeEnum(OrderStatus).optional(),
        paymentStatus: z.nativeEnum(PaymentStatus).optional(),
        paymentMethod: z.nativeEnum(PaymentMethod).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, status, paymentStatus, paymentMethod } = input;
      const skip = (page - 1) * pageSize;

      const sellerId = ctx.session.user.id;

      // Find the shop that belongs to this seller
      const shop = await ctx.db.shop.findFirst({
        where: { ownerId: sellerId },
        select: { id: true },
      });

      if (!shop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Seller does not own a shop",
        });
      }

      // Build where clause for order items
      const whereClause: Prisma.OrderItemWhereInput = {
        product: {
          shopId: shop.id,
        },
        ...(status && {
          order: {
            status,
            ...(paymentStatus || paymentMethod
              ? {
                  payment: {
                    ...(paymentStatus && { status: paymentStatus }),
                    ...(paymentMethod && { method: paymentMethod }),
                  },
                }
              : {}),
          },
        }),
        ...(!status &&
          (paymentStatus || paymentMethod) && {
            order: {
              payment: {
                ...(paymentStatus && { status: paymentStatus }),
                ...(paymentMethod && { method: paymentMethod }),
              },
            },
          }),
      };

      // Get total count of orders
      const total = await ctx.db.orderItem.count({
        where: whereClause,
      });

      // Get order status statistics
      const orderStats = await ctx.db.order.groupBy({
        by: ["status"],
        where: {
          items: {
            some: {
              product: {
                shopId: shop.id,
              },
            },
          },
        },
        _count: {
          _all: true,
        },
      });

      // Get payment status statistics
      const paymentStats = await ctx.db.payment.groupBy({
        by: ["status"],
        where: {
          order: {
            items: {
              some: {
                product: {
                  shopId: shop.id,
                },
              },
            },
          },
        },
        _count: {
          _all: true,
        },
      });

      // Get price range
      const priceRange = await ctx.db.orderItem.aggregate({
        where: whereClause,
        _min: {
          totalPrice: true,
        },
        _max: {
          totalPrice: true,
        },
      });

      // Fetch paginated orders
      const orders = await ctx.db.orderItem.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: {
          order: {
            createdAt: "desc",
          },
        },
        select: {
          id: true,
          quantity: true,
          totalPrice: true,
          order: {
            select: {
              createdAt: true,
              status: true,
              payment: {
                select: {
                  id: true,
                  status: true,
                  method: true,
                },
              },
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              shopId: true,
            },
          },
          productVariation: {
            select: {
              id: true,
              image: true,
              size: true,
              color: true,
              price: true,
            },
          },
        },
      });

      return {
        orders,
        metadata: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasNextPage: page * pageSize < total,
          hasPreviousPage: page > 1,
        },
        filters: {
          orderStatuses: orderStats.map((stat) => ({
            status: stat.status,
            count: stat._count._all,
          })),
          paymentStatuses: paymentStats.map((stat) => ({
            status: stat.status,
            count: stat._count._all,
          })),
          priceRange: {
            min: priceRange._min.totalPrice ?? 0,
            max: priceRange._max.totalPrice ?? 0,
          },
          paymentMethods: Object.values(PaymentMethod),
        },
      };
    }),
});

export default orderRouter;
