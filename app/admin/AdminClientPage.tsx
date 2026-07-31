"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteSafetyModal from "./DeleteSafetyModal";

// TYPES
type Family = {
  id: number;
  name: string;
  family_code: string;
  is_active: boolean;
};

type Member = {
  id: number;
  family_code: string;
  name: string;
};

type Item = {
  id: number;
  family_code: string;
  name: string;
  quantity: number;
  is_checked: boolean;
};

type Device = {
  id: number;
  family_code: string;
  device_name: string;
  last_seen: string | null;
  is_online: boolean;
};

export default function AdminClientPage() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const [darkMode, setDarkMode] = useState(false);

  const [families, setFamilies] = useState<Family[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFamily, setSelectedFamily] = useState<string>("");

  const [renameOld, setRenameOld] = useState("");
  const [renameNew, setRenameNew] = useState("");

  const [renameId, setRenameId] = useState("");
  const [renameNewCode, setRenameNewCode] = useState("");

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberFamilyCode, setNewMemberFamilyCode] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const openDeleteModal = (type: string, data: any) => {
    setDeleteType(type);
    setDeleteTarget(data);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteType("");
    setDeleteTarget(null);
  };

  const loadFamilies = async () => {
    const res = await fetch("/api/admin/getFamilies");
    const data = await res.json();
    setFamilies(data);
    setLoading(false);
  };

  const loadMembers = async () => {
    const res = await fetch("/api/admin/getMembers");
    const data = await res.json();
    setMembers(data);
  };

  const loadItems = async () => {
    const res = await fetch("/api/admin/getItems");
    const data = await res.json();
    setItems(data);
  };

const renameFamily = async () => {
  if (!renameOld.trim() || !renameNew.trim()) return;

  await fetch("/api/admin/renameFamily", {
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

const renameFamilyById = async () => {
  if (!renameId.trim() || !renameNewCode.trim()) return;

  await fetch("/api/admin/renameFamilyById", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: Number(renameId.trim()),
      new_code: renameNewCode.trim(),
    }),
  });

  setRenameId("");
  setRenameNewCode("");
  loadFamilies();
};

const toggleActive = async (familyCode: string, current: boolean) => {
  await fetch("/api/admin/toggleActive", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      family_code: familyCode,
      is_active: !current,
    }),
  });

  loadFamilies();
};

const addMember = async () => {
  if (!newMemberName.trim() || !newMemberFamilyCode.trim()) return;

  await fetch("/api/admin/addMember", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newMemberName.trim(),
      family_code: newMemberFamilyCode.trim(),
    }),
  });

  setNewMemberName("");
  setNewMemberFamilyCode("");
  loadMembers();
};

const toggleItem = async (id: number, checked: boolean, familyCode: string) => {
  await fetch("/api/admin/toggleItem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      is_checked: checked,
      family_code: familyCode,
    }),
  });

  loadItems();
};

const toggleDeviceOnline = async (
  id: number,
  online: boolean,
  familyCode: string
) => {
  await fetch("/api/admin/toggleDeviceOnline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      is_online: online,
      family_code: familyCode,
    }),
  });

  loadAllDevices();
};

const handleSoftDelete = async () => {
  if (!deleteType || !deleteTarget) return;

  await fetch("/api/admin/softDelete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: deleteType,
      id: deleteTarget.id,
    }),
  });

  loadFamilies();
  loadMembers();
  loadItems();
  loadAllDevices();

  setDeleteType(null);
  setDeleteTarget(null);
};

const handlePermanentDelete = async () => {
  if (!deleteType || !deleteTarget) return;

  await fetch("/api/admin/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: deleteType,
      id: deleteTarget.id,
    }),
  });

  loadFamilies();
  loadMembers();
  loadItems();
  loadAllDevices();

  setDeleteType(null);
  setDeleteTarget(null);
};

  const loadDevices = async () => {
    const res = await fetch(`/api/admin/getDevices?familyCode=${selectedFamily}`);
    const data = await res.json();

    const now = Date.now();

    const processed = data.map((d: Device) => {
      const last = new Date(d.last_seen || 0).getTime();
      const diff = now - last;

      return {
        ...d,
        is_online: diff < 60000,
      };
    });

    setDevices(processed);
  };

  const loadAllDevices = async () => {
    const all: any[] = [];

    for (const fam of families) {
      const res = await fetch(`/api/admin/getDevices?familyCode=${fam.family_code}`);
      const data = await res.json();

      if (!data) continue;

      if (Array.isArray(data)) {
        all.push(...data);
      } else if (Array.isArray(data.devices)) {
        all.push(...data.devices);
      }
    }

    const now = Date.now();

    const processed = all.map((d) => {
      const last = new Date(d.last_seen).getTime();
      const diff = now - last;

      return {
        ...d,
        is_online: diff < 60000,
      };
    });

    setDevices(processed);
  };

  useEffect(() => {
    loadFamilies();
    loadMembers();
    loadItems();
  }, []);

  useEffect(() => {
    if (families.length > 0) {
      loadAllDevices();
    }
  }, [families]);

  useEffect(() => {
    if (!selectedFamily || selectedFamily === "all") return;
    loadDevices();
  }, [selectedFamily]);

  const filteredMembers =
    selectedFamily === "all"
      ? members
      : members.filter((m) => m.family_code === selectedFamily);

  const filteredItems =
    selectedFamily === "all"
      ? items
      : items.filter((i) => i.family_code === selectedFamily);

  const filteredDevices = devices.filter((d) => d.is_online);
  return (
    <div className={`${darkMode ? "dark" : ""} page min-h-screen px-4 py-6`}>

      <style jsx>{`
        :root {
          --card-bg: #ffffff;
          --card-text: #1f2937;
          --table-bg: #ffffff;
          --table-text: #1f2937;
          --input-bg: #fafafa;
          --input-text: #1f2937;
          --button-bg: #7c3aed;
          --button-text: #ffffff;
        }

        .dark {
          --card-bg: #1f1f1f;
          --card-text: #e5e5e5;
          --table-bg: #1f1f1f;
          --table-text: #e5e5e5;
          --input-bg: #2a2a2a;
          --input-text: #e5e5e5;
          --button-bg: #5b21b6;
          --button-text: #ffffff;
        }

        .card {
          background: var(--card-bg);
          color: var(--card-text);
          padding: 22px;
          border-radius: 18px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
        }

        .title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 14px;
          color: var(--card-text);
        }

        .input {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          font-size: 15px;
          margin-bottom: 12px;
          background: var(--input-bg);
          color: var(--input-text);
        }

        .button {
          background: var(--button-bg);
          color: var(--button-text);
          padding: 12px 18px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .button:hover {
          background: #5b21b6;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 12px;
          overflow: hidden;
          background: var(--table-bg);
          color: var(--table-text);
        }

        .table th {
          background: #f3f4f6;
          padding: 12px;
          font-weight: 600;
          text-align: left;
          color: var(--table-text);
        }

        .table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          color: var(--table-text);
        }

        .page {
          background: #f9fafb;
        }

        .family-select {
          max-height: 150px;
          overflow-y: auto;
        }

        .family-select {
          height: 40px;
        }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-10">

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="button bg-red-600 hover:bg-red-700"
          style={{ marginBottom: "20px" }}
        >
          Log out
        </button>

        {/* SELECT FAMILY */}
        <div className="card">
          <h2 className="title">Select Family</h2>
          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            className="input w-60 family-select"
          >
            <option value="all">All families</option>
            {families.map((f) => (
              <option key={f.id} value={f.family_code}>
                {f.name} ({f.family_code})
              </option>
            ))}
          </select>
        </div>

        {/* RENAME FAMILY */}
        <div className="card">
          <h2 className="title">Rename Family</h2>
          <div className="flex gap-3">
            <input
              value={renameOld}
              onChange={(e) => setRenameOld(e.target.value)}
              placeholder="Old code"
              className="input w-40"
            />
            <input
              value={renameNew}
              onChange={(e) => setRenameNew(e.target.value)}
              placeholder="New code"
              className="input w-40"
            />
            <button onClick={renameFamily} className="button">
              Rename
            </button>
          </div>
        </div>

        {/* RENAME BY ID */}
        <div className="card">
          <h2 className="title">Rename Family (by ID)</h2>
          <div className="flex gap-3">
            <input
              value={renameId}
              onChange={(e) => setRenameId(e.target.value)}
              placeholder="Family ID"
              className="input w-40"
            />
            <input
              value={renameNewCode}
              onChange={(e) => setRenameNewCode(e.target.value)}
              placeholder="New code"
              className="input w-40"
            />
            <button onClick={renameFamilyById} className="button">
              Rename
            </button>
          </div>
        </div>

        {/* FAMILIES TABLE */}
        <div className="card">
          <h2 className="title">Families</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {families.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.name}</td>
                  <td>{f.family_code}</td>
                  <td>
                    {f.is_active ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Disabled</span>
                    )}
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => toggleActive(f.family_code, f.is_active)}
                      className="button"
                    >
                      {f.is_active ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => openDeleteModal("family", f)}
                      className="button bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD MEMBER */}
        <div className="card">
          <h2 className="title">Add Member</h2>
          <div className="flex gap-3">
            <input
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Member name"
              className="input w-40"
            />
            <input
              value={newMemberFamilyCode}
              onChange={(e) => setNewMemberFamilyCode(e.target.value)}
              placeholder="Family Code"
              className="input w-32"
            />
            <button onClick={addMember} className="button bg-green-600 hover:bg-green-700">
              Add
            </button>
          </div>
        </div>

        {/* MEMBERS TABLE */}
        <div className="card">
          <h2 className="title">Members</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Family</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.family_code}</td>
                  <td>{m.name}</td>
                  <td>
                    <button
                      onClick={() => openDeleteModal("member", m)}
                      className="button bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ITEMS TABLE */}
        <div className="card">
          <h2 className="title">Items</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Family</th>
                <th>Checked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.family_code}</td>
                  <td>
                    <button
                      onClick={() => toggleItem(item.id, !item.is_checked, item.family_code)}
                      className={`button ${item.is_checked ? "bg-green-600" : "bg-gray-500"}`}
                    >
                      {item.is_checked ? "Checked" : "Not checked"}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => openDeleteModal("item", item)}
                      className="button bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* DEVICES (LIVE) */}
        <div className="card">
          <h2 className="title">Devices (Live)</h2>

          <div className="mb-4 text-lg font-semibold">
            🟢 Online devices: {filteredDevices.length} / {devices.length}
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Family</th>
                <th>Name</th>
                <th>Last Seen</th>
                <th>Online</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDevices.map((d) => (
                <tr
                  key={d.id}
                  className={d.is_online ? "bg-green-50" : "bg-red-50"}
                >
                  <td>{d.id}</td>
                  <td>{d.family_code}</td>
                  <td>{d.device_name}</td>

                  <td>
                    {d.last_seen
                      ? new Date(d.last_seen).toLocaleString()
                      : "Never"}
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          d.is_online ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>

                      <button
                        onClick={() =>
                          toggleDeviceOnline(d.id, !d.is_online, d.family_code)
                        }
                        className={`button ${
                          d.is_online ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        {d.is_online ? "Online" : "Offline"}
                      </button>
                    </div>
                  </td>

                  <td>
                    <button
                      onClick={() => openDeleteModal("device", d)}
                      className="button bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-sm mt-10 mb-4">
          © 2026 VNF Software — Created by Vasilis Fanes Nikitaras. All Rights Reserved.
          <br />
          Unauthorized copying or resale is strictly prohibited and punishable by law.
          <br />
          Contact: vasilis.nikitaras@gmail.com
        </div>

        {/* SAFETY DELETE MODAL */}
        <DeleteSafetyModal
          open={showDeleteModal}
          onClose={closeDeleteModal}
          type={deleteType}
          data={deleteTarget}
          onSoftDelete={handleSoftDelete}
          onPermanentDelete={handlePermanentDelete}
        />
      </div>
    </div>
  );
}
}

