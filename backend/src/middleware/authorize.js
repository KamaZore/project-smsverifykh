import { ForbiddenError } from "../errors/AppError.js";

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required"));
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }
    next();
  };
}
