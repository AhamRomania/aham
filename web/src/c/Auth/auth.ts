import getApiFetch from '@/api/api'
import { User } from '../types';

const getUser = async () => {
    const api = getApiFetch();
    return await api<User>('/me');
}

const getLoggedInState = async () => {
    
    let me = null;
    
    try {
        me = await getUser();
        // eslint-disable-next-line
    } catch(e: unknown) {
        return false;
    }

    if (me && typeof(me['hasOwnProperty']) != 'undefined') {
        return me.hasOwnProperty('id');
    }
    
    return false;
}

export {getUser, getLoggedInState};