const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

async function baseRequest(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ msg: res.statusText }));
    throw new Error(
      error?.msg || error?.message || `Request failed: ${res.status}`,
    );
  }

  return res;
}

// Wrapper javobdan data ni avtomatik chiqaradi
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await baseRequest(path, options);
  const json: ApiResponse<T> = await res.json();
  return json.data;
}

// To'liq javobni qaytaradi (login uchun)
export async function apiFetchRaw<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await baseRequest(path, options);
  return res.json();
}
