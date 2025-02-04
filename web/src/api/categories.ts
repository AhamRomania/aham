import { Category } from "@/c/types";
import useApiFetch from "@/hooks/api";

let tree: Category[] = [];

export async function fetchCategories():Promise<Category[]> {
    if (tree) { return Promise.resolve(tree); }
    const api = useApiFetch();
    tree = await api<Category[]>(`/categories`);
    return tree;
}

export async function fetchCategory(id: number):Promise<Category> {
    const api = useApiFetch();
    return await api<Category>(`/categories/${id}`);
}