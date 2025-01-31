import Content from "@/c/Content";
import { Centred, MainLayout } from "@/c/Layout";

export default async function Page() {
    return (
        <MainLayout>
            <Content
                from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/cookies.md"
            />
        </MainLayout>
    )
}