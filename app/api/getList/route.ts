import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { family_code } = await request.json();

    if (!family_code) {
      return Response.json({ items: [] });
    }

    // Find family_id
    const family = await sql`
      SELECT id FROM families WHERE family_code = ${family_code}
    `;

    if (family.length === 0) {
      return Response.json({ items: [] });
    }

    const family_id = family[0].id;

    // ⭐ CRITICAL FIX: return correct item fields
    const items = await sql`
      SELECT 
        id,
        name,
        quantity,
        COALESCE(is_checked, FALSE) AS is_checked,
        store_id::text
      FROM items_v2
      WHERE family_id = ${family_id}
      ORDER BY id DESC
    `;

    console.log("🔥 ITEMS FROM DB:", items); // ⭐ ΒΑΛΕ ΤΟ ΕΔΩ

    return Response.json({ items });
  } catch (error) {
    console.error("🔥 ERROR FETCHING LIST:", error);
    return Response.json(
      { error: "Failed to fetch list" },
      { status: 500 }
    );
  }
}
