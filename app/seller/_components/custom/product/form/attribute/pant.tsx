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

interface PantAttributesFieldsProps {
  index: number;
  control: Control<any>;
}

export function PantAttributesFields({
  index,
  control,
}: PantAttributesFieldsProps) {
  const pocketTypes = ["Front", "Back", "Coin"];

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`variations.${index}.attributes.waistType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Waist Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select waist type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">Low Rise</SelectItem>
                <SelectItem value="mid">Mid Rise</SelectItem>
                <SelectItem value="high">High Rise</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.waistType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Wash Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select wash type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="dark-wash">Dark Wash</SelectItem>
                <SelectItem value="medium-wash">Medium Wash</SelectItem>
                <SelectItem value="distressed">Distressed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.legStyle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Leg Style</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select leg style" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="skinny">Skinny</SelectItem>
                <SelectItem value="slim">Slim</SelectItem>
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="bootcut">Bootcut</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
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
        name={`variations.${index}.attributes.stretchType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stretch Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select stretch type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="non-stretch">Non-stretch</SelectItem>
                <SelectItem value="little-stretch">Little Stretch</SelectItem>
                <SelectItem value="medium-stretch">Medium Stretch</SelectItem>
                <SelectItem value="super-stretch">Super Stretch</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.pantType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pant Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pant type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="full-pant">Full Pant</SelectItem>
                <SelectItem value="half-pant">Half Pant</SelectItem>
                <SelectItem value="low-pant">Low-pant</SelectItem>
                <SelectItem value="3/4-pant">3/4-pant</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`variations.${index}.attributes.inseam`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inseam</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select inseam" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="22">22 Inches</SelectItem>
                <SelectItem value="24">24 Inches</SelectItem>
                <SelectItem value="26">26 Inches</SelectItem>
                <SelectItem value="28">28 Inches</SelectItem>
                <SelectItem value="30">30 Inches</SelectItem>
                <SelectItem value="32">32 Inches</SelectItem>
                <SelectItem value="34">34 Inches</SelectItem>
                <SelectItem value="36">36 Inches</SelectItem>
                <SelectItem value="38">38 Inches</SelectItem>
                <SelectItem value="40">40 Inches</SelectItem>
                <SelectItem value="42">42 Inches</SelectItem>
                <SelectItem value="44">44 Inches</SelectItem>
                <SelectItem value="46">46 Inches</SelectItem>
                <SelectItem value="48">48 Inches</SelectItem>
                <SelectItem value="50">50 Inches</SelectItem>
                <SelectItem value="52">52 Inches</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
