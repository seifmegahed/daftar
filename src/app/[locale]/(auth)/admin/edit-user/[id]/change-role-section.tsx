"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminUpdateUserRoleAction } from "@/server/actions/users";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/buttons/submit-button";
import LabelWrapper from "./label-wrapper";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";

const roleItems = [
  {
    label: { en: "Admin", ar: "مدير" },
    value: "admin",
    description: { en: "Has all privileges", ar: "لديه كافة الصلاحيات" },
  },
  {
    label: { en: "Super User", ar: "مستخدم مميز" },
    value: "s-user",
    description: {
      en: "Has same privileges as user, but can see private data",
      ar: "لديه نفس الصلاحيات من المستخدم، ولكن يمكن رؤية البيانات الخاصة",
    },
  },
  {
    label: { en: "User", ar: "مستخدم" },
    value: "user",
    description: {
      en: "Regular user.",
      ar: "مستخدم عادي.",
    },
  },
] as const;

function ChangeRoleSection({
  userId,
  userRole,
}: {
  userId: number;
  userRole: string;
}) {
  const locale = useLocale() as Locale;
  const direction = getDirection(locale);
  const t = useTranslations("edit-user.change-role-section");
  
  const [role, setRole] = useState(userRole);
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChange(userRole === role ? false : true);
  }, [userRole, role]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const [, error] = await adminUpdateUserRoleAction({
        id: userId,
        role: role,
      });
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success(t("success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <LabelWrapper htmlFor="role" label={t("title")} />
      <Select onValueChange={setRole} value={role} dir={direction}>
        <SelectTrigger>
          <SelectValue>
            {roleItems.find((item) => item.value === role)?.label[locale]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {roleItems.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              <span>{item.label[locale]}</span>
              <p className="text-xs text-muted-foreground">
                {item.description[locale]}
              </p>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {t("description")}
      </p>
      <div className="flex justify-end py-4">
        <SubmitButton
          variant="outline"
          className="w-40"
          disabled={!change || loading}
          loading={loading}
          onClick={handleSubmit}
        >
          {t("update")}
        </SubmitButton>
      </div>
    </div>
  );
}

export default ChangeRoleSection;
