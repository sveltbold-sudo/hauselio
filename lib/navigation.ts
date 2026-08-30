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
      { name: "Küchenmaschinen", href: "/kategorie/kueche?sub=K%C3%BCchenmaschinen" },
      { name: "Handmixer", href: "/kategorie/kueche?sub=Handmixer" },
      { name: "Backöfen", href: "/kategorie/kueche?sub=Back%C3%B6fen" },
      { name: "Kochfelder", href: "/kategorie/kueche?sub=Kochfelder" },
      { name: "Airfryer", href: "/kategorie/kueche?sub=Airfryer" },
      { name: "Grill & Kontaktgrill", href: "/kategorie/kueche?sub=Grill+%26+Kontaktgrill" },
      { name: "Thermomix", href: "/kategorie/kueche?sub=Thermomix" },
    ],
  },
  {
    name: "Kaffee",
    href: "/kategorie/kaffee",
    image: "/images/categories/kaffee.jpg",
    description: "Premium Kaffeemaschinen für den perfekten Genuss",
    subcategories: [
      { name: "Kaffeevollautomaten", href: "/kategorie/kaffee?sub=Kaffeevollautomaten" },
      { name: "Espressomaschinen", href: "/kategorie/kaffee?sub=Espressomaschinen" },
      { name: "Kapselmaschinen", href: "/kategorie/kaffee?sub=Kapselmaschinen" },
      { name: "Filterkaffee", href: "/kategorie/kaffee?sub=Filterkaffee" },
    ],
  },
  {
    name: "Reinigung",
    href: "/kategorie/reinigung",
    image: "/images/categories/reinigung.jpg",
    description: "Effiziente Reinigungsgeräte für Ihr Zuhause",
    subcategories: [
      { name: "Staubsauger", href: "/kategorie/reinigung?sub=Staubsauger" },
      { name: "Saugroboter", href: "/kategorie/reinigung?sub=Saugroboter" },
      { name: "Dampfreiniger", href: "/kategorie/reinigung?sub=Dampfreiniger" },
    ],
  },
  {
    name: "Klima",
    href: "/kategorie/klima",
    image: "/images/categories/klima.jpg",
    description: "Luftreiniger, Luftbefeuchter & Luftkühler",
    subcategories: [
      { name: "Luftreiniger", href: "/kategorie/klima?sub=Luftreiniger" },
      { name: "Luftbefeuchter", href: "/kategorie/klima?sub=Luftbefeuchter" },
      { name: "Luftkühler", href: "/kategorie/klima?sub=Luftk%C3%BChler" },
    ],
  },
  {
    name: "Smart Home",
    href: "/kategorie/smart-home",
    image: "/images/categories/smart-home.jpg",
    description: "Intelligente Geräte für ein vernetztes Zuhause",
    subcategories: [
      { name: "Smart-Beleuchtung", href: "/kategorie/smart-home?sub=Smart-Beleuchtung" },
      { name: "Smart-Heizung", href: "/kategorie/smart-home?sub=Smart-Heizung" },
      { name: "Smart-Überwachung", href: "/kategorie/smart-home?sub=Smart-%C3%9Cberwachung" },
      { name: "Smart-Hubs & Zubehör", href: "/kategorie/smart-home?sub=Smart-Hubs+%26+Zubeh%C3%B6r" },
    ],
  },
  {
    name: "Haushaltsgeräte",
    href: "/kategorie/haushaltsgeraete",
    image: "/images/categories/haushaltsgeraete.jpg",
    description: "Waschmaschinen, Trockner, Kühlschränke & mehr",
    subcategories: [
      { name: "Waschmaschinen", href: "/kategorie/haushaltsgeraete?sub=Waschmaschinen" },
      { name: "Trockner", href: "/kategorie/haushaltsgeraete?sub=Trockner" },
      { name: "Geschirrspüler", href: "/kategorie/haushaltsgeraete?sub=Geschirrsp%C3%BCler" },
      { name: "Kühlschränke", href: "/kategorie/haushaltsgeraete?sub=K%C3%BChlschr%C3%A4nke" },
      { name: "Gefrierschränke", href: "/kategorie/haushaltsgeraete?sub=Gefrierschr%C3%A4nke" },
    ],
  },
];

export const footerCategories = navCategories.map(({ name, href }) => ({
  name,
  href,
}));
