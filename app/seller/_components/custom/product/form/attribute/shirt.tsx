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

interface ShirtAttributesFieldsProps {
  index: number;
  control: Control<any>;
}

export function ShirtAttributesFields({
  index,
  control,
}: ShirtAttributesFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`variations.${index}.attributes.size`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Size</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="XXL">XXL</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.color`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <Input placeholder="Enter color" {...field} />
            </FormControl>
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
                <SelectItem value="spread">Spread</SelectItem>
                <SelectItem value="button-down">Button-down</SelectItem>
                <SelectItem value="mandarin">Mandarin</SelectItem>
                <SelectItem value="wing">Wing</SelectItem>
                <SelectItem value="club">Club</SelectItem>
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
        name={`variations.${index}.attributes.sleeveLength`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sleeve Length</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select sleeve length" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="half">Half</SelectItem>
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
                <SelectItem value="slim">Slim</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
                <SelectItem value="oversized">Oversized</SelectItem>
                <SelectItem value="loose">Loose</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.material`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Material</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="linen">Linen</SelectItem>
                <SelectItem value="polyester">Polyester</SelectItem>
                <SelectItem value="cotton-polyester-blend">
                  Cotton/Polyester Blend
                </SelectItem>
                <SelectItem value="silk">Silk</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
                <SelectItem value="chest">Chest</SelectItem>
                <SelectItem value="no pockets">No Pockets</SelectItem>
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
                <SelectItem value="checked">Checked</SelectItem>
                <SelectItem value="printed">Printed</SelectItem>
                <SelectItem value="logo-only">Logo Only</SelectItem>
                <SelectItem value="back-printed-only">
                  Back Printed Only
                </SelectItem>
                <SelectItem value="front-printed-only">
                  Front Printed Only
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.placketType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placket Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select placket type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="buttoned">Buttoned</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.gender`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="UNISEX">Unisex</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.ageRange`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age Range</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="INFANT">Infant</SelectItem>
                <SelectItem value="TODDLER">Toddler</SelectItem>
                <SelectItem value="KIDS">Kids</SelectItem>
                <SelectItem value="TEENS">Teens</SelectItem>
                <SelectItem value="ADULTS">Adults</SelectItem>
                <SelectItem value="SENIORS">Seniors</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
