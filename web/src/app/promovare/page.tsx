import Content from "@/c/Content";
import { Centred, MainLayout } from "@/c/Layout";

export default async function Page() {
    return (
        <MainLayout>
            <Centred>
                <Content from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/promovare.md"/>
            </Centred>
        </MainLayout>
    )
}