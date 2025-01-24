import { Category, CategoryList } from "@/c";
import { Ad } from "@/c/Ad";
import { HomepageLayout } from "@/c/Layout";
import Section from "@/c/section";
import useApiFetch from "@/hooks/api";
import { ArrowRight } from "@mui/icons-material";
import { Button } from "@mui/joy";
import style from './page.module.css';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Aham: Bazarul tău',
  description:
    'Începe explorarea în bazarul tău preferat unde găsești și cunoști o grămadă de lucruri.',
};
import { Ad as AdType } from "@/c/types";

export default async function Home () {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useApiFetch();
  const categories = await fetch<Category[]>('/categories');
  const promovations = await fetch<AdType[]>('/ads?filter=promovations');
  const recomandations = await fetch<AdType[]>('/ads?filter=recomandations');
  return (
    <HomepageLayout>
      <Section title="Categorii" after={<Button size="lg" variant="plain" endDecorator={<ArrowRight/>}>Categorii</Button>}>
        <CategoryList categories={categories} />
      </Section>
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

export const NoItems = ({text}:{text:string}) => (
  <span style={{fontStyle: 'italic', color: '#999'}}>{text}</span>
)
