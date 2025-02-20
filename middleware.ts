import NextAuth from "next-auth";
import { SIGN_IN_URL, USER_ROLE } from "@/constants";
import { authConfig } from "./server/auth/config";

// Define types for route configurations
type RoutePattern = string;

interface RouteAccess {
  PUBLIC: RoutePattern[];
  AUTHENTICATED: RoutePattern[];
  ROLE_ROUTES: {
    [key in USER_ROLE]?: RoutePattern[];
  };
}

// Define route access patterns
const ROUTE_ACCESS: RouteAccess = {
  // Public routes (no auth required)
  PUBLIC: [
    "/",
    "/auth/login",
    "/auth/register",
    "/products",
    "/product/:id",
    "/search",
    "/api/trpc/product.getProducts",
    "/api/trpc/product.getProduct",
    "/api/trpc/search",
  ],

  // Routes accessible only to authenticated users
  AUTHENTICATED: [
    "/user",
    "/user/profile",
    "/user/orders",
    "/cart",
    "/api/trpc/user",
    "/api/trpc/cart",
  ],

  // Role-specific routes
  ROLE_ROUTES: {
    [USER_ROLE.SELLER]: [
      "/seller",
      "/seller/dashboard",
      "/seller/products",
      "/seller/orders",
      "/api/trpc/seller",
    ],

    [USER_ROLE.ADMIN]: [
      "/dashboard",
      "/admin",
      "/admin/dashboard",
      "/admin/users",
      "/admin/products",
      "/api/trpc/admin",
    ],

    [USER_ROLE.SUPER_ADMIN]: [
      "/super-admin",
      "/super-admin/dashboard",
      "/super-admin/settings",
      "/api/trpc/super-admin",
    ],

    // Add empty array for USER role to satisfy TypeScript
    [USER_ROLE.USER]: [],
  },
};

const { auth } = NextAuth(authConfig);

// Helper function to check if path matches route pattern
const matchRoute = (path: string, pattern: string): boolean => {
  const regex = pattern
    .replace(/:[^/]+/g, "[^/]+")
    .replace(/\//g, "\\/")
    .replace(/\./g, "\\.");
  return new RegExp(`^${regex}$`).test(path);
};

// Helper function to check if a route is accessible to a role
const isRouteAccessibleToRole = (
  path: string,
  userRoles: USER_ROLE[],
  isAuthenticated: boolean
): boolean => {
  // Check public routes
  if (ROUTE_ACCESS.PUBLIC.some((route: string) => matchRoute(path, route))) {
    return true;
  }

  // If not authenticated, only allow public routes
  if (!isAuthenticated) {
    return false;
  }

  // Check authenticated routes
  if (
    ROUTE_ACCESS.AUTHENTICATED.some((route: string) => matchRoute(path, route))
  ) {
    return true;
  }

  // Check role-specific routes
  return userRoles.some((role: USER_ROLE) => {
    const roleRoutes = ROUTE_ACCESS.ROLE_ROUTES[role];
    if (!roleRoutes) return false;

    // Super admin can access all routes
    if (role === USER_ROLE.SUPER_ADMIN) return true;

    // Admin can access seller and user routes
    if (
      role === USER_ROLE.ADMIN &&
      ROUTE_ACCESS.ROLE_ROUTES[USER_ROLE.SELLER]
    ) {
      const adminAccessibleRoutes = [
        ...(ROUTE_ACCESS.ROLE_ROUTES[USER_ROLE.SELLER] || []),
        ...roleRoutes,
      ];
      return adminAccessibleRoutes.some((route: string) =>
        matchRoute(path, route)
      );
    }

    // Check routes for the specific role
    return roleRoutes.some((route: string) => matchRoute(path, route));
  });
};

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Get authentication status and roles
  const isAuthenticated = !!req.auth;
  const userRoles = (req.auth?.user?.role as USER_ROLE[]) || [];

  // Skip middleware for static files and resources
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.includes(".") ||
    path === '/404' // Skip middleware for 404 page

  ) {
    return undefined;
  }

  // Check if the route is accessible
  const canAccess = isRouteAccessibleToRole(path, userRoles, isAuthenticated);

  if (!canAccess) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return Response.redirect(new URL(SIGN_IN_URL, req.url));
    }
    // If authenticated but unauthorized, redirect to unauthorized page
    return Response.redirect(new URL("/404", req.url));
  }

  return undefined;
});

// Matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * But include:
     * - api/trpc (tRPC endpoints)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    "/api/trpc/:path*",
  ],
};
