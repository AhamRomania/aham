"use server";

import getApiFetch from "@/api/api";
import { fetchCategory } from "@/api/categories";
import { CategoryListSection } from "@/c/Categories";
import { toMoney } from "@/c/formatter";
import { getAdOrCategory } from "@/c/funcs";
import { MainLayout } from "@/c/Layout";
import AdPage from "@/c/Pages/Ad";
import { Ad, Category, Prop } from "@/c/types";
import MoreAds from "@/c/Widget/MoreAds";
import { Breadcrumbs } from "@mui/joy";
import { Metadata } from "next";
import Link from "next/link";
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
        const ads = await api<Ad[]>(`/ads?from=${data.vo.id}&skip-owner=true`);
        const category = (data.vo as Category);
        return (
            <>
                <MainLayout>
                    <MoreAds
                        before={(
                            <>
                            <div style={{marginBottom: '10px'}}>
                                <Breadcrumbs sx={{padding:'0'}}>
                                    {category.path.split(' > ').map((item:string,index: number) => (
                                        <Link prefetch={false} key={index} href={'/'+category.href.split('/').slice(0,index + 1).join('/')}>
                                            {item}
                                        </Link>
                                    ))}
                                </Breadcrumbs>
                            </div>
                            <CategoryListSection showMoreButton={false} title={false} category={await fetchCategory(category.id)}/>
                            </>
                        )}
                        titleNodeType="h1"
                        title={category.name}
                        ads={ads}
                    />
                </MainLayout>
            </>
        )
    }

    const ad = data.vo as Ad;
    const categoryID = ad.category ? ad.category.id : 0;
    const dprops = await api<Prop[]>(`/categories/${categoryID}/props`);
    const extra = await api<Ad[]>(`/ads?limit=6&from=${categoryID}`)

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
        "url": `http://aham.ro${ad.href}`,
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