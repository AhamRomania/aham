import { ReportData, User } from "@/c/types";
import { getUser } from "@/c/Auth";
import getApiFetch from "./api";
import getDomain, { Domain } from "@/c/domain";

export async function getMe(fn?: (me: User | null) => void):Promise<User | undefined> {
    
    if (fn) {
    getUser().then(fn)
        return;
    }

    return getUser().then(fn);
}

export async function createReport(data: ReportData): Promise<void> {
    const api = getApiFetch();
    return new Promise((resolve, reject) => {
        api(`/report`,{method:'POST',success:true, body: JSON.stringify(data)}).then(
            () => resolve()
        ).catch(
            () => reject()
        )
    });
}

export async function getBalance(): Promise<number> {
    return await getApiFetch()<string>(`/balance`, {text:true}).then(n => parseInt(n as string));
}

export async function getShortURL(url: string): Promise<string> {
    const data = new FormData();
    data.set("url", url);
    return fetch(getDomain(Domain.Url), {method: "POST", body: data, cache:'no-cache' })
      .then((response) => {
        return response.text()
      });
}

export async function getReferrerURL(): Promise<string> {
    return await getShortURL(await getApiFetch()<string>(`/me/referrer`, {text:true}))
}

export async function getSitemap(): Promise<string> {
    return await getApiFetch()<string>(`/sitemap`, {text:true,cache:'force-cache'});
}