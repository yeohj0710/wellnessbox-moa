"use client";
import { useState } from "react";
import SupplementModal from "./SupplementModal";

export type Supplement = {
  id: number;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
};

export default function SupplementGrid({
  supplements,
}: {
  supplements: Supplement[];
}) {
  const [selected, setSelected] = useState<Supplement | null>(null);
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {supplements.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelected(s)}
            className="cursor-pointer bg-white rounded shadow p-2 flex flex-col items-center hover:shadow-lg border border-transparent hover:border-primary"
          >
            <img
              src={s.imageUrl}
              alt={s.name}
              className="w-full h-32 object-cover rounded transform scale-60"
            />
            <div className="text-sm font-semibold text-gray-800 truncate">
              {s.name}
            </div>
            <div className="mt-1 text-xs text-gray-500">{s.unit}</div>
            <div className="mt-2 text-sm font-semibold text-primary">
              {s.price.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <SupplementModal
          supplement={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
