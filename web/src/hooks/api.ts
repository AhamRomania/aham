import { getAccessToken } from "@/c/Auth";

export interface ApiFetchProps {
    version?: string
}

const useApiFetch = <T>(props?:ApiFetchProps) => {

    const token = getAccessToken();

    return async (
        input: string | URL | globalThis.Request,
        init?: RequestInit,
    ): Promise<T> => {

        input = `https://api.aham.ro/${props?.version || `v1`}${input}`;

        if (typeof(init) === 'undefined') {
            init = {};
        }

        init.headers = {
            ...init.headers,
            'Authorization': `Bearer${token}`,
        };

        const resp = await fetch(input, init);

        if (resp.status != 200) {
            return Promise.reject();
        }

        return await resp.json();
    }
}

export default useApiFetch;