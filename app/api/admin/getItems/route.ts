import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const items = await sql`
      SELECT 
        id,
        family_code,
        name,
        quantity,
        is_checked,
        store_id,
        created_at
      FROM items
      ORDER BY id DESC;
    `;

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error loading items:", error);
    return NextResponse.json({ error: "Failed to load items" }, { status: 500 });
  }
}
