import getDomain, { Domain } from "../domain";
import { isBrowserContext } from "../funcs";
import { AuthInfo } from "../types";
import Cookies from "js-cookie";
// On auth a cookie is stored with this name
const ACCESS_TOKEN_COOKIE_NAME = 'aham';

const destroyAccessToken = async () => {
    if (isBrowserContext()) {
        if (Cookies.get(ACCESS_TOKEN_COOKIE_NAME)) {
            return Cookies.remove(ACCESS_TOKEN_COOKIE_NAME, {path: '/', domain: getDomain(Domain.Cookie)});
        }
    } else {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const cookies = await (await require('next/headers')).cookies()
        const cookie = cookies.get(ACCESS_TOKEN_COOKIE_NAME)
        if (cookie  && cookie.value) {
            cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", { expires: new Date(0), path: '/', domain: getDomain(Domain.Cookie) });
        }
    }
}

// Get access token from browser or request
const getAccessToken = async (): Promise<string | null> => {
    if (isBrowserContext()) {
        if (Cookies.get(ACCESS_TOKEN_COOKIE_NAME)) {
            return Cookies.get(ACCESS_TOKEN_COOKIE_NAME)!;
        }

    } else {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const cookies = await (await require('next/headers')).cookies()
        const cookie = cookies.get(ACCESS_TOKEN_COOKIE_NAME)
        if (cookie  && cookie.value) {
            return cookie.value;
        }
    }

    return null;
}

const setAccessToken = async(data: AuthInfo):Promise<void> => {
    if (isBrowserContext()) {
        Cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.token, {expires: data.expire, path:'/', domain: getDomain(Domain.Cookie)});
    } else {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const cookies = await (await require('next/headers')).cookies()
        cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.token, {expires: data.expire, path: '/', domain: getDomain(Domain.Cookie)});
    }
}

export {
    getAccessToken,
    destroyAccessToken,
    setAccessToken,
    ACCESS_TOKEN_COOKIE_NAME
}