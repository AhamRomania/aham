import { Category, CategoryList } from "@/c";
import { Ad } from "@/c/Ad";
import { HomepageLayout } from "@/c/Layout";
import Section from "@/c/section";
import useApiFetch from "@/hooks/api";
import { ArrowRight } from "@mui/icons-material";
import { Button } from "@mui/joy";
import style from './page.module.css';

export default async function Home () {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useApiFetch<Category[]>();
  const categories = await fetch('/categories');
  return (
    <HomepageLayout>
      <Section title="Categorii" after={<Button size="lg" variant="plain" endDecorator={<ArrowRight/>}>Categorii</Button>}>
        <CategoryList categories={categories} />
      </Section>
      <Section
        title="Recomandate"
        className={style.listing}
      >
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
        <Ad width={312} height={357} vo={{title: 'Mini Couper', loc: 'Timiș/Timișoara', ago: 'acum 2 ore', price: '99 Lei'}}/>
      </Section>
    </HomepageLayout>
  );
}
