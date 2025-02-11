import HtmlContent from "@/c/Content";
import { MainLayout } from "@/c/Layout";

export default async function Page() {
    return (
        <MainLayout>
            <HtmlContent
                from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/developeri.md"
            />
        </MainLayout>
    )
}