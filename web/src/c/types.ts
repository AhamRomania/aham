export type Ad = {
    id: number,
    category_id: number,
    caregory: {
        id: number,
        name: string,
        slug: string
    },
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