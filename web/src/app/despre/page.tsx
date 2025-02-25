import HtmlContent from "@/c/Content";
import { seo } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
export const metadata = seo('/despre');
export default async function Page() {
    return (
        <MainLayout>
            <HtmlContent from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/despre.md"/>
        </MainLayout>
    )
}