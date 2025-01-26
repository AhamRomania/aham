import useApiFetch from '@/hooks/api'

const getUser = async () => {
    const api = useApiFetch();
    return await api<{id: string}>('/me');
}

const getLoggedInState = async () => {
    
    let me = null;
    
    try {
        me = await getUser();
    } catch(e) {
        return false;
    }

    if (me && typeof(me['hasOwnProperty']) != 'undefined') {
        return me.hasOwnProperty('id');
    }
    
    return false;
}

export {getUser, getLoggedInState};