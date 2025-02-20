import { getAdsByQuery } from "@/api/ads";
import { seo } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
import MoreAds from "@/c/Widget/MoreAds";
export const metadata = seo('/cauta');
export default async function Cauta(params:any) {
  const {ce} = await params.searchParams!;
  const ads = await getAdsByQuery(ce)
  return (
    <MainLayout>
      <MoreAds title={'Căutare: '+ce} ads={ads}/>
    </MainLayout>
  )
}
