

// On auth a cookie is stored with this name
const ACCESS_TOKEN_COOKIE_NAME = 'ahamjwt';

// Get access token from browser or request
const getAccessToken = async (): Promise<string | null> => {

    if (typeof window !== 'undefined') {

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const cookies = require("js-cookie");

        if (cookies.get(ACCESS_TOKEN_COOKIE_NAME)) {
            return cookies.get(ACCESS_TOKEN_COOKIE_NAME);
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

export {
    getAccessToken,
    ACCESS_TOKEN_COOKIE_NAME
}