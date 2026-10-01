export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ShortUrl {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  clicksCount: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Click {
  createdAt: string;
  referrer: string | null;
  userAgent: string | null;
}

export interface UrlStats extends ShortUrl {
  recentClicks: Click[];
}
