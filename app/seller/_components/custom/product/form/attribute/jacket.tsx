import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface JacketAttributesFieldsProps {
  index: number;
  control: Control<any>;
}

export function JacketAttributesFields({
  index,
  control,
}: JacketAttributesFieldsProps) {
  const pocketTypes = ["chest", "side", "interior"];

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`variations.${index}.attributes.closureType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Closure Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select closure type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="zipper">Zipper</SelectItem>
                <SelectItem value="buttons">Buttons</SelectItem>
                <SelectItem value="snap">Snap</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.insulation`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insulation</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select insulation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="down">Down</SelectItem>
                <SelectItem value="synthetic">Synthetic</SelectItem>
                <SelectItem value="fleece">Fleece</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.hooded`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none font-medium">
              <FormLabel>Hooded</FormLabel>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.pocketTypes`}
        render={() => (
          <FormItem>
            <FormLabel>Pocket Types</FormLabel>
            <div className="flex flex-wrap gap-4">
              {pocketTypes.map((type) => (
                <FormField
                  key={type}
                  control={control}
                  name={`variations.${index}.attributes.pocketTypes`}
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={type}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(type)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), type])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== type
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{type}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.waterproof`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none font-medium">
              <FormLabel>Waterproof</FormLabel>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`variations.${index}.attributes.weightClass`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight Class</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select weight class" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
                <SelectItem value="very heavy">Very Heavy</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
