import { getAdsByQuery } from "@/api/ads";
import { AdCard } from "@/c/Ad";
import Search from "@/c/Form/Search";
import { seo } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
export const metadata = seo("/cauta");
export default async function Cauta(params: any) {
  const { ce } = await params.searchParams!;
  const ads = await getAdsByQuery(ce);
  return (
    <MainLayout>
      <Search keyword={ce}/>
      <div style={{marginTop: "30px", paddingBottom:"30px"}}>
        {(ads && ads.length) ? ads.map((vo,index) => <AdCard key={index} width={312} height={357} vo={vo}/>) : <span style={{fontStyle: 'italic', color: '#999'}}>Nu sunt anunțuri</span>}
      </div>
    </MainLayout>
  );
}
