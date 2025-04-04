export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
  SELLER: "seller",
  SUPER_ADMIN: "super_admin",
} as const;

export type USER_ROLE = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const SIGN_IN_URL = "/api/auth/signin";
export const SIGN_OUT_URL = "/api/auth/signout";
