import { CategoryListSection } from "@/c/Categories";
import { seo } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
import Section from "@/c/section";
import { ArrowRight } from "@mui/icons-material";
import { Button } from "@mui/joy";
export const metadata = seo('/categorii');
export default async function Page() {
    return (
        <MainLayout>
            <Section title="Categorii" after={<Button size="lg" variant="plain" endDecorator={<ArrowRight/>}>Categorii</Button>}>
                <CategoryListSection id={1} count={10}/>
            </Section>
        </MainLayout>
    )
}