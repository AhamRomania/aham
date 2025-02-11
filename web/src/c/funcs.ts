import getApiFetch from "@/api/api";
import { Ad, User } from "./types"

export const isPrivilegedUser = (user: User): boolean => {
    const roles = ['root','admin','moderator'];
    return roles.includes(user.role);
}

export const isAdURL = (path: string[]): boolean => {
    
    if (!Array.isArray(path) || path.length === 0) {
        return false;
    }

    const matches = path[path.length - 1].match(/^.*-(\d+)$/);

    if (!matches) {
        return false;
    }

    return true;
}

export const getAdId = (path: string[]): number => {
    const matches = path[path.length - 1].match(/^.*-(\d+)$/);
    if (!matches) {
        return 0;
    }
    return parseInt(matches[1]);
}

class PathDynamicVo {
    kind: 'category' | 'ad';
    vo: any;
    constructor(kind: 'category' | 'ad', vo: any) {
        this.kind = kind;
        this.vo = vo;
    }
}

export const getAdOrCategory = async(path: string[]): Promise<PathDynamicVo | null> => {
    
    const api = getApiFetch()

    if (!isAdURL(path)) {

        let category = null;

        try {
            category = await api(`/categories?path=${path.join('/')}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e:any) {
            return null;
        }

        return new PathDynamicVo('category', category);
    }

    let ad: Ad | null = null;

    try {
        ad = await api<Ad>(`/ads/${getAdId(path)}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e:any) {
        return null;
    }

    return new PathDynamicVo('ad', ad);
}