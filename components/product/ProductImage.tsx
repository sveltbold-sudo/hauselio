import Image from "next/image";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  brand?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const brandColors: Record<string, string> = {
  bosch: "#e30613",
  miele: "#c4001a",
  siemens: "#009999",
  dyson: "#cc0033",
  samsung: "#1428a0",
  lg: "#a50034",
  philips: "#0b5ed7",
  "de'longhi": "#003366",
  jura: "#1a1a1a",
  kitchenaid: "#cc0000",
  aeg: "#003366",
  liebherr: "#004a96",
  ninja: "#1a1a1a",
  cosori: "#ff6600",
  haier: "#0066cc",
  midea: "#0066cc",
  irobot: "#2d8c3c",
  kenwood: "#cc0000",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getBrandColor(brand?: string | null): string {
  if (!brand) return "#6b7280";
  return brandColors[brand.toLowerCase()] || "#6b7280";
}

export default function ProductImage({
  src,
  alt,
  brand,
  className = "",
  size = "md",
  priority = false,
}: ProductImageProps) {
  const sizeClasses = {
    sm: "w-full h-full",
    md: "w-full h-full",
    lg: "w-full h-full",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  };

  const brandSizes = {
    sm: "text-[11px]",
    md: "text-xs",
    lg: "text-sm",
  };

  if (src && src.trim() !== "" && !src.includes("placeholder")) {
    return (
      <div className={`relative bg-[var(--color-bg-secondary)] flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
          {...(priority ? { priority: true } : { loading: "lazy" })}
        />
      </div>
    );
  }

  const brandColor = getBrandColor(brand);
  const initials = brand ? getInitials(brand) : "HL";

  return (
    <div
      className={`relative bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${brandColor} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-700 ease-out"
        style={{ backgroundColor: brandColor }}
      >
        <span className="text-white font-bold text-lg md:text-xl">{initials}</span>
      </div>

      <p className={`font-semibold text-[var(--color-text-primary)] text-center px-4 leading-tight ${textSizes[size]}`}>
        {alt}
      </p>

      {brand && (
        <p className={`font-bold uppercase tracking-widest mt-1 ${brandSizes[size]}`} style={{ color: brandColor }} translate="no">
          {brand}
        </p>
      )}
    </div>
  );
}
