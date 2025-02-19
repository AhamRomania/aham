import getApiFetch from "@/api/api";
import { fetchCategory } from "@/api/categories";
import { CategoryListSection } from "@/c/Categories";
import { seo } from "@/c/funcs";
import { HomepageLayout } from "@/c/Layout";
import { Ad } from "@/c/types";
import MoreAds from "@/c/Widget/MoreAds";

export const metadata = seo('/', {
  title: "Aham: Bazarul tău preferat",
  description: "Începe explorarea în bazarul tău preferat unde găsești și cunoști o grămadă de lucruri.",
  icons: {
    apple: "favicons/favicon-180x180.png",
  },
  manifest: "aham.webmanifest",
  other: {
    "msapplication-TileColor": "#1F70B8",
    "msapplication-TileImage": "favicons/favicon-180x180.png",
  },
});

export default async function Home () {
  const api = getApiFetch();
  const promotion = await api<Ad[]>('/ads?mode=promotion');
  const recommended = await api<Ad[]>('/ads?mode=recommended');
  return (
    <HomepageLayout>
      <CategoryListSection category={await fetchCategory(1)} />
      <CategoryListSection category={await fetchCategory(2)} />
      <MoreAds title="Promovate" ads={promotion}/>
      <MoreAds title="Recomandate" ads={recommended}/>
    </HomepageLayout>
  );
}
