import useApiFetch from '@/hooks/api'
import { User } from '../types';

const getUser = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const api = useApiFetch();
    return await api<User>('/me');
}

const getLoggedInState = async () => {
    
    let me = null;
    
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        me = await getUser();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(e: unknown) {
        return false;
    }

    if (me && typeof(me['hasOwnProperty']) != 'undefined') {
        return me.hasOwnProperty('id');
    }
    
    return false;
}

export {getUser, getLoggedInState};