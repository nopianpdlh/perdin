"use client";

import { useState } from "react";
import { NotePencilIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useUsers, useAuth } from "@/lib/hooks";
import { User, UserRole } from "@/lib/types";
import { generateId } from "@/lib/utils";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import { TableSkeleton } from "@/components/LoadingState";

const ROLES: UserRole[] = ["ADMIN", "PEGAWAI", "SDM"];

const EMPTY_FORM = {
  username: "",
  password: "",
  name: "",
  role: "PEGAWAI" as UserRole,
  nip: "",
  divisi: "",
};

export default function MasterUserPage() {
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();
  const { session } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.nip.includes(search)
  );

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(user: User) {
    setEditTarget(user);
    setForm({
      username: user.username,
      password: user.password,
      name: user.name,
      role: user.role,
      nip: user.nip,
      divisi: user.divisi,
    });
    setError("");
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Cek duplikat username
    const duplicate = users.find(
      (u) =>
        u.username === form.username &&
        (!editTarget || u.id !== editTarget.id)
    );
    if (duplicate) {
      setError("Username sudah digunakan.");
      toast.error("Username sudah digunakan.");
      return;
    }

    if (editTarget) {
      updateUser({ ...form, id: editTarget.id });
      toast.success("Data user diperbarui.");
    } else {
      addUser({ ...form, id: generateId() });
      toast.success("User baru berhasil ditambahkan.");
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    // Jangan hapus diri sendiri
    if (id === session?.userId) return;
    deleteUser(id);
    toast.success("User berhasil dihapus.");
    setDeleteConfirm(null);
  }

  if (loading) {
    return <TableSkeleton rows={7} cols={6} />;
  }

  const roleColor: Record<UserRole, string> = {
    ADMIN: "bg-slate-100 text-slate-700",
    SDM: "bg-cyan-100 text-cyan-700",
    PEGAWAI: "bg-sky-100 text-sky-700",
  };

  return (
    <div>
      <PageHeader
        title="Master User"
        subtitle="Kelola akun dan role pengguna aplikasi"
        action={
          <button
            onClick={openAdd}
            className="btn-primary"
          >
            <PlusIcon size={16} />
            Tambah User
          </button>
        }
      />

      <div className="mb-4">
        <input
          id="search-user"
          aria-label="Cari pengguna"
          type="text"
          placeholder="Cari nama, username, atau NIP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base w-full max-w-sm"
        />
      </div>

      <div className="table-shell overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-head-row">
                <th className="px-4 py-3 text-left font-medium">No</th>
                <th className="px-4 py-3 text-left font-medium">NIP</th>
                <th className="px-4 py-3 text-left font-medium">Nama</th>
                <th className="px-4 py-3 text-left font-medium">Username</th>
                <th className="px-4 py-3 text-left font-medium">Divisi</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Tidak ada data user.
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {user.nip}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {user.name}
                      {user.id === session?.userId && (
                        <span className="ml-2 text-xs text-cyan-600">(Anda)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.username}</td>
                    <td className="px-4 py-3 text-slate-600">{user.divisi}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(user)}
                           className="icon-action"
                           title="Edit"
                           aria-label={`Edit user ${user.name}`}
                         >
                          <NotePencilIcon size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          disabled={user.id === session?.userId}
                           className="icon-action icon-action-danger disabled:opacity-30 disabled:cursor-not-allowed"
                           title="Hapus"
                           aria-label={`Hapus user ${user.name}`}
                         >
                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <Modal
          title={editTarget ? "Edit User" : "Tambah User"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="user-nip" className="block text-sm font-medium text-slate-700 mb-1">
                  NIP <span className="text-red-500">*</span>
                </label>
                <input
                  id="user-nip"
                  required
                  type="text"
                  value={form.nip}
                  onChange={(e) => setForm({ ...form, nip: e.target.value })}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label htmlFor="user-role" className="block text-sm font-medium text-slate-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="user-role"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as UserRole })
                  }
                  className="input-base w-full"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-slate-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                id="user-name"
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-base w-full"
              />
            </div>

            <div>
              <label htmlFor="user-divisi" className="block text-sm font-medium text-slate-700 mb-1">
                Divisi
              </label>
              <input
                id="user-divisi"
                type="text"
                value={form.divisi}
                onChange={(e) => setForm({ ...form, divisi: e.target.value })}
                className="input-base w-full"
              />
            </div>

            <div>
              <label htmlFor="user-username" className="block text-sm font-medium text-slate-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="user-username"
                required
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                className="input-base w-full"
              />
            </div>

            <div>
              <label htmlFor="user-password" className="block text-sm font-medium text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="user-password"
                required
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="input-base w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editTarget ? "Simpan Perubahan" : "Tambah User"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <Modal
          title="Konfirmasi Hapus"
          onClose={() => setDeleteConfirm(null)}
          size="sm"
        >
          <p className="text-sm text-slate-600 mb-6" role="alert">
            Apakah Anda yakin ingin menghapus user ini?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
