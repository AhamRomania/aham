import HtmlContent from "@/c/Content";
import { seo } from "@/c/funcs";
import { Centred, MainLayout } from "@/c/Layout";
export const metadata = seo('/despre');
export default async function Page() {
    return (
        <MainLayout>
            <Centred>
                <HtmlContent from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/despre.md"/>
            </Centred>
        </MainLayout>
    )
}