import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing store name" },
        { status: 400 }
      );
    }

    const storeName = name.trim();

    // 🔥 Read family credentials from headers
    const familyCode = request.headers.get("x-family-code");
    const familyPassword = request.headers.get("x-family-password");

    if (!familyCode || !familyPassword) {
      return NextResponse.json(
        { success: false, message: "Missing family credentials" },
        { status: 400 }
      );
    }

    // 🔥 Find family_id
    const family = await sql`
      SELECT id FROM families
      WHERE family_code = ${familyCode}
      AND family_password = ${familyPassword}
    `;

    if (family.length === 0) {
      return NextResponse.json(
        { success: false, message: "Family not found" },
        { status: 400 }
      );
    }

    const family_id = family[0].id;

    // 🔥 Check if store already exists for this family
    const existing = await sql`
      SELECT id FROM stores_v2
      WHERE store_name = ${storeName}
      AND family_id = ${family_id}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ exists: true });
    }

    // 🔥 Insert new store
    const store = await sql`
      INSERT INTO stores_v2 (store_name, family_id)
      VALUES (${storeName}, ${family_id})
      RETURNING id, store_name, family_id
    `;

    return NextResponse.json({
      success: true,
      store: store[0],
    });

  } catch (error) {
    console.error("Error adding store:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add store" },
      { status: 500 }
    );
  }
}
