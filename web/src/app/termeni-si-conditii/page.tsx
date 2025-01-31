import Content from "@/c/Content";
import { MainLayout } from "@/c/Layout";

export default async function Page() {
    return (
        <MainLayout>
            <Content
                from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/termeni-si-conditii.md"
            />
        </MainLayout>
    )
}