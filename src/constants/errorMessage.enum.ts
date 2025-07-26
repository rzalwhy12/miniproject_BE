export enum ErrorMsg {
  // General
  INTERNAL_SERVER_ERROR = "Internal server error",
  ROUTE_NOT_FOUND = "Route not found",

  // Auth
  EMAIL_ALREADY_USED = "Email already used",
  USERNAME_ALREADY_USED = "Username already used",
  INVALID_EMAIL_OR_PASSWORD = "Invalid email or password",
  UNAUTHORIZED = "Unauthorized access",
  TOKEN_NOT_FOUND = "Token not found",
  TOKEN_INVALID = "Invalid token",
  TOKEN_EXPIRED = "Token expired",
  TOKEN_NOT_PROVIDED = "no token provided",
  INVALID_INPUT = "Invalid input data",
  MISSING_QUERY_PARAMETERS = "Missing query parameters",
  SERVER_MISSING_SECRET_KEY = "server error missing secret key",
}
