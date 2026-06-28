import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, family_code } = await request.json();

    if (!name || !family_code) {
      return Response.json(
        { error: "Missing name or family_code" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO stores_v2 (store_name, family_code)
      VALUES (${name}, ${family_code})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error adding store:", error);
    return Response.json(
      { error: "Failed to add store" },
      { status: 500 }
    );
  }
}
