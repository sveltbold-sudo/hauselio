import { type SVGProps, type ReactElement } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const icons: Record<string, (props: IconProps) => ReactElement> = {
  kueche: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 18h32v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V18Z" />
      <path d="M8 18a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4" />
      <path d="M24 4v6M18 4v4M30 4v4" />
      <path d="M14 28h4M22 28h4M30 28h4" />
    </svg>
  ),

  kaffee: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 16h28v20a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V16Z" />
      <path d="M36 20h4a4 4 0 0 1 0 8h-4" />
      <path d="M16 8c0-2 2-4 2-6M22 8c0-2 2-4 2-6M28 8c0-2 2-4 2-6" />
      <path d="M12 16V12M20 16V12M28 16V12" />
    </svg>
  ),

  reinigung: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="24" cy="34" r="10" />
      <circle cx="24" cy="34" r="4" />
      <path d="M24 24V10" />
      <path d="M18 10h12" />
      <path d="M20 16h8" />
      <path d="M14 34c-2-2-4-2-6-1M34 34c2-2 4-2 6-1" />
    </svg>
  ),

  klima: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M24 4v40M4 24h40" />
      <path d="M10 10l28 28M38 10L10 38" />
      <circle cx="24" cy="24" r="6" />
      <path d="M24 14v-4M24 38v-4M14 24h-4M38 24h-4" />
    </svg>
  ),

  "smart-home": (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 24l18-18 18 18" />
      <path d="M10 22v18a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V22" />
      <path d="M20 44V30h8v14" />
      <circle cx="24" cy="18" r="3" />
      <path d="M21 15a6 6 0 0 1 6 0M19 13a10 10 0 0 1 10 0" />
    </svg>
  ),

  haushaltsgeraete: (props) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="4" width="36" height="40" rx="4" />
      <circle cx="24" cy="28" r="10" />
      <circle cx="24" cy="28" r="4" />
      <path d="M16 4h16" />
      <path d="M14 14h20" />
      <circle cx="14" cy="9" r="1.5" fill="currentColor" />
      <circle cx="20" cy="9" r="1.5" fill="currentColor" />
    </svg>
  ),
};

interface CategoryIconProps extends IconProps {
  category: string;
}

export default function CategoryIcon({ category, className, ...props }: CategoryIconProps) {
  const Icon = icons[category];
  if (!Icon) return null;
  return <Icon className={className} {...props} />;
}
