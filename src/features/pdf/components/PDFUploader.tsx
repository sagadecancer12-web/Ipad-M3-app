import { useState } from "react";

import { db } from "@/database/db";

import { extractTextFromPDF } from "../services/extractText";

export default function PDFUploader() {
  const [uploaded, setUploaded] = useState("");

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      const file = event.target.files?.[0];

      if (!file) return;

      console.log("PDF recibido:", file.name);

      // const extractedText = await extractTextFromPDF(file);

      console.log("TEXTO EXTRAIDO:", extractedText);

      await db.pdfs.add({
        name: file.name,
        file,
        text: "TEST PDF",
        createdAt: new Date().toISOString(),
      });

      console.log("PDF guardado:", file.name);

      setUploaded(file.name);

    } catch (error) {
      console.error("ERROR PDF:", error);
    }
  }

  return (
    <div
      className="
        border
        border-dashed
        border-neutral-700
        rounded-lg
        p-4
        text-center
        bg-neutral-900
        max-w-md
        mb-4
      "
    >
      <label className="cursor-pointer">
        <span className="text-sm text-neutral-400">
          + Subir PDF
        </span>

        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {uploaded && (
        <p className="text-xs text-emerald-400 mt-2">
          PDF guardado: {uploaded}
        </p>
      )}
    </div>
  );
}