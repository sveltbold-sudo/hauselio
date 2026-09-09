const BLUR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#f5f5f4" rx="4"/><rect x="6" y="6" width="20" height="20" fill="#e7e5e4" rx="2" opacity="0.5"/></svg>`;
const BLUR_DATA_URL = `data:image/svg+xml;base64,${typeof Buffer !== "undefined" ? Buffer.from(BLUR_SVG).toString("base64") : btoa(BLUR_SVG)}`;

export function getBlurDataURL(src: string | null | undefined): string {
  if (!src) return BLUR_DATA_URL;

  if (src.includes("res.cloudinary.com")) {
    const parts = src.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_20,h_20,e_blur:500,f_webp,q_10/${parts[1]}`;
    }
  }

  return BLUR_DATA_URL;
}
