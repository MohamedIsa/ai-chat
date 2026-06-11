export function mapAuthError(error: { code?: string; message?: string } | null): string {
  switch (error?.code) {
    case 'invalid_credentials':
      return 'Incorrect email or password.'
    case 'email_not_confirmed':
      return 'Check your email to confirm your account.'
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with this email already exists.'
    case 'weak_password':
      return 'Password must be at least 8 characters.'
    case 'over_request_rate_limit':
      return 'Too many attempts. Please wait a moment and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
