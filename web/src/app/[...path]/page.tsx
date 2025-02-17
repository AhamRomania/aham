"use server";

import getApiFetch from "@/api/api";
import { getAdOrCategory } from "@/c/funcs";
import { Centred, MainLayout } from "@/c/Layout";
import AdPage from "@/c/Pages/Ad";
import { Ad, Prop } from "@/c/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";


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

    return (
        <>
            <MainLayout>
                <AdPage ad={data.vo} props={dprops} extra={extra} />
            </MainLayout>
        </>
    )
}