import { getAccessToken } from "@/c/Auth";
import useDomain, { Domain } from "./domain";

export interface ApiFetchProps {
    version?: string
}

const useApiFetch = (props?:ApiFetchProps) => {

    const version = props?.version || 'v1';
    
    const api = useDomain(Domain.Api, '/' + version)

    return async <T>(
        input: string | URL | globalThis.Request,
        init?: RequestInit,
    ): Promise<T> => {

        const token = await getAccessToken();

        input = api + input;

        if (typeof(init) === 'undefined') {
            init = {};
        }

        init.headers = {
            ...init.headers,
            'Authorization': `Bearer ${token}`,
        };

        return new Promise((resolve, reject) => {
            fetch(input, init).then(
                (response) => {

                    if (!response) {
                        reject('error');
                        return
                    }

                    if (response.status == 401) {
                        reject('unauthorized');
                        return
                    }

                    response.json().then(
                        (obj) => resolve(obj),
                    ).catch(
                        (err) => reject(err)
                    );
                }
            ).catch(
                (error) => {
                    reject(error);
                }
            )
        });
    }
}

export default useApiFetch;