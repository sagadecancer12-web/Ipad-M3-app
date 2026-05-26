import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/database/db";

export default function PDFLibrary() {
  const pdfs = useLiveQuery(() => db.pdfs.toArray());

  return (
    <div
      className="
        border
        border-neutral-800
        rounded-xl
        p-4
        bg-neutral-900
        text-white
        mb-4
        space-y-3
      "
    >
      <h2 className="text-sm text-neutral-400">
        PDFs guardados
      </h2>

      {pdfs?.length === 0 && (
        <p className="text-xs text-neutral-500">
          No hay PDFs todavía
        </p>
      )}

      {pdfs?.map((pdf) => (
        <div
          key={pdf.id}
          className="
            border
            border-neutral-800
            rounded-lg
            p-3
            bg-neutral-950
          "
        >
          <p className="text-sm text-white">
            📄 {pdf.name}
          </p>

          <p className="text-xs text-neutral-500 mt-1">
            {pdf.createdAt}
          </p>
        </div>
      ))}
    </div>
  );
}