import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "auth-token";
const SUPPORTED_LOCALES = ["vi", "en"] as const;
const DEFAULT_LOCALE = "vi";

// Các route auth
const authRoutes = ["/login", "/register", "/forgot-password"];

// Các route cần login
const needAuthPrefixes = ["/maintenance"];

// Admin-only
const adminPrefix = "/admin";

type JwtPayload = {
  role?: string | string[];
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return {};
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function getRoleFromToken(token?: string): string | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const r = payload.role;
  return Array.isArray(r) ? r[0] ?? null : r ?? null;
}

function isExpired(token?: string) {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload.exp) return false; // nếu token không có exp thì bỏ qua
  return payload.exp * 1000 < Date.now();
}

function redirectByRole(role: string | null) {
  if (role === "Admin") return "/admin/dashboard";
  if (role === "Saler") return "/hosting";
  return "/"; // hoặc "/properties"
}

function detectLocale(pathname: string) {
  const [, firstSegment] = pathname.split("/");
  if (SUPPORTED_LOCALES.includes(firstSegment as (typeof SUPPORTED_LOCALES)[number])) {
    return firstSegment as (typeof SUPPORTED_LOCALES)[number];
  }
  return null;
}

function stripLocalePrefix(pathname: string, locale: string | null) {
  if (!locale) return pathname;
  const withoutLocale = pathname.replace(new RegExp(`^/${locale}`), "");
  return withoutLocale || "/";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = detectLocale(pathname);

  // Ensure all business routes are locale-prefixed.
  if (!locale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  const localizedPathname = stripLocalePrefix(pathname, locale);

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const hasToken = !!token && !isExpired(token);
  const role = getRoleFromToken(token);

  // 1) Nếu vào trang auth mà đã login => đá về đúng nơi theo role
  const isAuthRoute = authRoutes.some(
    (r) => localizedPathname === r || localizedPathname.startsWith(`${r}/`)
  );
  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL(`/${locale}${redirectByRole(role)}`, request.url));
  }

  // 2) Admin-only routes
  const isAdminRoute =
    localizedPathname === adminPrefix || localizedPathname.startsWith(`${adminPrefix}/`);
  if (isAdminRoute) {
    if (!hasToken) return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    if (role !== "Admin") return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // 3) Routes cần login (messages/hosting/saler)
  const needAuth = needAuthPrefixes.some(
    (p) => localizedPathname === p || localizedPathname.startsWith(`${p}/`)
  );
  if (needAuth && !hasToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // 4) Home route: cần token, nếu không có token => redirect về login
  if (localizedPathname === "/" && !hasToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // 5) Public routes: ai cũng vào được
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|fonts|assets).*)"],
};
