import { getAccessToken } from '@/c/Auth'

const getUser = async () => {

    const token = await getAccessToken()
    
    if (token) {

        const res = await fetch(
            'http://localhost:8080/v1/me',
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                cache: 'no-store'
            }
        )
        
        if (res.status === 200) {
            const data = await res.json();
            return data;
        }
    }

    return false;
}

const getLoggedInState = async () => {

    const me = await getUser();

    if (me && typeof(me['hasOwnProperty']) != 'undefined') {
        return me.hasOwnProperty('id');
    }

    return false;
}

export {getUser, getLoggedInState};