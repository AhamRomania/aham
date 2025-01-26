export enum Domain {
    Web = 1,
    Api,
    Cdn,
}

const useDomain = (context:Domain = Domain.Web, path: string = ''): string => {

    const dev = (process.env.NODE_ENV === 'development')
    
    let domain = '';

    switch (context) {
        case Domain.Api:
            domain = dev ? 'https://api.aham.ro' : 'https://api.aham.ro';
            break;
        case Domain.Cdn:
            domain = dev ? 'https://cdn.aham.ro' : 'https://cdn.aham.ro';
            break;
        case Domain.Web: default:
            domain = dev ? 'http://localhost:3000' : 'https://aham.ro';
            break;
    }

    return domain + path;
}

export default useDomain;