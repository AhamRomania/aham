export type Category = {
    id: number;
    name: string;
    slug: string;
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
    owner: number,
    title: string,
    description: string,
    pictures: string[],
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
