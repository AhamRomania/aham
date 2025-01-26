import useApiFetch from '@/hooks/api'

const getUser = async () => {
    const api = useApiFetch();
    return await api<{id: string}>('/me');
}

const getLoggedInState = async () => {
    const me = await getUser();
    if (me && typeof(me['hasOwnProperty']) != 'undefined') {
        return me.hasOwnProperty('id');
    }
    return false;
}

export {getUser, getLoggedInState};