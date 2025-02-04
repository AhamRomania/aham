import { Ad } from "@/c/Ad";
import { CategoryListSection } from "@/c/Categories";
import { HomepageLayout } from "@/c/Layout";
import Section from "@/c/section";
import { Ad as AdType } from "@/c/types";
import getApiFetch from "@/api/api";
import { Metadata } from "next";
import style from './page.module.css';

export const metadata: Metadata = {
  title: 'Aham: Bazarul tău',
  description:
    'Începe explorarea în bazarul tău preferat unde găsești și cunoști o grămadă de lucruri.',
};

const NoItems = ({text}:{text:string}) => (
  <span style={{fontStyle: 'italic', color: '#999'}}>{text}</span>
)

export default async function Home () {
  const api = getApiFetch();
  const promovations = await api<AdType[]>('/ads?filter=promovations');
  const recomandations = await api<AdType[]>('/ads?filter=recomandations');
  return (
    <HomepageLayout>
      <CategoryListSection id={1} count={20} />
      <CategoryListSection id={3} count={20} />
      <Section
        title="Promovate"
        className={style.listing}
      >
        {(promovations && promovations.length) ? promovations.map((vo,index) => <Ad key={index} width={312} height={357} vo={vo}/>) : <NoItems text='Nicio promovare'/>}
      </Section>
      <Section
        title="Recomandate"
        className={style.listing}
      >
        {(promovations && promovations.length) ? recomandations.map((vo,index) => <Ad key={index} width={312} height={357} vo={vo}/>) : <NoItems text='Nicio recomandare'/>}
      </Section>
    </HomepageLayout>
  );
}
