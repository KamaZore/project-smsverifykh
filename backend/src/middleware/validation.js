import { BadRequestError } from "../errors/AppError.js";

export default function validate(schema, source = "query") {
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return next(new BadRequestError("Validation failed", details));
    }

    req.validated = req.validated || {};
    req.validated[source] = value;
    next();
  };
}
