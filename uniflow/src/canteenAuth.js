const STORAGE_KEY = "canteen.auth.user";
const ADMIN_EMAIL = "heshanhasitha103@gmail.com";
const ADMIN_PASS = "hasitha123";

const readUser = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export function loginCanteenAdmin(email, password) {
  if (typeof window === "undefined") {
    return null;
  }
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (
    normalizedEmail === ADMIN_EMAIL &&
    typeof password === "string" &&
    password === ADMIN_PASS
  ) {
    const user = {
      email: ADMIN_EMAIL,
      displayName: "Heshan Hasitha",
      role: "canteen-admin",
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      // ignore write errors
    }
    return user;
  }
  return null;
}

export function getCanteenAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }
  return readUser();
}

export function isCanteenAdmin() {
  const user = getCanteenAuthUser();
  return Boolean(user && user.role === "canteen-admin");
}

export function logoutCanteenAdmin() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // ignore
  }
}

// Optional helper for convenience
export function currentCanteenUser() {
  return getCanteenAuthUser();
}
