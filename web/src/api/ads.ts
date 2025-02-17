import { AdMetrics } from "@/c/types";
import getApiFetch from "./api";

export async function getAdMetrics(id: number):Promise<AdMetrics> {
    const api = getApiFetch();
    return await api<AdMetrics>(`/ads/${id}/metrics`);
}