"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import BulkActions from "@/components/admin/BulkActions";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  inStock: boolean;
  category: { name: string };
  brand: { name: string | null } | null;
  images: { url: string }[];
}

type SortKey = "name" | "price" | "category" | "brand";

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
  return dir === "asc"
    ? <ArrowUp className="w-3 h-3 ml-1 text-[var(--color-primary)]" />
    : <ArrowDown className="w-3 h-3 ml-1 text-[var(--color-primary)]" />;
}

export default function ProductTable({
  products,
  total,
  totalPages,
  page,
  category,
  brand,
  q,
}: {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  category?: string;
  brand?: string;
  q?: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return products;
    return [...products].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name, "de");
          break;
        case "price":
          cmp = Number(a.price) - Number(b.price);
          break;
        case "category":
          cmp = a.category.name.localeCompare(b.category.name, "de");
          break;
        case "brand":
          cmp = (a.brand?.name || "").localeCompare(b.brand?.name || "", "de");
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [products, sortKey, sortDir]);

  const toggleAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
    }
  };

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-[var(--color-border-light)] bg-gray-50">
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === products.length && products.length > 0}
                    onChange={toggleAll}
                    aria-label="Alle auswählen"
                    className="w-4 h-4 rounded border-gray-300 accent-[var(--color-primary)]"
                  />
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Bild
                </th>
                <th
                  onClick={() => handleSort("name")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("name"); } }}
                  tabIndex={0}
                  role="columnheader"
                  aria-sort={sortKey === "name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Name
                    <SortIcon active={sortKey === "name"} dir={sortDir} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("category")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("category"); } }}
                  tabIndex={0}
                  role="columnheader"
                  aria-sort={sortKey === "category" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Kategorie
                    <SortIcon active={sortKey === "category"} dir={sortDir} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("brand")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("brand"); } }}
                  tabIndex={0}
                  role="columnheader"
                  aria-sort={sortKey === "brand" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Marke
                    <SortIcon active={sortKey === "brand"} dir={sortDir} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("price")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("price"); } }}
                  tabIndex={0}
                  role="columnheader"
                  aria-sort={sortKey === "price" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase cursor-pointer select-none hover:text-[var(--color-primary)]"
                >
                  <span className="inline-flex items-center">
                    Preis
                    <SortIcon active={sortKey === "price"} dir={sortDir} />
                  </span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b border-[var(--color-border-light)] last:border-0 hover:bg-gray-50 ${
                    selected.includes(product.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggle(product.id)}
                      aria-label={`${product.name} auswählen`}
                      className="w-4 h-4 rounded border-gray-300 accent-[var(--color-primary)]"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Kein Bild
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {product.slug}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--color-text-secondary)]">
                    {product.category.name}
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--color-text-secondary)]">
                    {product.brand?.name || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {formatPrice(Number(product.price))}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-[var(--color-text-muted)] line-through">
                        {formatPrice(Number(product.originalPrice))}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        product.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.inStock ? "Verfügbar" : "Nicht verfügbar"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/produkt/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={`Produkt ${product.name} ansehen`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/admin/produkte/${product.id}/bearbeiten`}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={`Produkt ${product.name} bearbeiten`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]"
                  >
                    Keine Produkte gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-[var(--color-border-light)]">
          {sorted.map((product) => (
            <div
              key={product.id}
              className={`p-4 ${selected.includes(product.id) ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(product.id)}
                  onChange={() => toggle(product.id)}
                  aria-label={`${product.name} auswählen`}
                  className="w-4 h-4 rounded border-gray-300 accent-[var(--color-primary)] mt-1"
                />
                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                      Kein Bild
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {product.category.name} · {product.brand?.name || "—"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                        product.inStock
                          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                          : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                      }`}
                    >
                      {product.inStock ? "Verfügbar" : "Nicht verfügbar"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">
                      {formatPrice(Number(product.price))}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`/produkt/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={`Produkt ${product.name} ansehen`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={`/admin/produkte/${product.id}/bearbeiten`}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={`Produkt ${product.name} bearbeiten`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">
              Keine Produkte gefunden.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border-light)]">
            <p className="text-sm text-[var(--color-text-muted)]">
              {total} Produkte — Seite {page} von {totalPages}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                (p) => (
                  <Link
                    key={p}
                    href={`/admin/produkte?page=${p}${category ? `&category=${category}` : ""}${brand ? `&brand=${brand}` : ""}${q ? `&q=${q}` : ""}`}
                    aria-current={p === page ? "page" : undefined}
                    className={`px-3 py-1 rounded text-sm ${
                      p === page
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <BulkActions
        selectedIds={selected}
        onClearSelection={() => setSelected([])}
        onComplete={() => router.refresh()}
      />
    </>
  );
}
