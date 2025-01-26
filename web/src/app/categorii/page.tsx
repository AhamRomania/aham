import { Category, CategoryList } from "@/c";
import { MainLayout } from "@/c/Layout";
import Section from "@/c/section";
import useApiFetch from "@/hooks/api";
import { ArrowRight } from "@mui/icons-material";
import { Button } from "@mui/joy";

export default async function Page() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetch = useApiFetch();
    const categories = await fetch<Category[]>('/categories');
    return (
        <MainLayout>
            <Section title="Categorii" after={<Button size="lg" variant="plain" endDecorator={<ArrowRight/>}>Categorii</Button>}>
                <CategoryList categories={categories} />
            </Section>
        </MainLayout>
    )
}