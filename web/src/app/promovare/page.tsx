import HtmlContent from "@/c/Content";
import { Centred, MainLayout } from "@/c/Layout";

export default function Page() {
    return (
        <MainLayout>
            <Centred>
                <HtmlContent from="https://raw.githubusercontent.com/AhamRomania/Content/refs/heads/main/promovare.md"/>
            </Centred>
        </MainLayout>
    )
}