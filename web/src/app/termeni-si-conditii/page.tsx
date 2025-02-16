import HtmlContent from "@/c/Content";
import { seo } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
export const metadata = seo('/termeni-si-conditii');
export default async function Page() {
    return (
        <MainLayout>
            <HtmlContent
                from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/termeni-si-conditii.md"
            />
        </MainLayout>
    )
}