"use client";

import { FileIcon, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE_MB = 25;

function Dropzone({
  onUpload,
  file,
}: {
  onUpload: (file: File) => void;
  file: File | undefined | null;
}) {
  const t = useTranslations("drop-zone");
  const handleUpload = (file: File | undefined | null) => {
    if (!file) return;
    if (file.size > 1024 * 1024 * MAX_FILE_SIZE_MB) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE_MB} MB`);
      return;
    }
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
                <span className="font-semibold">{t("title")}</span>
                <span>{t("subtitle")}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                CSV | PDF | DOCX | XLSX | PPTX | TXT | JPG | PNG
              </p>
              <p className="text-xs text-muted-foreground">
                {t("max", { max: MAX_FILE_SIZE_MB })}
              </p>
            </>
          )}
        </div>
      </label>
    </div>
  );
}

export default Dropzone;
