export interface Subcategory {
  name: string;
  href: string;
}

export interface NavCategory {
  name: string;
  href: string;
  image: string;
  description: string;
  subcategories: Subcategory[];
}

export const navCategories: NavCategory[] = [
  {
    name: "Küche & Kochen",
    href: "/kategorie/kueche",
    image: "/images/categories/kueche.jpg",
    description: "Hochwertige Küchengeräte für anspruchsvolle Köche",
    subcategories: [
      { name: "Thermomix", href: "/kategorie/kueche?brand=thermomix" },
      { name: "KitchenAid", href: "/kategorie/kueche?brand=kitchenaid" },
      { name: "Küchenmaschinen", href: "/kategorie/kueche" },
      { name: "Mix- & Stabmixer", href: "/kategorie/kueche" },
    ],
  },
  {
    name: "Kaffee",
    href: "/kategorie/kaffee",
    image: "/images/categories/kaffee.jpg",
    description: "Premium Kaffeemaschinen für den perfekten Genuss",
    subcategories: [
      { name: "Kaffeevollautomaten", href: "/kategorie/kaffee" },
      { name: "Espressomaschinen", href: "/kategorie/kaffee" },
      { name: "Kapselmaschinen", href: "/kategorie/kaffee" },
    ],
  },
  {
    name: "Reinigung",
    href: "/kategorie/reinigung",
    image: "/images/categories/reinigung.jpg",
    description: "Effiziente Reinigungsgeräte für Ihr Zuhause",
    subcategories: [
      { name: "Staubsauger", href: "/kategorie/reinigung" },
      { name: "Staubsaugerroboter", href: "/kategorie/reinigung" },
      { name: "Kehrmaschinen", href: "/kategorie/reinigung" },
    ],
  },
  {
    name: "Klima",
    href: "/kategorie/klima",
    image: "/images/categories/klima.jpg",
    description: "Klimaanlagen und Luftreiniger",
    subcategories: [
      { name: "Klimaanlagen", href: "/kategorie/klima" },
      { name: "Luftreiniger", href: "/kategorie/klima" },
      { name: "Luftbefeuchter", href: "/kategorie/klima" },
    ],
  },
  {
    name: "Smart Home",
    href: "/kategorie/smart-home",
    image: "/images/categories/smart-home.jpg",
    description: "Intelligente Geräte für ein vernetztes Zuhause",
    subcategories: [
      { name: "Roboterstaubsauger", href: "/kategorie/smart-home" },
      { name: "Heimautomation", href: "/kategorie/smart-home" },
      { name: "Intelligente Geräte", href: "/kategorie/smart-home" },
    ],
  },
  {
    name: "Haushaltsgeräte",
    href: "/kategorie/haushaltsgeraete",
    image: "/images/categories/haushaltsgeraete.jpg",
    description: "Waschmaschinen, Trockner, Kühlschränke & mehr",
    subcategories: [
      { name: "Waschmaschinen", href: "/kategorie/haushaltsgeraete" },
      { name: "Trockner", href: "/kategorie/haushaltsgeraete" },
      { name: "Geschirrspüler", href: "/kategorie/haushaltsgeraete" },
      { name: "Kühlschränke", href: "/kategorie/haushaltsgeraete" },
    ],
  },
];

export const footerCategories = navCategories.map(({ name, href }) => ({
  name,
  href,
}));
