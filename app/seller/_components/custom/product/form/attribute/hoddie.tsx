import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HoodieAttributesFieldsProps {
  index: number;
  control: Control<any>;
}

export function HoodieAttributesFields({
  index,
  control,
}: HoodieAttributesFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`variations.${index}.attributes.hoodType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hood Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select hood type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="fitted">Fitted</SelectItem>
                <SelectItem value="adjustable">Adjustable</SelectItem>
                <SelectItem value="oversized">Oversized</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.pocketStyle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pocket Style</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pocket style" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="kangaroo">Kangaroo</SelectItem>
                <SelectItem value="split">Split</SelectItem>
                <SelectItem value="zippered">Zippered</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.fit`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fit</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select fit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="slim">Slim</SelectItem>
                <SelectItem value="oversized">Oversized</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.fabricWeight`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fabric Weight</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select fabric weight" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="light">Light (150grm)</SelectItem>
                <SelectItem value="medium">Medium (180grm)</SelectItem>
                <SelectItem value="heavy">Heavy (220grm)</SelectItem>
                <SelectItem value="very heavy">Very Heavy (250grm)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.sleeveStyle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sleeve Style</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select sleeve style" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="raglan">Raglan</SelectItem>
                <SelectItem value="set-in">Set-in</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
