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
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
                <SelectItem value="polyester">Polyester</SelectItem>                
                <SelectItem value="cotton-polyester-blend">
                  Cotton/Polyester Blend
                </SelectItem>
                <SelectItem value="silk">Silk</SelectItem>
                <SelectItem value="cashmere">Cashmere</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
