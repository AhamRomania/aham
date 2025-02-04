import { Category } from "@/c/types";
import getApiFetch from "@/api/api";

let tree: Category[] = [];

export async function fetchCategories():Promise<Category[]> {
    if (tree) { return Promise.resolve(tree); }
    const api = getApiFetch();
    tree = await api<Category[]>(`/categories`);
    return tree;
}

export async function fetchCategory(id: number):Promise<Category> {
    const api = getApiFetch();
    return await api<Category>(`/categories/${id}`);
}