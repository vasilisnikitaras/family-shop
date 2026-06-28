import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { family_code, family_password } = await req.json();

    if (!family_code || !family_password) {
      return NextResponse.json(
        { success: false, message: "Missing family code or password" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if family exists
    const existing = await sql`
      SELECT * FROM families WHERE family_code = ${family_code};
    `;

    // 2️⃣ If exists → verify password
    if (existing.length > 0) {
      const fam = existing[0];

      if (fam.family_password !== family_password) {
        return NextResponse.json(
          { success: false, message: "Wrong password" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Login successful",
        family: fam,
      });
    }

    // 3️⃣ If not exists → auto-create
    const created = await sql`
      INSERT INTO families (name, family_code, family_password)
      VALUES ('Family', ${family_code}, ${family_password})
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Family created & logged in",
      family: created[0],
    });
  } catch (err) {
    console.error("❌ loginFamily error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
