import { cookies } from "next/headers";
import 'server-only'

let isLoggedIn = false;

const useIsLoggedIn = async () => {

    const store = await cookies()

    const jwt = store.get('ahamjwt')

    if (jwt?.value) {
        
        const res = await fetch(
            'http://localhost:8080/v1/me',
            {
                headers: {
                    "Authorization": `Bearer ${jwt?.value}`
                },
                cache: 'no-store'
            }
        )
        
        if (res.status === 200) {
            return true;
        }
    }

    return isLoggedIn;
}

export default useIsLoggedIn;