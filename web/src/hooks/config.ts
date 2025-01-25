import useApiFetch from "./api";
import useDomain, { Domain } from "./domain";

export interface Config {
    GOOGLE_CLIENT_ID: string
}

let config: Config = null as unknown as Config;

const getConfig = async (): Promise<Config> => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const api = useApiFetch()

    if (config) {
        return Promise.resolve(config);
    }

    config = await api('/config')

    return Promise.resolve(config)
}

export default getConfig;