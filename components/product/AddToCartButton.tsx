"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAdded(true);
    window.dispatchEvent(new CustomEvent("cart:item-added"));
    timeoutRef.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAdd}
      aria-live="polite"
      aria-label={`${added ? "Hinzugefügt" : "In den Warenkorb"}: ${product.name}`}
      className={`flex-1 ${
        added ? "bg-[var(--color-success)] hover:bg-[var(--color-success)]" : ""
      }`}
      size="sm"
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          Hinzugefügt!
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          In den Warenkorb
        </>
      )}
    </Button>
  );
}
