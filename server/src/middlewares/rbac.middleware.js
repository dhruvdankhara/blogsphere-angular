import { ApiError } from "../utils/ApiError.js";

/**
 * Role-based access control middleware.
 * Must be used AFTER verifyJWT so req.user is populated.
 *
 * Usage: verifyRole("ADMIN") or verifyRole("ADMIN", "MODERATOR")
 */
export const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Required role: ${roles.join(" or ")}`
      );
    }

    next();
  };
};
