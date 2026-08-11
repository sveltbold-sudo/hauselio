import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    const cookieOptions = clearAuthCookie();

    Object.entries(cookieOptions).forEach(([name, options]) => {
      response.cookies.set(name, options.value, {
        httpOnly: options.httpOnly,
        secure: options.secure,
        sameSite: options.sameSite,
        path: options.path,
        maxAge: options.maxAge,
      });
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
