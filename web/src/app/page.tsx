import { CategoryList } from "@/c";
import { HomepageLayout } from "@/c/Layout";
import Section from "@/c/section";

export default function Home() {
  const categories = [
    { name: "Vehicule", href: "/c/vehicule" },
    { name: "Proprietăți de închiriat", href: "/c/proprietati-de-inchiriat" },
    { name: "Mica publicitate", href: "/c/mica-publicitate" },
    { name: "Haine", href: "/c/haine" },
    { name: "Electronice", href: "/c/electronice" },
    { name: "Vehicule", href: "/c/vehicule" },
    { name: "Proprietăți de închiriat", href: "/c/proprietati-de-inchiriat" },
    { name: "Mica publicitate", href: "/c/mica-publicitate" },
    { name: "Haine", href: "/c/haine" },
    { name: "Electronice", href: "/c/electronice" },
    { name: "Vehicule", href: "/c/vehicule" },
    { name: "Proprietăți de închiriat", href: "/c/proprietati-de-inchiriat" },
    { name: "Mica publicitate", href: "/c/mica-publicitate" },
    { name: "Haine", href: "/c/haine" },
    { name: "Electronice", href: "/c/electronice" },
  ];

  return (
    <HomepageLayout>
      <Section title="Categorii">
        <CategoryList categories={categories} />
      </Section>
    </HomepageLayout>
  );
}
