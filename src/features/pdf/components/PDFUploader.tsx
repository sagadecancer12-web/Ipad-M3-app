import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function PDFUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("PDFs:", acceptedFiles);
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
      className="border-2 border-dashed border-gray-500 rounded-xl p-10 text-center cursor-pointer"
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <p>Suelta el PDF aquí...</p>
      ) : (
        <p>Arrastra o selecciona un PDF</p>
      )}
    </div>
  );
}