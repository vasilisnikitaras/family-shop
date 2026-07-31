"use client";

import { useEffect, useState } from "react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);

  const loadDevices = async () => {
  const res = await fetch("/api/getDevices");
  const data = await res.json();
  setDevices(data || []);   // ← ΑΥΤΟ ΕΔΩ
};


  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Devices (Live)</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Device</th>
            <th className="p-2 border">Family</th>
            <th className="p-2 border">Last Seen</th>
            <th className="p-2 border">Online</th>
          </tr>
        </thead>

        <tbody>
          {devices.map((d: any) => (
            <tr key={d.id}>
              <td className="p-2 border">{d.device_name}</td>
              <td className="p-2 border">{d.family_code}</td>
              <td className="p-2 border">{d.last_seen}</td>
              <td className="p-2 border">
                {d.is_online ? "🟢 Online" : "🔴 Offline"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
