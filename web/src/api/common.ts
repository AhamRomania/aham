import { Ad, ReportData, User } from "@/c/types";
import { getUser } from "@/c/Auth";
import getApiFetch from "./api";

export async function getMe(fn?: (me: User | null) => void):Promise<User | undefined> {
    
    if (fn) {
    getUser().then(fn)
        return;
    }

    return getUser().then(fn);
}

export async function saveAdReport(ad:Ad, data: ReportData): Promise<void> {
    data.reference = `${ad.id}`;
    const api = getApiFetch();
    return new Promise((resolve, reject) => {
        api(`/report`,{method:'POST',success:true, body: JSON.stringify(data)}).then(
            () => resolve()
        ).catch(
            () => reject()
        )
    });
}