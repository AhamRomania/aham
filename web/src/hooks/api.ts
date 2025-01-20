import { getAccessToken } from "@/c/Auth";

const useApi = () => {

    const token = getAccessToken();

    console.log(token)
}

export default useApi;