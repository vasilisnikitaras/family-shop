import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    // 1️⃣ Αφαιρούμε το store από όλα τα items
    await sql`
      UPDATE items_v2
      SET store_id = NULL
      WHERE store_id = ${id}
    `;

    // 2️⃣ Διαγράφουμε το store
    await sql`
      DELETE FROM stores_v2
      WHERE id = ${id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting store:", error);
    return Response.json(
      { error: "Failed to delete store" },
      { status: 500 }
    );
  }
}
