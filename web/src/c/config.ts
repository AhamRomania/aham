import getApiFetch from "../api/api";

export interface Config {
    GOOGLE_CLIENT_ID: string
}

let config: Config = null as unknown as Config;

const getConfig = async (): Promise<Config> => {

    const api = getApiFetch()

    if (config) {
        return Promise.resolve(config);
    }

    config = await api('/config')

    return Promise.resolve(config)
}

export default getConfig;