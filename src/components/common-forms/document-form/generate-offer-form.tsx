"use client";

import type { RelationDataType } from ".";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import {
//   Form,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";

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
    <form onSubmit={handleGenerate}>
      <FormWrapperWithSubmit
        title="Generate Offer"
        description="Generate a commercial offer for the project"
        buttonText="Generate"
        submitting={loading}
        dirty={false}
      >
        <></>
      </FormWrapperWithSubmit>
    </form>
  );
}
