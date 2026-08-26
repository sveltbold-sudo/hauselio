"use client";

import dynamic from "next/dynamic";

const ComparisonBar = dynamic(
  () => import("@/components/product/ComparisonBar"),
  { ssr: false }
);

export default function LazyComparisonBar() {
  return <ComparisonBar />;
}
