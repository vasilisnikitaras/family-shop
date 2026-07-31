import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, new_code } = await req.json();

    if (!id || !new_code) {
      return NextResponse.json(
        { error: "Missing id or new_code" },
        { status: 400 }
      );
    }

    await sql`
      UPDATE families_v2
      SET family_code = ${new_code}
      WHERE id = ${id};
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
