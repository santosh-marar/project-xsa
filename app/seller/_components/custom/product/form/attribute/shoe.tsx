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

interface ShoeAttributesFieldsProps {
  index: number;
  control: Control<any>;
}

export function ShoeAttributesFields({
  index,
  control,
}: ShoeAttributesFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`variations.${index}.attributes.shoeType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shoe Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select shoe type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="sneakers">Sneakers</SelectItem>
                <SelectItem value="boots">Boots</SelectItem>
                <SelectItem value="formal-shoes">Formal Shoes</SelectItem>
                <SelectItem value="dress-shoes">Dress Shoes</SelectItem>
                <SelectItem value="loafers">Loafers</SelectItem>
                <SelectItem value="flats">Flats</SelectItem>
                <SelectItem value="ankle-boots">Ankle Boots</SelectItem>
                <SelectItem value="ballet-flats">Ballet Flats</SelectItem>
                <SelectItem value="slipper">Slipper</SelectItem>
                <SelectItem value="sandals">Sandals</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
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
                <SelectItem value="laces">Laces</SelectItem>
                <SelectItem value="velcro">Velcro</SelectItem>
                <SelectItem value="slip-on">Slip-on</SelectItem>
                <SelectItem value="buckle">Buckle</SelectItem>
                <SelectItem value="zipper">Zipper</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.occasion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occasion</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.width`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Width</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="narrow">Narrow</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.insole`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insole</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select insole" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="memory-foam">Memory Foam</SelectItem>
                <SelectItem value="ortholine">Ortholine</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.outsole`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Outsole</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select outsole" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="rubber">Rubber</SelectItem>
                <SelectItem value="eva">EVA</SelectItem>
                <SelectItem value="leather">Leather</SelectItem>
                <SelectItem value="tpu">TPU</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
