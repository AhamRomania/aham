import HtmlContent from "@/c/Content";
import { seo } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
export const metadata = seo('/ajutor');
export default async function Page() {
    return (
        <MainLayout>
            <HtmlContent
                from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/developeri.md"
            />
        </MainLayout>
    )
}