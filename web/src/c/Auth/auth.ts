import useApiFetch from '@/hooks/api'

const useUser = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const api = useApiFetch();
    return await api<{id: string}>('/me');
}

const getLoggedInState = async () => {
    
    let me = null;
    
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        me = await useUser();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(e: unknown) {
        return false;
    }

    if (me && typeof(me['hasOwnProperty']) != 'undefined') {
        return me.hasOwnProperty('id');
    }
    
    return false;
}

export {useUser, getLoggedInState};