export type SmartQRole = "CUSTOMER" | "STAFF" | "ADMIN";

export type SmartQSession = {
  accessToken: string;
  role: SmartQRole;
  displayName: string;
  email: string;
};

const sessionKeys = {
  accessToken: "smartq.accessToken",
  role: "smartq.role",
  displayName: "smartq.displayName",
  email: "smartq.email",
} as const;

function isRole(value: string | null): value is SmartQRole {
  return value === "CUSTOMER" || value === "STAFF" || value === "ADMIN";
}

export function saveSession(session: SmartQSession) {
  localStorage.setItem(sessionKeys.accessToken, session.accessToken);
  localStorage.setItem(sessionKeys.role, session.role);
  localStorage.setItem(sessionKeys.displayName, session.displayName);
  localStorage.setItem(sessionKeys.email, session.email);
}

export function clearSession() {
  localStorage.removeItem(sessionKeys.accessToken);
  localStorage.removeItem(sessionKeys.role);
  localStorage.removeItem(sessionKeys.displayName);
  localStorage.removeItem(sessionKeys.email);
}

export function readSession(): SmartQSession | null {
  const accessToken = localStorage.getItem(sessionKeys.accessToken);
  const role = localStorage.getItem(sessionKeys.role);
  const displayName = localStorage.getItem(sessionKeys.displayName);
  const email = localStorage.getItem(sessionKeys.email);

  if (!accessToken || !displayName || !email || !isRole(role)) {
    return null;
  }

  return {
    accessToken,
    role,
    displayName,
    email,
  };
}
