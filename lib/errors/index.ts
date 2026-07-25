export function getFriendlyErrorMessage(code: string, fallback: string): string {
  const messages: Record<string, string> = {
    // Signup
    over_email_send_rate_limit:
      "Too many attempts have been made. Please wait a bit and try again (after a while).",
    user_already_exists:
      "The email address has already been used. Try logging in.",
    weak_password:
      "The password is too simple. Use at least 6 characters.",
    invalid_email:
      "The email address is not valid. Check it again.",

    // Login
    invalid_credentials:
      "Incorrect email or password. Please try again.",
    email_not_confirmed:
      "Please confirm your email before logging in.",
    over_request_rate_limit:
      "Too many login attempts. Please wait a bit and try again.",
    user_banned:
      "This account has been suspended. Contact support for help.",
  };

  return messages[code] || fallback;
}