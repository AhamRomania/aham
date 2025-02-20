"use server";

import getApiFetch from "@/api/api";
import { toMoney } from "@/c/formatter";
import { getAdOrCategory } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
import AdPage from "@/c/Pages/Ad";
import { Ad, Category, Prop } from "@/c/types";
import MoreAds from "@/c/Widget/MoreAds";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";


export async function generateMetadata(props: any): Promise<Metadata> {
    
    const params = await props.params
    const data = await getAdOrCategory(params.path);

    if (data?.kind === 'ad') {
        const vo:Ad = (data.vo as Ad)
        return {
            title: vo.title + ' | Aham',
            description: vo.description,
        };
    }

    if (data?.kind === 'category') {
        const vo:Category = (data.vo as Category)
        return {
            title: vo.name + ' | Aham',
            description: vo.description,
        };
    }

    return Promise.reject();
}

export default async function Page(props: any) {
    const api = getApiFetch();
    const params = await props.params
    const data = await getAdOrCategory(params.path);

    if (!data) {
        return notFound();
    }

    if (data?.kind === 'category') {
        const ads = await api<Ad[]>(`/ads?from=${data.vo.id}`)
        return (
            <>
                <MainLayout>
                    <MoreAds title={(data.vo as Category).path} ads={ads}/>
                </MainLayout>
            </>
        )
    }

    const ad = data.vo as Ad;
    const categoryID = ad.category ? ad.category.id : 0;
    const dprops = await api<Prop[]>(`/categories/${categoryID}/props`);
    const extra = await api<Ad[]>(`/ads`)

    const offerSchema = {
        "@context": "https://schema.org",
        "@type": "Offer",
        "name": ad.title,
        "description": ad.description,
        "price": toMoney(ad.price),
        "priceCurrency": ad.currency,
        "availability": "https://schema.org/InStock",
        "validFrom": "2025-02-18",
        "validThrough": "2025-03-01",
        "url": `http://aham.ro/${ad.href}`,
        "seller": {
            "@type": "Organization",
            "name": ad.owner.given_name,
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
                <AdPage ad={ad} props={dprops} extra={extra} />
            </MainLayout>
        </>
    )
}