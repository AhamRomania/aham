import { seo } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
export const metadata = seo('/contact');
export default async function Page() {
    return (
        <MainLayout>
            <div style={{margin:"0 auto", width:1024}}>
                <label>Simple contact form</label><br/>
                <br/>
            </div>
        </MainLayout>
    )
}