import { User } from "@/c/types";
import { getUser } from "@/c/Auth";

export async function getMe():Promise<User> {
    return getUser();
}