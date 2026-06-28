"use client";

import { useEffect, useState } from "react";

type Family = {
  id: number;
  family_code: string;
  items_count: number;
  stores_count: number;
  created_at: string;
  is_active: boolean;
};

export default function AdminUI() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  const [renameOld, setRenameOld] = useState("");
  const [renameNew, setRenameNew] = useState("");

  // Load families
  const loadFamilies = async () => {
    const res = await fetch("/api/getFamilies");
    const data = await res.json();
    setFamilies(data.families);
    setLoading(false);
  };

  useEffect(() => {
    loadFamilies();
  }, []);

  // Delete family
  const deleteFamily = async (family_code: string) => {
    const ok = window.confirm(`⚠️ Delete family "${family_code}" ?`);
    if (!ok) return;

    await fetch("/api/deleteFamily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ family_code }),
    });

    loadFamilies();
  };

  // Rename family
  const renameFamily = async () => {
    if (!renameOld.trim() || !renameNew.trim()) return;

    await fetch("/api/renameFamily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        old_code: renameOld.trim(),
        new_code: renameNew.trim(),
      }),
    });

    setRenameOld("");
    setRenameNew("");
    loadFamilies();
  };

  // Toggle active
  const toggleActive = async (family_code: string, is_active: boolean) => {
    await fetch("/api/toggleFamilyActive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        family_code,
        is_active: !is_active,
      }),
    });

    loadFamilies();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* ΕΔΩ ΜΠΑΙΝΕΙ ΟΛΟ ΤΟ UI ΠΟΥ ΕΙΧΕΣ */}
      </div>
    </div>
  );
}
