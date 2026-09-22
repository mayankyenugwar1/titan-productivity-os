import { safeISOString } from "@/utils/safeDate";

export interface FriendlyAuthResult {
  message: string;
  code: string;
  isRateLimit: boolean;
  isNetworkError: boolean;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***@***.***";
  const [user, domain] = email.split("@");
  const maskedUser = user.length > 2 ? `${user.substring(0, 2)}***` : `${user}***`;
  return `${maskedUser}@${domain}`;
}

export function logAuthTechnicalError(action: string, error: unknown, email?: string): void {
  const timestamp = safeISOString(new Date());
  const safeEmail = email ? maskEmail(email) : "N/A";
  
  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    console.error(`[TITAN AUTH TELEMETRY] [${timestamp}] [ACTION: ${action}] [EMAIL: ${safeEmail}]`, {
      message: err.message || "Unknown error message",
      code: err.code || err.status || "NO_CODE",
      status: err.status || "NO_STATUS",
      name: err.name || "Error",
      error_description: err.error_description || "N/A",
      stack: err.stack,
    });
  } else {
    console.error(`[TITAN AUTH TELEMETRY] [${timestamp}] [ACTION: ${action}] [EMAIL: ${safeEmail}]`, error);
  }
}

export function parseAuthError(error: unknown, emailContext?: string): FriendlyAuthResult {
  logAuthTechnicalError("AUTH_FAILURE", error, emailContext);

  if (!error) {
    return {
      message: "An unexpected authentication error occurred.",
      code: "UNKNOWN_NULL",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  const errObj = typeof error === "object" ? (error as Record<string, unknown>) : {};
  const rawMsg = String(errObj.message || errObj.error_description || error || "").trim();
  const msg = rawMsg.toLowerCase();
  const status = Number(errObj.status || 0);
  const code = String(errObj.code || "").toLowerCase();

  // 1. Email Not Confirmed / Verification Pending
  if (
    code === "email_not_confirmed" ||
    msg.includes("email not confirmed") ||
    msg.includes("requires email verification") ||
    msg.includes("confirmation link")
  ) {
    return {
      message: "Please verify your email address before signing in. Check your email inbox for the verification link.",
      code: "EMAIL_NOT_CONFIRMED",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 2. Email Rate Limit Exceeded (HTTP 429 / Supabase Auth Rate Limit)
  if (
    status === 429 ||
    code === "over_email_send_rate_limit" ||
    code === "rate_limit_exceeded" ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    msg.includes("email rate limit exceeded") ||
    msg.includes("limit reached") ||
    msg.includes("authentication limit")
  ) {
    return {
      message: "Too many authentication attempts. Please wait 5 minutes and try again.",
      code: "RATE_LIMIT_EXCEEDED",
      isRateLimit: true,
      isNetworkError: false,
    };
  }

  // 3. Email Already Registered / Duplicate Account
  if (
    code === "user_already_exists" ||
    msg.includes("already registered") ||
    msg.includes("already exists") ||
    msg.includes("user already registered")
  ) {
    return {
      message: "An account with this email address already exists. Please sign in instead.",
      code: "USER_ALREADY_EXISTS",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 4. Invalid Login Credentials / Incorrect Password / Invalid Grant
  if (
    code === "invalid_credentials" ||
    code === "invalid_grant" ||
    msg.includes("invalid login credentials") ||
    msg.includes("invalid email or password") ||
    msg.includes("invalid credentials") ||
    msg.includes("invalid grant")
  ) {
    return {
      message: "Invalid email address or security passcode. Please check your credentials and try again.",
      code: "INVALID_CREDENTIALS",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 5. User Not Found
  if (
    code === "user_not_found" ||
    msg.includes("user not found") ||
    msg.includes("no user found")
  ) {
    return {
      message: "No registered account found with this email address. Please register first.",
      code: "USER_NOT_FOUND",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 6. Invalid Email Format
  if (
    code === "validation_failed" ||
    msg.includes("invalid email") ||
    msg.includes("email is invalid") ||
    msg.includes("unable to validate email")
  ) {
    return {
      message: "Please enter a valid email address (e.g. operator@titan.os).",
      code: "INVALID_EMAIL",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 7. Weak Password / Passcode Criteria
  if (
    code === "weak_password" ||
    msg.includes("password should be at least") ||
    msg.includes("weak password") ||
    msg.includes("password is too short")
  ) {
    return {
      message: "Security passcode must be at least 6 characters long.",
      code: "WEAK_PASSWORD",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 8. Network Failure / Disconnected (only when no HTTP response status was received)
  if (
    status === 0 &&
    (!navigator.onLine ||
      msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("network error") ||
      msg.includes("err_name_not_resolved") ||
      msg.includes("enotfound"))
  ) {
    return {
      message: "Network connection error. TITAN could not reach the authentication service. Please check your internet connection.",
      code: "NETWORK_ERROR",
      isRateLimit: false,
      isNetworkError: true,
    };
  }

  // 9. Timeout / Service Unavailable (500, 502, 503, 504)
  if (status >= 500 || msg.includes("timeout") || msg.includes("gateway")) {
    return {
      message: "Authentication service is temporarily unavailable. Please try again in a moment.",
      code: "SERVICE_UNAVAILABLE",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  // 10. Direct Supabase Message Fallback (No generic masking if Supabase returned a clear message)
  if (rawMsg && rawMsg.length > 3) {
    return {
      message: rawMsg,
      code: code || "SUPABASE_AUTH_ERROR",
      isRateLimit: false,
      isNetworkError: false,
    };
  }

  return {
    message: "An unexpected error occurred during authentication. Please try again.",
    code: "UNEXPECTED_ERROR",
    isRateLimit: false,
    isNetworkError: false,
  };
}
