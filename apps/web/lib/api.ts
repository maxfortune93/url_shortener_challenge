import type { AuthResponse, ShortUrl, UrlStats, User } from './types';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? 'http://localhost:3000';
const URLS_API_URL = process.env.NEXT_PUBLIC_URL_SHORTENER_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  baseUrl: string,
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new ApiError(message || 'Algo deu errado, tente novamente.', res.status);
  }

  return data as T;
}

export const authApi = {
  register: (input: { email: string; password: string; name?: string }) =>
    request<AuthResponse>(AUTH_API_URL, '/auth/register', { method: 'POST', body: input }),

  login: (input: { email: string; password: string }) =>
    request<AuthResponse>(AUTH_API_URL, '/auth/login', { method: 'POST', body: input }),

  me: (token: string) => request<User>(AUTH_API_URL, '/auth/me', { token }),
};

export const urlsApi = {
  create: (input: { originalUrl: string; slug?: string; expiresAt?: string }, token?: string | null) =>
    request<ShortUrl>(URLS_API_URL, '/api/urls', { method: 'POST', body: input, token }),

  list: (token: string) => request<ShortUrl[]>(URLS_API_URL, '/api/urls', { token }),

  stats: (id: string, token: string) => request<UrlStats>(URLS_API_URL, `/api/urls/${id}/stats`, { token }),

  remove: (id: string, token: string) =>
    request<void>(URLS_API_URL, `/api/urls/${id}`, { method: 'DELETE', token }),
};
