"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { createCommercialOfferItemAction } from "@/server/actions/commercial-offer-items/create";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";

const schema = z.object({
  itemId: z.number({ message: "Item is required" }),
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

function NewSaleItemForm({
  projectId,
  itemsList,
}: {
  projectId: number;
  itemsList: { id: number; name: string }[];
}) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const response = await createCommercialOfferItemAction({
        projectId,
        itemId: data.itemId,
        price: String(data.price),
        currency: data.currency,
        quantity: data.quantity,
      });
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success("Item added");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding item");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
      autoComplete="off"
    >
      <Form {...form}>
        <FormWrapperWithSubmit
          title="Add Sale Item"
          description="Enter the details of the sale item you want to add."
          buttonText="Add Item"
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
        >
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
                  Select an item to add to the project&apos;s commercial offer.
                  If the item does not exist, you have to create it from the
                  Items tab first.
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
                <FormDescription>
                  Enter the quantity of the item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default NewSaleItemForm;
