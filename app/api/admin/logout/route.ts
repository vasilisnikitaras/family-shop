import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Σβήνει το admin cookie σωστά
  res.cookies.set("admin_token", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0)
  });

  return res;
}
