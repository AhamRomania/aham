import { getAccessToken } from "@/c/Auth";
import useDomain, { Domain } from "./domain";

export interface ApiFetchProps {
    version?: string
}

const useApiFetch = (props?:ApiFetchProps) => {

    const version = props?.version || 'v1';
    const token = getAccessToken();
    const api = useDomain(Domain.Api, '/' + version)

    return async <T>(
        input: string | URL | globalThis.Request,
        init?: RequestInit,
    ): Promise<T> => {

        input = api + input;

        if (typeof(init) === 'undefined') {
            init = {};
        }

        init.headers = {
            ...init.headers,
            'Authorization': `Bearer${token}`,
        };

        let resp;

        try
        {
            resp = await fetch(input, init);
        }
        catch(e) {
            return Promise.reject(e)
        }

        if (!resp) {
            return Promise.reject('error');
        }

        if (resp.status != 200) {
            return Promise.reject(await resp.text());
        }

        let out;

        try
        {
            out = await resp.json();
        } catch(e) {
            return Promise.reject(e);
        }

        return out;
    }
}

export default useApiFetch;