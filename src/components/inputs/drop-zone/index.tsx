"use client";

import { FileIcon, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function Dropzone({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | undefined | null>(null);
  const handleUpload = (file: File | undefined | null) => {
    if (!file) return;
    if (file.size > 1024 * 1024 * 25) {
      toast.error("File size must be less than 25MB");
      return;
    }
    setFile(file);
    onUpload(file);
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const _file = event.dataTransfer.files[0];
    handleUpload(_file);
  };
  return (
    <div
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      className="relative row-span-3 flex w-full items-center justify-center"
    >
      <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-500 ease-in-out hover:bg-muted">
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleUpload(e.target?.files?.[0])}
        />
        <div className="text-foreground-secondary flex flex-col items-center justify-center pb-6 pt-5">
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <FileIcon className="h-6 w-6 text-foreground" />
              <p>
                <span>{file.name}</span>
              </p>
            </div>
          ) : (
            <>
              <UploadCloud />
              <p className="mb-2 text-sm">
                <span className="font-semibold">Click to upload </span>
                <span>or drag and drop</span>
              </p>
              <p className="text-xs text-muted-foreground">
                CSV | PDF | DOCX | XLSX | PPTX | TXT | JPG | PNG
              </p>
              <p className="text-xs text-muted-foreground">(MAX. 25MB)</p>
            </>
          )}
        </div>
      </label>
    </div>
  );
}

export default Dropzone;
