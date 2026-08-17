"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
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
    timeoutRef.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      aria-live="polite"
      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
        added
          ? "bg-[var(--color-success)] text-white"
          : "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-primary)] active:scale-[0.97]"
      }`}
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
    </button>
  );
}
