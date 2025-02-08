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

interface UndergarmentAttributesFieldsProps {
  index: number;
  control: Control<any>;
}

export function UndergarmentAttributesFields({
  index,
  control,
}: UndergarmentAttributesFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`variations.${index}.attributes.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="briefs">Briefs</SelectItem>
                <SelectItem value="boxers">Boxers</SelectItem>
                <SelectItem value="boxer-briefs">Boxer Briefs</SelectItem>
                <SelectItem value="thong">Thong</SelectItem>
                <SelectItem value="bikini">Bikini</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.waistband`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Waistband</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select waistband" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="elastic">Elastic</SelectItem>
                <SelectItem value="ribbed">Ribbed</SelectItem>
                <SelectItem value="covered-elastic">Covered Elastic</SelectItem>
                <SelectItem value="drawstring">Drawstring</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.legLength`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Leg Length</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select leg length" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
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
