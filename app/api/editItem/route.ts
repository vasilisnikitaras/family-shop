import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id, name, quantity } = await request.json();

    await sql`
      UPDATE items_v2
      SET name = ${name}, quantity = ${quantity}
      WHERE id = ${id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error editing item:", error);
    return Response.json(
      { error: "Failed to edit item" },
      { status: 500 }
    );
  }
}
