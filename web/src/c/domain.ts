export enum Domain {
    Web = 1,
    Api,
    Cdn,
    Url,
    ApiV1,
    Cookie
}

const getDomain = (context:Domain = Domain.Web, path: string = ''): string => {

    const dev = (process.env.NODE_ENV === 'development')
    
    let domain = '';

    switch (context) {
        case Domain.Cookie:
            return dev ? 'localhost' : '.aham.ro';
        case Domain.Api:
            domain = dev ? 'http://localhost:8001' : 'https://api.aham.ro';
            break;
        case Domain.ApiV1: // todo migrate by default to Api
            domain = dev ? 'http://localhost:8001/v1' : 'https://api.aham.ro/v1';
            break;
        case Domain.Cdn:
            domain = dev ? 'http://localhost:8002' : 'https://cdn.aham.ro';
            break;
        case Domain.Url:
            domain = dev ? 'http://localhost:8003' : 'https://url.aham.ro';
            break;
        case Domain.Web: default:
            domain = dev ? 'http://localhost:3000' : 'https://aham.ro';
            break;
    }

    return domain + path;
}

export default getDomain;