import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { family_code, is_active } = await req.json();

    await sql`
      UPDATE families
      SET is_active = ${is_active}
      WHERE family_code = ${family_code};
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling family active:", error);
    return NextResponse.json({ error: "Failed to toggle family active" }, { status: 500 });
  }
}
