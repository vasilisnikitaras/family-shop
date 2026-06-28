import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { old_code, new_code } = await request.json();

    if (!old_code || !new_code) {
      return NextResponse.json(
        { error: "Missing old_code or new_code" },
        { status: 400 }
      );
    }

    // Update items
    await sql`
      UPDATE items_v2
      SET family_code = ${new_code}
      WHERE family_code = ${old_code};
    `;

    // Update stores
    await sql`
      UPDATE stores_v2
      SET family_code = ${new_code}
      WHERE family_code = ${old_code};
    `;

    // Update family record
    await sql`
      UPDATE families_v2
      SET family_code = ${new_code}
      WHERE family_code = ${old_code};
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error renaming family:", error);
    return NextResponse.json(
      { error: "Failed to rename family" },
      { status: 500 }
    );
  }
}
