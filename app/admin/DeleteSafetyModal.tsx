"use client";

interface DeleteSafetyModalProps {
  open: boolean;
  onClose: () => void;
  type: string | null;
  data: any | null;
  onSoftDelete: (type: string | null, data: any | null) => void;
  onPermanentDelete: (type: string | null, data: any | null) => void;
}

export default function DeleteSafetyModal({
  open,
  onClose,
  type,
  data,
  onSoftDelete,
  onPermanentDelete
}: DeleteSafetyModalProps) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[420px]">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>

        <div className="mb-4">
          <p><strong>Type:</strong> {type}</p>
          <p><strong>Name:</strong> {data.name || data.code || "Unknown"}</p>
          <p><strong>ID:</strong> {data.id}</p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={() => onSoftDelete(type, data)}
          >
            Soft Delete
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => onPermanentDelete(type, data)}
          >
            Permanent Delete
          </button>
        </div>
      </div>
    </div>
  );
}
