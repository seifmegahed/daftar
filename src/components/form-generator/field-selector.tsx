"use client";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription, FormItem, FormMessage } from "@/components/ui/form";
import DatePicker from "./date-picker";
import ComboSelect from "./combo-select";

import type { z } from "zod";
import type { ControllerRenderProps, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

import FieldWrapper from "./field-wrapper";
import { FieldType, type FieldDataType } from "./types";

type FieldSchema<T extends FieldDataType> = {
  [K in T["name"]]: z.infer<Extract<T, { name: K }>["schema"]>;
};

interface FieldSelectorProps {
  fieldData: FieldDataType;
  field: ControllerRenderProps<
    FieldSchema<FieldDataType>,
    Path<FieldSchema<FieldDataType>>
  >;
}

function FieldSelector({ fieldData, field }: FieldSelectorProps) {
  switch (fieldData.type) {
        case FieldType.Select:
      return (
        <FieldWrapper
          className={fieldData.className}
          label={fieldData.label}
          description={fieldData.description}
        >
          <Select
            onValueChange={field.onChange}
            value={(field.value as string) ?? ""}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldData.options.map((option) => {
                const label =
                  typeof option === "string" ? option : option.label;
                const value =
                  typeof option === "string" ? option : option.value;
                return (
                  <SelectItem key={value + label} value={value + ""}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </FieldWrapper>
      );
        case FieldType.Text:
      return (
        <FieldWrapper
          className={fieldData.className}
          label={fieldData.label}
          description={fieldData.description}
        >
          <Input {...field} value={(field.value as string) ?? ""} />
        </FieldWrapper>
      );
    case FieldType.Number:
      return (
        <FieldWrapper
          className={fieldData.className}
          label={fieldData.label}
          description={fieldData.description}
        >
          <Input {...field} type="number" />
        </FieldWrapper>
      );
        case FieldType.Textarea:
      return (
        <FieldWrapper
          className={fieldData.className}
          label={fieldData.label}
          description={fieldData.description}
        >
          <Textarea
            {...field}
            rows={6}
            className="resize-none"
            maxLength={512}
          />
        </FieldWrapper>
      );
        case FieldType.Checkbox:
      return (
        <FormItem
          className={cn(
            "flex h-full flex-col justify-center gap-2",
            fieldData.className,
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg text-muted-foreground">
              {fieldData.label}
            </span>
            <Checkbox
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              className="size-5 border-2"
            />
          </div>
          <FormMessage />
          <FormDescription className="text-xs">
            {fieldData.description}
          </FormDescription>
        </FormItem>
      );
        case FieldType.DatePicker:
      return (
        <FormItem
          className={cn(
            "flex h-full flex-col justify-center gap-2",
            fieldData.className,
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg text-muted-foreground">
              {fieldData.label}
            </span>
            <DatePicker
              date={field.value as Date}
              onChange={field.onChange}
              allowFuture={fieldData.allowFuture}
            />
          </div>
          <FormMessage />
          <FormDescription className="text-xs">
            {fieldData.description}
          </FormDescription>
        </FormItem>
      );
        case FieldType.ComboSelect:
      return (
        <FieldWrapper
          className={fieldData.className}
          label={fieldData.label}
          description={fieldData.description}
        >
          <ComboSelect
            value={field.value as string}
            onChange={field.onChange}
            options={fieldData.options}
            selectMessage={fieldData.selectMessage}
            searchMessage={fieldData.searchMessage}
            notFoundMessage={fieldData.notFoundMessage}
          />
        </FieldWrapper>
      );
        default:
      return null;
  }
}

export default FieldSelector;
