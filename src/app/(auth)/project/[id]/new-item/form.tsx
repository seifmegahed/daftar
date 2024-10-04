"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SubmitButton from "@/components/buttons/submit-button";
import ComboSelect from "@/components/combo-select-obj";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { currencyOptions } from "@/data/lut";
import { addProjectItemAction } from "@/server/actions/project-items/create";

const schema = z.object({
  itemId: z.number({ message: "Item is required" }),
  supplierId: z.number({ message: "Supplier is required" }),
  price: z.number(),
  currency: z.number({ message: "Currency is required" }),
  quantity: z.number(),
});

const defaultValues = {
  itemId: undefined,
  supplierId: undefined,
  price: 0,
  currency: undefined,
  quantity: 0,
};

type FormSchemaType = z.infer<typeof schema>;

function NewItemForm({
  projectId,
  suppliersList,
  itemsList,
}: {
  projectId: number;
  suppliersList: { id: number; name: string }[];
  itemsList: { id: number; name: string }[];
}) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormSchemaType) => {
    const [, error] = await addProjectItemAction({
      projectId,
      itemId: data.itemId,
      supplierId: data.supplierId,
      price: String(data.price),
      currency: data.currency,
      quantity: data.quantity,
    });
    if (error !== null) {
      console.error("Error adding item:", error);
      toast.error("Error adding item");
      return;
    }
    toast.success("Item added successfully");
    form.reset();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      autoComplete="off"
    >
      <h1 className="text-2xl font-bold tracking-tight">Project Item Form</h1>
      <Form {...form}>
        <FormField
          control={form.control}
          name="itemId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Item</FormLabel>
              <ComboSelect
                value={field.value ?? null}
                onChange={field.onChange}
                options={itemsList.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                selectMessage="Select item"
                searchMessage="Search for item"
                notFoundMessage="Item not found."
              />
              <FormDescription>
                Select an item to add to the project. If the item does not
                exist, you have to create it from the Items tab first.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Supplier</FormLabel>
              <ComboSelect
                value={field.value ?? null}
                onChange={field.onChange}
                options={suppliersList.map((supplier) => ({
                  value: supplier.id,
                  label: supplier.name,
                }))}
                selectMessage="Select supplier"
                searchMessage="Search for supplier"
                notFoundMessage="Supplier not found."
              />
              <FormDescription>
                Select the supplier to add to the project. If the supplier does
                not exist, you have to create it from the Suppliers tab first.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <Input
                {...field}
                type="number"
                step="0.01"
                min="0"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              <FormDescription>Enter the price of the item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select
                defaultValue={String(field.value) ?? ""}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem
                      key={currency.value}
                      value={String(currency.value)}
                    >
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the currency of the price.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <Input
                {...field}
                type="number"
                step="1"
                min="0"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              <FormDescription>Enter the quantity of the item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting && !form.formState.isDirty}
            type="submit"
          >
            Add Item
          </SubmitButton>
        </div>
      </Form>
    </form>
  );
}

export default NewItemForm;
