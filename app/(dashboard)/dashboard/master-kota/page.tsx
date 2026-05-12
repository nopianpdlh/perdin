"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Globe } from "lucide-react";
import { useKota } from "@/lib/hooks";
import { Kota } from "@/lib/types";
import { generateId } from "@/lib/utils";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";

const EMPTY_FORM: Omit<Kota, "id"> = {
  nama: "",
  latitude: 0,
  longitude: 0,
  provinsi: "",
  pulau: "",
  luarNegeri: false,
};

export default function MasterKotaPage() {
  const { kotaList, addKota, updateKota, deleteKota } = useKota();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Kota | null>(null);
  const [form, setForm] = useState<Omit<Kota, "id">>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = kotaList.filter(
    (k) =>
      k.nama.toLowerCase().includes(search.toLowerCase()) ||
      k.provinsi.toLowerCase().includes(search.toLowerCase()) ||
      k.pulau.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(kota: Kota) {
    setEditTarget(kota);
    setForm({
      nama: kota.nama,
      latitude: kota.latitude,
      longitude: kota.longitude,
      provinsi: kota.provinsi,
      pulau: kota.pulau,
      luarNegeri: kota.luarNegeri,
    });
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editTarget) {
      updateKota({ ...form, id: editTarget.id });
    } else {
      addKota({ ...form, id: generateId() });
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    deleteKota(id);
    setDeleteConfirm(null);
  }

  return (
    <div>
      <PageHeader
        title="Master Data Kota"
        subtitle="Kelola data kota untuk perjalanan dinas"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Tambah Kota
          </button>
        }
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama kota, provinsi, atau pulau..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="px-4 py-3 text-left font-medium">No</th>
                <th className="px-4 py-3 text-left font-medium">Nama Kota</th>
                <th className="px-4 py-3 text-left font-medium">Provinsi</th>
                <th className="px-4 py-3 text-left font-medium">Pulau</th>
                <th className="px-4 py-3 text-left font-medium">Latitude</th>
                <th className="px-4 py-3 text-left font-medium">Longitude</th>
                <th className="px-4 py-3 text-left font-medium">Luar Negeri</th>
                <th className="px-4 py-3 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    Tidak ada data kota.
                  </td>
                </tr>
              ) : (
                filtered.map((kota, idx) => (
                  <tr key={kota.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        {kota.luarNegeri && (
                          <Globe size={14} className="text-blue-500" />
                        )}
                        {kota.nama}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{kota.provinsi}</td>
                    <td className="px-4 py-3 text-gray-600">{kota.pulau}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {kota.latitude}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {kota.longitude}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          kota.luarNegeri
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {kota.luarNegeri ? "Ya" : "Tidak"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(kota)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(kota.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
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
          title={editTarget ? "Edit Kota" : "Tambah Kota"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kota <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contoh: Kota Bandung"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm({ ...form, latitude: parseFloat(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="-6.9175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm({ ...form, longitude: parseFloat(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="107.6191"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provinsi
              </label>
              <input
                type="text"
                value={form.provinsi}
                onChange={(e) => setForm({ ...form, provinsi: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contoh: Jawa Barat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pulau
              </label>
              <input
                type="text"
                value={form.pulau}
                onChange={(e) => setForm({ ...form, pulau: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contoh: Jawa"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="luarNegeri"
                checked={form.luarNegeri}
                onChange={(e) =>
                  setForm({ ...form, luarNegeri: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor="luarNegeri"
                className="text-sm font-medium text-gray-700"
              >
                Kota Luar Negeri
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editTarget ? "Simpan Perubahan" : "Tambah Kota"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <Modal title="Konfirmasi Hapus" onClose={() => setDeleteConfirm(null)} size="sm">
          <p className="text-sm text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus kota ini? Tindakan ini tidak dapat
            dibatalkan.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
