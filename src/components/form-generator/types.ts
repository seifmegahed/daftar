import type { z } from "zod";
import type { ReactNode } from "react";

export const enum FieldType {
  Text = "text",
  Number = "number",
  Select = "select",
  Textarea = "textarea",
  Checkbox = "checkbox",
  DatePicker = "date-picker",
  ComboSelect = "combo-select",
}

type GenericFieldType = {
  name: string;
  label: string;
  schema: z.ZodTypeAny;
  hidden?: boolean;
  className?: string;
  description?: string | ReactNode;
  required: boolean;
  testId?: string;
};

export type TextFieldType = GenericFieldType & {
  type: FieldType.Text;
  default?: string;
};

export type NumberFieldType = GenericFieldType & {
  type: FieldType.Number;
  default?: number;
};

export type SelectFieldType = GenericFieldType & {
  type: FieldType.Select;
  default?: string | number;
  options:
    | readonly string[]
    | readonly { value: string | number; label: string }[];
};

export type TextareaFieldType = GenericFieldType & {
  type: FieldType.Textarea;
  default?: string;
};

export type CheckboxFieldType = GenericFieldType & {
  type: FieldType.Checkbox;
  default?: boolean;
};

export type DatePickerFieldType = GenericFieldType & {
  type: FieldType.DatePicker;
  default?: Date;
  allowFuture?: boolean;
};

export type ComboSelect = GenericFieldType & {
  type: FieldType.ComboSelect;
  default?: string;
  options: readonly { value: string; label: string }[] | readonly string[];
  searchMessage?: string;
  notFoundMessage?: string;
  selectMessage?: string;
};

export type FieldDataType =
  | TextFieldType
  | NumberFieldType
  | SelectFieldType
  | TextareaFieldType
  | CheckboxFieldType
  | DatePickerFieldType
  | ComboSelect;
