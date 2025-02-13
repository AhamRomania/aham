export type User = {
    id: number;
    given_name: string;
    family_name: string;
    role: string;
}

export type Category = {
    id: number;
    name: string;
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

export type Ad = {
    id: number,
    category_id: number,
    category: Category,
    slug: string,
    owner_id: number,
    owner: User,
    title: string,
    description: string,
    pictures: string[],
    url: string;
    href: string;
    price: number;
    currency: 'Lei',
    city: number,
    city_name: string;
    messages: boolean,
    status: 'published',
    created: string
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
