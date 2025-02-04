import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface GenericAttributesFieldsProps {
  index: number;
  control: Control<any>;
}

export function GenericAttributesFields({
  index,
  control,
}: GenericAttributesFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`variations.${index}.attributes.genericAttributes`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Generic Attributes (JSON)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter attributes as JSON"
                {...field}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    field.onChange(parsed);
                  } catch (error) {
                    field.onChange(e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
