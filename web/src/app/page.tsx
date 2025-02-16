import getApiFetch from "@/api/api";
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
  const promovations = await api<Ad[]>('/ads?filter=promovations');
  const recomandations = await api<Ad[]>('/ads?filter=recomandations');
  return (
    <HomepageLayout>
      <CategoryListSection id={1} count={20} />
      <CategoryListSection id={3} count={20} />
      <MoreAds title="Promovate" ads={promovations}/>
      <MoreAds title="Recomandate" ads={recomandations}/>
    </HomepageLayout>
  );
}
