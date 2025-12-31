
export function validateUsername(username?: string): string | null {
  if (!username || username.trim().length === 0) {
    return "Username is required";
  }

  if (username.trim().length < 3) {
    return "Username must be at least 3 characters";
  }

  return null;
}

export function validateEmail(email?: string): string | null {
  if (!email || email.trim().length === 0) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return "Invalid email format";
  }

  return null;
}

export function validatePassword(password?: string): string | null {
  if (!password || password.trim().length === 0) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}

export function validatePasswordRepeat(
  password?: string,
  repeat?: string
): string | null {
  if (password !== repeat) {
    return "Passwords do not match";
  }

  return null;
}
