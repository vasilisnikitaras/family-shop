import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const families = await sql`
      SELECT 
        f.id,
        f.family_code,
        f.created_at,
        f.is_active,
        (
          SELECT COUNT(*) 
          FROM items_v2 i 
          WHERE i.family_code = f.family_code
        ) AS items_count,
        (
          SELECT COUNT(*) 
          FROM stores_v2 s 
          WHERE s.family_code = f.family_code
        ) AS stores_count
      FROM families_v2 f
      ORDER BY f.id DESC;
    `;

    return NextResponse.json({ families });
  } catch (error) {
    console.error("Error fetching families:", error);
    return NextResponse.json(
      { error: "Failed to fetch families" },
      { status: 500 }
    );
  }
}
