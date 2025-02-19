export type User = {
    id: number;
    username?: string;
    given_name: string;
    family_name: string;
    avatar?: string;
    role: string;
}

export type Category = {
    id: number;
    name: string;
    description: string;
    slug: string;
    href: string;
    path: string;
    price?: boolean;
    children?: Category[];
}

export type Prop = {
    id: number;
    name: string;
    title: string;
    group: string;
    required: boolean;
    template: string;
    description: string;
    help: string;
    type: string;
    sort: number;
    options: any;
    microdata: any;
    inherited: boolean;
}

export type County = {
    id: number;
    name: string;
}

export type City = {
    id: number;
    county: number;
    name: string;
    county_name: string;
}

export type Location = {
    href: string;
    text: string;
    refs: number[];
}

export type Ad = {
    id: number,
    category: Category,
    slug: string,
    owner: User,
    title: string,
    description: string,
    pictures: string[],
    url: string;
    href: string;
    price: number;
    currency: 'Lei',
    location: Location;
    messages: boolean,
    status: 'published',
    created: string
    props:{[key:string]:any}
    promotion: boolean;
}

export type TokenResponse = {
    token: string;
}

export type CreateUserRequest = {
    given_name: string;
    family_name: string;
    city: number;
    phone: string;
}

export type CreateUserResponse = {
    id: number;
    given_name: string;
}

export type Chat = {
    id: number;
    title: string;
    context: string;
    reference: string;
    participants: User[];
    created_at: string;
}

export type Message = {
    id: number;
    from: User;
    message: string;
    seen: {[key: number]: string};
    created_at: string;
}

export type SeoEntry = {
    id: number;
    uri: string;
    title: string;
    description: string;
    keywords: string;
    image: string;
}

export type AdMetrics = {
    views: number;
    messages: number;
    favourites: number;
    week: number[];
}

export type ReportData = {
    name: string
    email: string
    reason: string
    message: string
    reference: string;
}

export type D = { [key: string]: any };