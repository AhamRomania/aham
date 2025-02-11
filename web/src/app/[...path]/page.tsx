"use server";

import { getAdOrCategory } from "@/c/funcs";
import { Centred, MainLayout } from "@/c/Layout";
import AdPage from "@/c/Pages/Ad";
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

    const params = await props.params
    const data = await getAdOrCategory(params.path);

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
                <AdPage ad={data.vo} />
            </MainLayout>
        </>
    )
}