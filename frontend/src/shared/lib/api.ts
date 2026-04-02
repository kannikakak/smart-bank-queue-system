const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const ACCESS_TOKEN_KEY = "smartq.accessToken";
const ROLE_STORAGE_KEY = "smartq.role";
const DISPLAY_NAME_STORAGE_KEY = "smartq.displayName";
const AUTH_STORAGE_KEYS = [
  ACCESS_TOKEN_KEY,
  ROLE_STORAGE_KEY,
  DISPLAY_NAME_STORAGE_KEY,
] as const;

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  displayName: string;
};

export type BranchSummary = {
  id: number;
  name: string;
  address: string;
  openingHours: string;
  activeCounters: number;
};

export type ServiceSummary = {
  id: number;
  name: string;
  durationMinutes: number;
  appointmentRequired: boolean;
};

export type AppointmentSummary = {
  id: number;
  branch: string;
  service: string;
  scheduledAt: string;
  status: string;
};

export type CreateAppointmentPayload = {
  branchId: number;
  serviceId: number;
  startTime: string;
};

export type AvailableSlotSummary = {
  startTime: string;
  endTime: string;
  remainingCapacity: number;
};

export type AdminOverview = {
  metrics: Record<string, string>;
  peakHours: string[];
  topServices: string[];
};

export type AdminAppointmentSummary = {
  id: number;
  customerName: string;
  customerEmail: string;
  branch: string;
  service: string;
  scheduledAt: string;
  endsAt: string;
  status: string;
  assignedStaff: string | null;
};

export type AdminNotificationSummary = {
  id: number;
  appointmentId: number;
  customerName: string;
  branch: string;
  service: string;
  type: string;
  status: string;
  createdAt: string;
};

export type StaffQueueTicket = {
  appointmentId: number;
  ticketNumber: string;
  branch: string;
  customerName: string;
  service: string;
  scheduledAt: string;
  status: string;
  assignedStaff: string | null;
  estimatedCallTime: string | null;
};

export type StaffAppointmentDetail = {
  id: number;
  customerName: string;
  customerEmail: string;
  branch: string;
  service: string;
  status: string;
  assignedStaff: string | null;
  scheduledAt: string;
  endsAt: string;
  checkedInAt: string | null;
  serviceStartAt: string | null;
  serviceEndAt: string | null;
};

type ApiRequestOptions = {
  method?: string;
  body?: string;
  token?: string;
};

function readStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.sessionStorage.getItem(ACCESS_TOKEN_KEY) ??
    window.localStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

function readStoredValue(key: (typeof AUTH_STORAGE_KEYS)[number]) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
}

function readTextSafely(response: Response) {
  return response.text().catch(() => "");
}

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const headers = new Headers();

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Backend is not reachable at http://localhost:8080. Start the Spring Boot server first.",
    );
  }

  if (!response.ok) {
    const message = await readTextSafely(response);

    if (response.status === 401) {
      throw new Error("Your session expired. Sign in again.");
    }

    if (response.status === 403) {
      throw new Error("This account cannot access admin data. Sign in with an admin account.");
    }

    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

function requireAccessToken(token?: string) {
  const resolvedToken = token ?? readStoredAccessToken();

  if (!resolvedToken) {
    throw new Error("Sign in first to load protected data.");
  }

  return resolvedToken;
}

export function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  AUTH_STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });
}

export function readStoredDisplayName() {
  return readStoredValue(DISPLAY_NAME_STORAGE_KEY);
}

export function readStoredRole() {
  return readStoredValue(ROLE_STORAGE_KEY);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getBranches() {
  return apiRequest<BranchSummary[]>("/api/v1/branches");
}

export async function getServices() {
  return apiRequest<ServiceSummary[]>("/api/v1/services");
}

export async function getCustomerAppointments(token?: string) {
  return apiRequest<AppointmentSummary[]>("/api/v1/customer/appointments", {
    token: requireAccessToken(token),
  });
}

export async function createCustomerAppointment(
  payload: CreateAppointmentPayload,
  token?: string,
) {
  return apiRequest<AppointmentSummary>("/api/v1/customer/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
    token: requireAccessToken(token),
  });
}

export async function getCustomerAvailability(
  branchId: number,
  serviceId: number,
  date: string,
) {
  const search = new URLSearchParams({
    branchId: String(branchId),
    serviceId: String(serviceId),
    date,
  });

  return apiRequest<AvailableSlotSummary[]>(
    `/api/v1/customer/appointments/availability?${search.toString()}`,
    {
      token: requireAccessToken(),
    },
  );
}

export async function getAdminOverview(token?: string) {
  return apiRequest<AdminOverview>("/api/v1/admin/overview", {
    token: requireAccessToken(token),
  });
}

export async function getAdminAppointments(token?: string) {
  return apiRequest<AdminAppointmentSummary[]>("/api/v1/admin/appointments", {
    token: requireAccessToken(token),
  });
}

export async function getAdminNotifications(token?: string) {
  return apiRequest<AdminNotificationSummary[]>("/api/v1/admin/notifications", {
    token: requireAccessToken(token),
  });
}

export async function getAdminUnreadNotificationCount(token?: string) {
  return apiRequest<{ unreadCount: number }>("/api/v1/admin/notifications/unread-count", {
    token: requireAccessToken(token),
  });
}

export async function markAdminNotificationRead(notificationId: number, token?: string) {
  return apiRequest<null>(`/api/v1/admin/notifications/${notificationId}/read`, {
    method: "PATCH",
    token: requireAccessToken(token),
  });
}

export async function getStaffQueue(token?: string) {
  return apiRequest<StaffQueueTicket[]>("/api/v1/staff/queue", {
    token: requireAccessToken(token),
  });
}

export async function getStaffAppointmentDetail(appointmentId: number, token?: string) {
  return apiRequest<StaffAppointmentDetail>(`/api/v1/staff/queue/${appointmentId}`, {
    token: requireAccessToken(token),
  });
}

export async function checkInStaffAppointment(appointmentId: number, token?: string) {
  return apiRequest<StaffAppointmentDetail>(`/api/v1/staff/queue/${appointmentId}/check-in`, {
    method: "PATCH",
    token: requireAccessToken(token),
  });
}

export async function startStaffAppointment(appointmentId: number, token?: string) {
  return apiRequest<StaffAppointmentDetail>(`/api/v1/staff/queue/${appointmentId}/start`, {
    method: "PATCH",
    token: requireAccessToken(token),
  });
}

export async function completeStaffAppointment(appointmentId: number, token?: string) {
  return apiRequest<StaffAppointmentDetail>(`/api/v1/staff/queue/${appointmentId}/complete`, {
    method: "PATCH",
    token: requireAccessToken(token),
  });
}
