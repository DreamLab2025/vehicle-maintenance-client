import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "auth-token";

// Các route auth
const authRoutes = ["/login", "/register", "/forgot-password"];
const publicRoutes = ["/", "/properties"]; // home public (admin vẫn vào được)

// Các route cần login
const needAuthPrefixes = ["/messages", "/hosting", "/saler"];

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const hasToken = !!token && !isExpired(token);
  const role = getRoleFromToken(token);

  // 1) Nếu vào trang auth mà đã login => đá về đúng nơi theo role
  const isAuthRoute = authRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL(redirectByRole(role), request.url));
  }

  // 2) Admin-only routes
  const isAdminRoute = pathname === adminPrefix || pathname.startsWith(`${adminPrefix}/`);
  if (isAdminRoute) {
    if (!hasToken) return NextResponse.redirect(new URL("/login", request.url));
    if (role !== "Admin") return NextResponse.redirect(new URL("/", request.url));
  }

  // 3) Routes cần login (messages/hosting/saler)
  const needAuth = needAuthPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (needAuth && !hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4) Home/public routes: ai cũng vào được, admin cũng vào được
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|fonts|assets).*)"],
};
