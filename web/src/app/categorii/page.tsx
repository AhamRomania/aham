import { fetchCategory } from "@/api/categories";
import { CategoryListSection } from "@/c/Categories";
import { seo } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
export const metadata = seo('/categorii');
export default async function Page() {
    return (
        <MainLayout>
            <CategoryListSection category={await fetchCategory(1)}/>
            <CategoryListSection category={await fetchCategory(2)}/>
            <CategoryListSection category={await fetchCategory(3)}/>
            <CategoryListSection category={await fetchCategory(4)}/>
            <CategoryListSection category={await fetchCategory(5)}/>
            <CategoryListSection category={await fetchCategory(6)}/>
            <CategoryListSection category={await fetchCategory(7)}/>
        </MainLayout>
    )
}