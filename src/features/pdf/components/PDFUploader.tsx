import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { db } from "@/database/db";

export default function PDFUploader() {
  const [uploaded, setUploaded] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    await db.pdfs.add({
      name: file.name,
      file,
      text: "",
      createdAt: new Date().toISOString(),
    });

    console.log("PDF guardado:", file.name);

    setUploaded(file.name);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="
        border
        border-dashed
        border-neutral-700
        rounded-lg
        p-4
        text-center
        cursor-pointer
        bg-neutral-900
        hover:border-amber-500
        transition
        max-w-md
        mb-4
      "
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <p className="text-sm text-amber-400">
          Suelta el PDF aquí...
        </p>
      ) : (
        <p className="text-sm text-neutral-400">
          + Subir PDF
        </p>
      )}

      {uploaded && (
        <p className="text-xs text-emerald-400 mt-2">
          PDF guardado: {uploaded}
        </p>
      )}
    </div>
  );
}