"use server";

import getApiFetch from "@/api/api";
import { toMoney } from "@/c/formatter";
import { getAdOrCategory } from "@/c/funcs";
import { Centred, MainLayout } from "@/c/Layout";
import AdPage from "@/c/Pages/Ad";
import { Ad, Prop } from "@/c/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";


export async function generateMetadata(props: any): Promise<Metadata> {
    
    const params = await props.params
    const data = await getAdOrCategory(params.path);

    if (data?.kind === 'ad') {
        return {
            title: data.vo.title + ' | Aham',
            description: data.vo.description,
        };
    }

    if (data?.kind === 'category') {
        return {
            title: data.vo.name + ' | Aham',
            description: data.vo.description,
        };
    }

    return Promise.reject();
}

export default async function Page(props: any) {
    const api = getApiFetch();
    const params = await props.params
    const data = await getAdOrCategory(params.path);
    const dprops = await api<Prop[]>(`/categories/${data?.vo.category.id}/props`);
    const extra = await api<Ad[]>(`/ads`)

    if (!data) {
        return notFound();
    }

    if (data?.kind === 'category') {
        return (
            <>
                <MainLayout>
                    <Centred>
                        <label>
                            Category Page
                        </label>
                    </Centred>
                </MainLayout>
            </>
        )
    }

    const offerSchema = {
        "@context": "https://schema.org",
        "@type": "Offer",
        "name": data.vo.title,
        "description": data.vo.description,
        "price": toMoney(data.vo.price),
        "priceCurrency": data.vo.currency,
        "availability": "https://schema.org/InStock",
        "validFrom": "2025-02-18",
        "validThrough": "2025-03-01",
        "url": `http://aham.ro/${data.vo.href}`,
        "seller": {
            "@type": "Organization",
            "name": data.vo.owner.given_name,
        }
    };

    return (
        <>
            <Script
                id="offer-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
                strategy="afterInteractive"
            />
            <MainLayout>
                <AdPage ad={data.vo} props={dprops} extra={extra} />
            </MainLayout>
        </>
    )
}