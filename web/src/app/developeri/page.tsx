import { seo } from "@/c/funcs";
import { Centred, MainLayout } from "@/c/Layout";
import Developers from "@/c/Pages/Developers";

export const metadata = seo('/developeri');
export default async function Page() {
    return (
        <MainLayout>
            <Centred>
                <Developers/>
            </Centred>
        </MainLayout>
    )
}