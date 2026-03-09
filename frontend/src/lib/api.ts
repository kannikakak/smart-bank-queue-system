const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  displayName: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Login failed");
  }

  return response.json() as Promise<AuthResponse>;
}

