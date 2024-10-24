"use client";

import { Button } from "@/components/ui/button";

export function GenerateOfferForm() {
  const handleGenerate = async () => {
    try {
      await fetch("/api/generate-commercial-offer", {
        method: "POST",
      }).then(async (response) => {
        const filename = response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1];
        if (filename) {
          const link = document.createElement("a");
          const blob = await response.blob();
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          document.removeChild(link);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex justify-center py-10">
      <Button onClick={handleGenerate}>Generate Offer</Button>
    </div>
  );
}
