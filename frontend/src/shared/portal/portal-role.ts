export type PortalRole = "customer" | "admin" | "staff";

export function parsePortalRole(role: unknown): PortalRole {
  if (role === "admin" || role === "staff" || role === "customer") {
    return role;
  }

  return "customer";
}

export function getPortalProfileLabel(role: PortalRole) {
  if (role === "admin") {
    return "A";
  }

  if (role === "staff") {
    return "S";
  }

  return "C";
}
