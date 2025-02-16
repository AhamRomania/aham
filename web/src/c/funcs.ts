import getApiFetch from "@/api/api";
import { Ad, SeoEntry, User } from "./types"
import { Metadata } from "next";
import getDomain, { Domain } from "./domain";

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

export function ucfirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export async function seo(uri?: string, extra?: Metadata): Promise<Metadata> {

    const response = await fetch(getDomain(Domain.Api) + `/v1/seo?uri=` + uri, {next:{revalidate: 60 * 60}});

    let data: SeoEntry;

    try
    {
        data = await response.json();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch(error: any) {
        return extra || {} as Metadata;
    }
  
    const meta = { ...extra };
  
    if (!data) {
        return meta;
    }

    if (!meta.openGraph) {
      meta.openGraph = {
        url: `https://aham.ro${uri}`,
        siteName: 'Aham'
      };
    }
  
    if (data.title) {
      meta['title'] = data.title + ' | Aham';
      meta.openGraph.title = meta['title'];
    } else {
        meta['title'] = '';
    }
  
    if (data.description) {
      meta['description'] = data.description;
      meta.openGraph.description = meta['description'];
    } else {
        meta['description'] = '';
    }
  
    if (data.image) {
      meta.openGraph.images = [
        {
          url: data.image,
          alt: meta.title as string,
        }
      ];
    }
  
    return meta as Metadata;
  }
  