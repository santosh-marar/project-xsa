import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  brand: string;
}

export function ProductCard({ name, image, price, brand }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{name}</h3>
        <p className="text-sm text-muted-foreground">{brand}</p>
        <p className="font-semibold mt-2">${price}</p>
      </CardContent>
    </Card>
  );
}
