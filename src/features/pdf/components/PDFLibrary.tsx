import { useEffect, useState } from "react";

import { db, PDFDocument } from "@/database/db";

export default function PDFLibrary() {
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);

  useEffect(() => {
    loadPDFs();
  }, []);

  async function loadPDFs() {
    const allPDFs = await db.pdfs.toArray();

    setPdfs(allPDFs);
  }

  return (
    <div className="space-y-2 mb-4">
      {pdfs.map((pdf) => (
        <div
          key={pdf.id}
          className="
            border
            border-neutral-800
            rounded-lg
            p-3
            bg-neutral-900
          "
        >
          <p className="text-sm text-neutral-200">
            📄 {pdf.name}
          </p>

          <p className="text-xs text-neutral-500 mt-1">
            {new Date(pdf.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}s