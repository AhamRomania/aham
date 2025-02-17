import getApiFetch from '@/api/api'
import { User } from '../types';

const getUser = async (): Promise<User | null> => {
    const api = getApiFetch();
    return new Promise((resolve, reject) => {
        api<User>('/me').then((me: User) => {
            resolve(me);
        }).catch(() => reject());
    });
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