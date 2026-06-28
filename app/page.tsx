"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/useTranslation";

type Item = {
  id: string;
  name: string;
  quantity: number;
  store_id: string | null;
  is_checked: boolean;
};

type Store = {
  id: string;
  name: string;
};

export default function Page() {
  const { t, lang, setLang } = useTranslation();

  const [familyCode, setFamilyCode] = useState<string | null>(null);
  const [loginCode, setLoginCode] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [items, setItems] = useState<Item[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [dark, setDark] = useState(false);

  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemStore, setNewItemStore] = useState("");

  const [newStoreName, setNewStoreName] = useState("");
  const [storeModal, setStoreModal] = useState(false);

  // DARK MODE
  useEffect(() => {
    if (dark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [dark]);

  // API helper
  const postJSON = async (url: string, body: any) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  // Load session
  useEffect(() => {
    const code = localStorage.getItem("family_code");
    const pass = localStorage.getItem("family_password");

    if (code && pass) {
      setFamilyCode(code);
      setLoginPassword(pass);
    }
  }, []);

  // Load items + stores
  useEffect(() => {
    if (!familyCode) return;
    (async () => {
      await loadItems();
      await loadStores();
    })();
  }, [familyCode]);

  // ⭐ FIXED loadItems
  const loadItems = async () => {
    const res = await postJSON("/api/getList", { family_code: familyCode });

    const safeItems: Item[] = (res.items || []).map((i: any) => ({
      id: String(i.id), // ⭐ FIXED — ποτέ ξανά NaN
      name: i.name,
      quantity: i.quantity ? Number(i.quantity) : 1,
      store_id: i.store_id ? String(i.store_id) : null,
      is_checked: Boolean(i.is_checked),
    }));

    setItems(safeItems);
  };

  // ⭐ FIXED loadStores
  const loadStores = async () => {
    const res = await postJSON("/api/getStores", { family_code: familyCode });
    const safeStores: Store[] = (res.stores || []).map((s: any) => ({
      id: String(s.id),
      name: s.name,
    }));
    setStores(safeStores);
  };

  // LOGIN
  const handleLogin = async () => {
    const res = await postJSON("/api/loginFamily", {
      family_code: loginCode,
      family_password: loginPassword,
    });

    if (!res.success) {
      alert(res.message);
      return;
    }

    localStorage.setItem("family_code", loginCode);
    localStorage.setItem("family_password", loginPassword);

    setFamilyCode(loginCode);
  };

  const logoutFamily = () => {
    localStorage.removeItem("family_code");
    localStorage.removeItem("family_password");
    setFamilyCode(null);
    setItems([]);
    setStores([]);
  };

  // ADD STORE
  const addStore = async () => {
    if (!newStoreName) return;

    const res = await postJSON("/api/addStore", {
      name: newStoreName,
      family_code: familyCode,
    });

    if (res.success) {
      setNewStoreName("");
      await loadStores();
    } else {
      alert(res.message || "Error adding store");
    }
  };

  // ADD ITEM
  const addItem = async () => {
    if (!newItemName) return;

    const storeValue = newItemStore === "" ? null : String(newItemStore);

    const res = await postJSON("/api/addItem", {
      name: newItemName,
      quantity: Number(newItemQty || "1"),
      store_id: storeValue,
      family_code: familyCode,
    });

    if (res.success) {
      setNewItemName("");
      setNewItemQty("1");
      setNewItemStore("");
      await loadItems();
    } else {
      alert(res.error || "Error adding item");
    }
  };

  // DELETE STORE
  const deleteStore = async (id: string) => {
    const ok = window.confirm("Delete store?");
    if (!ok) return;

    const res = await postJSON("/api/deleteStore", {
      id,
      family_code: familyCode,
    });

    if (res.success) await loadStores();
  };

  // ⭐ FIXED GOT IT
  const toggleGotIt = async (item: Item) => {
    const res = await postJSON("/api/toggleGotIt", {
      id: item.id, // ⭐ UUID string — σωστό
      family_code: familyCode,
    });

    if (res.success) await loadItems();
    else alert(res.error || "Error toggling item");
  };

  // EDIT ITEM
  const editItem = async (item: Item) => {
    const newName = prompt("New name:", item.name);
    if (!newName) return;

    const res = await postJSON("/api/editItem", {
      id: item.id,
      name: newName,
      family_code: familyCode,
    });

    if (res.success) await loadItems();
  };

  // DELETE ITEM
  const deleteItem = async (item: Item) => {
    const ok = window.confirm(`Delete "${item.name}"?`);
    if (!ok) return;

    const res = await postJSON("/api/deleteItem", {
      id: item.id,
      family_code: familyCode,
    });

    if (res.success) await loadItems();
  };

  // LOGIN SCREEN
  if (!familyCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-sm w-full space-y-4 p-6">
          <h1 className="text-xl font-bold text-center text-purple-700 dark:text-purple-300">
            Enter Family Code
          </h1>

          <input
            className="input dark:input"
            placeholder="Family code..."
            value={loginCode}
            onChange={(e) => setLoginCode(e.target.value)}
          />

          <h1 className="text-xl font-bold text-center text-purple-700 dark:text-purple-300 mt-4">
            Enter Password
          </h1>

          <input
            type="password"
            className="input dark:input"
            placeholder="Password..."
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button onClick={handleLogin} className="btn btn-purple w-full mt-4">
            Join Family
          </button>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-700 dark:text-purple-300">
              {t.title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              Family: {familyCode}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="select dark:select"
            >
              <option value="en">EN</option>
              <option value="el">EL</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
              <option value="it">IT</option>
              <option value="de">DE</option>
              <option value="fi">FI</option>
              <option value="ar">AR</option>
              <option value="ja">JA</option>
              <option value="zh">ZH</option>
            </select>

            <button onClick={() => setDark(!dark)} className="btn btn-purple">
              {dark ? "Light" : "Dark"}
            </button>

            <button onClick={logoutFamily} className="btn btn-danger">
              Switch
            </button>
          </div>
        </div>

        {/* ADD STORE */}
        <div className="card space-y-3">
          <div className="flex gap-2">
            <input
              className="input dark:input"
              placeholder={t.new_store}
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
            />
            <button onClick={addStore} className="btn btn-purple">
              {t.add_store}
            </button>
          </div>

          <button
            onClick={() => setStoreModal(true)}
            className="btn btn-light-purple w-full"
          >
            {t.manage_stores} ▼
          </button>
        </div>

        {/* ADD PRODUCT */}
        <div className="card space-y-3">
          <h2 className="section-title text-purple-700 dark:text-purple-300">
            {t.add_product}
          </h2>

          <div className="flex flex-col gap-3">
            <input
              className="input dark:input"
              placeholder={t.add_product}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            
             <div className="grid grid-cols-3 gap-2 items-center">


              <input
                type="number"
                min={1}
                className="input-qty"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
              />

              <select
                className="select dark:select"
                value={newItemStore}
                onChange={(e) => setNewItemStore(e.target.value)}
              >
                <option value="">{t.select_store}</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button onClick={addItem} className="btn btn-purple">
                {t.add}
              </button>
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="space-y-3">
          <h2 className="section-title text-purple-700 dark:text-purple-300">
            List
          </h2>

          <ul className="space-y-3">
            {items.map((i) => {
              const storeName = stores.find(
                (s) => String(s.id) === String(i.store_id)
              )?.name;

              return (
                <li
                  key={i.id}
                  className={`card flex items-center justify-between transition-all ${
                    i.is_checked
                      ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200 line-through"
                      : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {i.name} (x{i.quantity})
                    </span>

                    {storeName && (
                      <span className="store-label text-xs mt-1">
                        {storeName}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleGotIt(i)}
                      className="btn btn-green"
                    >
                      {t.got_it}
                    </button>
                    <button
                      onClick={() => editItem(i)}
                      className="btn btn-primary"
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => deleteItem(i)}
                      className="btn btn-danger"
                    >
                      {t.delete}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* STORE MODAL */}
        {storeModal && (
          <div className="modal-bg">
            <div className="modal-box">
              <h2 className="section-title text-center text-purple-700 dark:text-purple-300">
                {t.manage_stores}
              </h2>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {stores.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 border rounded-lg dark:border-slate-700 text-sm"
                  >
                    <span>{s.name}</span>
                    <button
                      onClick={() => deleteStore(s.id)}
                      className="btn btn-danger px-2 py-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStoreModal(false)}
                className="btn btn-light-purple w-full mt-3"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="pt-6 text-center space-y-1 text-[10px] text-gray-500 dark:text-gray-300">
          <p>© 2026 VNF Software — Created by Vasilis Fanes Nikitaras.</p>
          <p>Unauthorized copying or resale is strictly prohibited.</p>
          <p>
            Contact:{" "}
            <a href="mailto:vasilis.nikitaras@gmail.com" className="underline">
              vasilis.nikitaras@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
