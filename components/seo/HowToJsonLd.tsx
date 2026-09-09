import { SITE_URL } from "@/lib/constants";

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToJsonLdProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  supply?: string[];
  tool?: string[];
  image?: string;
}

export default function HowToJsonLd({
  name,
  description,
  steps,
  totalTime,
  supply = [],
  tool = [],
  image,
}: HowToJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(image ? { image: image.startsWith("http") ? image : `${SITE_URL}${image}` } : {}),
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: step.image.startsWith("http") ? step.image : `${SITE_URL}${step.image}` } : {}),
    })),
    ...(supply.length > 0
      ? {
          supply: supply.map((s) => ({
            "@type": "HowToSupply",
            name: s,
          })),
        }
      : {}),
    ...(tool.length > 0
      ? {
          tool: tool.map((t) => ({
            "@type": "HowToTool",
            name: t,
          })),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
