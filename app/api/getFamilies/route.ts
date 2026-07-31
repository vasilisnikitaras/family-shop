import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const families = await sql`
      SELECT 
        id,
        family_id AS family_code,
        name,
        is_active
      FROM families
      ORDER BY id ASC;
    `;

    return NextResponse.json(families);
  } catch (error) {
    console.error("Error loading families:", error);
    return NextResponse.json(
      { error: "Failed to load families" },
      { status: 500 }
    );
  }
}
