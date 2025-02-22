import { Ad, AdMetrics, Prop } from "@/c/types";
import getApiFetch from "./api";

export async function getAdMetrics(id: number): Promise<AdMetrics> {
    return await getApiFetch()<AdMetrics>(`/ads/${id}/metrics`);
}

export async function getAdsToApprove(): Promise<Ad[]> {
    return await getApiFetch()<Ad[]>(`/ads?mode=pending&skip-owner=true`);
}

export async function getDraftAds(): Promise<Ad[]> {
    return await getApiFetch()<Ad[]>(`/ads?mode=draft`);
}

export async function getPendingAds(): Promise<Ad[]> {
    return await getApiFetch()<Ad[]>(`/ads?mode=pending`);
}

export async function createFavourite(ad:Ad): Promise<void> {
    return getApiFetch()(`/ads/${ad.id}/favourite`,{method:'POST', success: true});
}

export async function removeFavourite(ad:Ad): Promise<void> {
    return getApiFetch()(`/ads/${ad.id}/favourite`,{method:'DELETE', success: true});
}

export async function getFavouriteAds(): Promise<Ad[]> {
    return await getApiFetch()<Ad[]>(`/ads/favourites`);
}

export async function getCompletedAds(): Promise<Ad[]> {
    return await getApiFetch()<Ad[]>(`/ads?mode=completed`);
}

export async function getPublishedAds(): Promise<Ad[]> {
    return await getApiFetch()<Ad[]>(`/ads?mode=published`);
}

export async function getAdsByQuery(query:string): Promise<Ad[]> {
    return await getApiFetch()<Ad[]>(`/ads?mode=published&skip-owner=true&query=${query}`);
}

export async function getCategoryProps(category: number): Promise<Prop[]> {
    if (!category) { throw new Error('Category must a number greather than 0')}
    return await getApiFetch()<Prop[]>(`/categories/${category}/props`);
}

export async function removeAd(id:number): Promise<void> {
    return await getApiFetch()(`/ads/`+id,{success: true, method: 'DELETE'});
}

export async function publishAd(id:number): Promise<void> {
    return await getApiFetch()(`/ads/${id}/publish`,{success: true, method: 'POST'});
}