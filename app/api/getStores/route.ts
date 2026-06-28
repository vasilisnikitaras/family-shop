import { sql } from "@/lib/db";

export async function POST(request: Request) {
  console.log("🔥 getStores ROUTE LOADED");

  try {
    const { family_code } = await request.json();

    const stores = await sql`
      SELECT 
        id,
        store_name AS name
      FROM stores_v2
      WHERE family_code = ${family_code}
      ORDER BY store_name ASC
    `;

    console.log("🔥 STORES RESULT:", stores);

    return Response.json({ stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return Response.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
