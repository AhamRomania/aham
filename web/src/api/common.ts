import { Notification, ReportData, User, UserApp } from "@/c/types";
import getApiFetch from "./api";
import getDomain, { Domain } from "@/c/domain";

export async function getMe():Promise<User | null> {
    const api = getApiFetch();
    return new Promise((resolve) => {
        api<User>('/me',{cache:'no-cache'}).then((me: User) => {
            resolve(me);
        }).catch(()=>{
            resolve(null);
        });
    });
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

export async function getNotifications(offset:number, limit:number = 10): Promise<Notification[]> {
    return await getApiFetch()<Notification[]>(`/notif?limit=${limit}&offset=${offset}`);
}

export async function getNotificationsCount(): Promise<number> {
    return await getApiFetch()<number>(`/notif?count=true`);
}

export async function markAsSeen(n: Notification): Promise<void> {
    return await getApiFetch()(`/notif/${n.id}`,{method:'PATCH', success: true});
}

export async function checkPermission(resource: number, permission: number):Promise<boolean> {
    return await getApiFetch()(`/sam/${resource}/${permission}`,{success: true});
}

export async function getUserApps():Promise<UserApp[]> {
    return await getApiFetch()(`/me/apps`);
}

export async function createNewUserApp():Promise<UserApp> {
    return await getApiFetch()(`/me/apps`,{method:'POST'});
}

export async function removeUserApp(id: number):Promise<void> {
    return await getApiFetch()(`/me/apps/${id}`,{method:'DELETE', success: true});
}