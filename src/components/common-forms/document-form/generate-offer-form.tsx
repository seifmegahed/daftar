"use client";

import type { RelationDataType } from ".";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/buttons/submit-button";
import { useState } from "react";

export function GenerateOfferForm({
  relationData,
}: {
  relationData: RelationDataType;
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append("id", relationData.relationId.toString());
    setLoading(true);
    try {
      await fetch("/api/generate-commercial-offer", {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        const filename = response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          ?.slice(1);
        if (filename) {
          const link = document.createElement("a");
          const blob = await response.blob();
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          link.remove();

          navigate.replace("documents");
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center py-10">
      <SubmitButton
        onClick={handleGenerate}
        loading={loading}
        disabled={loading}
      >
        Generate Offer
      </SubmitButton>
    </div>
  );
}
