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
import { Textarea } from "@/components/ui/textarea";

interface TShirtAttributesFieldsProps {
  index: number;
  control: Control<any>;
}

export function TShirtAttributesFields({
  index,
  control,
}: TShirtAttributesFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`variations.${index}.attributes.sleeveType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sleeve Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select sleeve type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="3/4">3/4</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.collarType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Collar Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select collar type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="round">Round</SelectItem>
                <SelectItem value="v-neck">V-Neck</SelectItem>
                <SelectItem value="polo">Polo</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="none">None</SelectItem>
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
        name={`variations.${index}.attributes.pattern`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pattern</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="striped">Striped</SelectItem>
                <SelectItem value="printed">Printed</SelectItem>
                <SelectItem value="logo-only">Logo Only</SelectItem>
                <SelectItem value="back-printed-only">Back Printed Only</SelectItem>
                <SelectItem value="front-printed-only">Front Printed Only</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.stretchability`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stretchability</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select stretchability" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="non-stretch">Non-stretch</SelectItem>
                <SelectItem value="little-stretch">Little Stretch</SelectItem>
                <SelectItem value="medium-stretch">Medium Stretch</SelectItem>
                <SelectItem value="very-stretch">Very Stretch</SelectItem>
                <SelectItem value="2-way">2-way</SelectItem>
                <SelectItem value="4-way">4-way</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.careInstructions`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Care Instructions</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
