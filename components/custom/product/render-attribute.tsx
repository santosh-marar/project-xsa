function getAttributeTitle(attributeKey: string): string {
  return attributeKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/Id$/, "ID");
}

// @ts-ignore
export function renderAttributes(attributes: ProductAttributes | undefined) {
  if (!attributes) return null;

  //   @ts-ignore
  const renderField = (key: string, value: any) => {
    if (key === "id" || key === "productVariationId") return null;

    const title = getAttributeTitle(key);

    if (typeof value === "boolean") {
      return (
        <div key={key} className="grid grid-cols-2 gap-2">
          <span className="font-medium">{title}:</span>
          <span>{value ? "Yes" : "No"}</span>
        </div>
      );
    }
    if (Array.isArray(value)) {
      return (
        <div key={key} className="grid grid-cols-2 gap-2">
          <span className="font-medium">{title}:</span>
          <span>{value.join(", ")}</span>
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      // @ts-ignore
      return Object.entries(value).map(([subKey, subValue]) =>
        renderField(`${key} - ${subKey}`, subValue)
      );
    }
    return (
      <div key={key} className="grid grid-cols-2 gap-2">
        <span className="font-medium">{title}:</span>
        <span>{value}</span>
      </div>
    );
  };

  return (
    <div className="text-sm space-y-2 border rounded-lg p-4 h-full">
      <h3 className="font-medium text-base mb-3">Product Details</h3>
      <div className="space-y-2">
        {Object.entries(attributes).map(([key, value]) =>
          renderField(key, value)
        )}
      </div>
    </div>
  );
}
