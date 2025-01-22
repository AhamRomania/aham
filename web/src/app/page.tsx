import { Category, CategoryList } from "@/c";
import { HomepageLayout } from "@/c/Layout";
import Section from "@/c/section";
import useApiFetch from "@/hooks/api";

export default async function Home () {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useApiFetch<Category[]>();

  const categories = await fetch('/categories');
  console.log(categories)
debugger
  return (
    <HomepageLayout>
      <Section title="Categorii">
        <CategoryList categories={categories} />
      </Section>
    </HomepageLayout>
  );
}
