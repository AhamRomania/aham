import { getAccessToken } from "@/c/Auth";

export interface ApiFetchProps {
    version?: string
}

const useApiFetch = <T>(props?:ApiFetchProps) => {

    const version = props?.version || 'v1';
    const token = getAccessToken();

    return async (
        input: string | URL | globalThis.Request,
        init?: RequestInit,
    ): Promise<T> => {

        let api = `https://api.aham.ro/${version}`
        
        if (process.env.NODE_ENV === 'development') {
            api = `http://localhost:8080/${version}`
        }

        input = api + input;

        if (typeof(init) === 'undefined') {
            init = {};
        }

        init.headers = {
            ...init.headers,
            'Authorization': `Bearer${token}`,
        };

        const resp = await fetch(input, init);

        if (!resp) {
            return Promise.reject('error');
        }

        if (resp.status != 200) {
            return Promise.reject();
        }

        return await resp.json();
    }
}

export default useApiFetch;