import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const members = await sql`
      SELECT 
        id,
        family_code,
        name,
        role,
        user_id,
        created_at
      FROM family_members
      ORDER BY id ASC;
    `;

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error loading members:", error);
    return NextResponse.json({ error: "Failed to load members" }, { status: 500 });
  }
}
