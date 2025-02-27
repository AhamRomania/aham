import getApiFetch from '@/api/api'
import { User } from '../types';
import { destroyAccessToken, getAccessToken } from './token';

const destroyCurrentSession = async () => {
    
    const forceDelete = async () => {
        if (await getAccessToken()) {
            destroyAccessToken();
            setTimeout(forceDelete, 0);
        }
    };
    
    await forceDelete();

    return
};

const getUser = async (): Promise<User | null> => {
    const api = getApiFetch();
    return new Promise((resolve) => {
        api<User>('/me',{cache:'no-cache'}).then((me: User) => {
            resolve(me);
        }).catch(()=>{
            resolve(null);
        });
    });
}

const getLoggedInState = async ():Promise<boolean> => {

    const me = await getUser();

    if (!me) {
        return false
    }

    if (me && me.id) {
        return true;
    }

    return false;
}

export {getUser, getLoggedInState, destroyCurrentSession};