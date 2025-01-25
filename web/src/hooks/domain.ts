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
            domain = dev ? 'http://localhost:8080' : 'https://api.aham.ro';
            break;
        case Domain.Cdn:
            domain = dev ? 'http://localhost:8081' : 'https://cdn.aham.ro';
            break;
        case Domain.Web: default:
            domain = dev ? 'http://localhost:3000' : 'https://aham.ro';
            break;
    }

    return domain + path;
}

export default useDomain;