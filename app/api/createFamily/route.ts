import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { family_code } = await req.json();

    if (!family_code || family_code.trim() === "") {
      return NextResponse.json(
        { error: "Missing family_code" },
        { status: 400 }
      );
    }

    const cleanCode = family_code.trim();

    const existing = await sql`
      SELECT * FROM families WHERE family_code = ${cleanCode};
    `;

    if (existing.length > 0) {
      return NextResponse.json({
        family: existing[0],
        created: false,
      });
    }

    const result = await sql`
      INSERT INTO families (name, family_code)
      VALUES (${`Family ${cleanCode}`}, ${cleanCode})
      RETURNING *;
    `;

    return NextResponse.json({
      family: result[0],
      created: true,
    });
  } catch (err) {
    console.error("❌ createFamily error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
