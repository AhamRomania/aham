import getApiFetch from '@/api/api'
import { User } from '../types';
import { destroyAccessToken } from './token';

const destroyCurrentSession = () => {
    if (typeof(localStorage) != 'undefined') {
        localStorage.removeItem('me');
    }
    destroyAccessToken();
}

const getUser = async (): Promise<User | null> => {
    if (typeof(localStorage) != 'undefined' && localStorage.getItem('me')) {
        return Promise.resolve(
            JSON.parse(localStorage.getItem('me') as string),
        );
    }
    const api = getApiFetch();
    return new Promise((resolve, reject) => {
        api<User>('/me').then((me: User) => {
            if (typeof(localStorage) != 'undefined') {
                localStorage.setItem('me', JSON.stringify(me));
            }
            resolve(me);
        }).catch(reject);
    });
}

const getLoggedInState = async () => {
    
    let me = null;
    
    try {
        me = await getUser();
    } catch(e: unknown) {
        return false;
    }

    if (me && typeof(me['hasOwnProperty']) != 'undefined') {
        return me.hasOwnProperty('id');
    }
    
    return false;
}

export {getUser, getLoggedInState, destroyCurrentSession};