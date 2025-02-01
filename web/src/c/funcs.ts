import { User } from "./types"

export const isPrivilegedUser = (user: User): boolean => {
    const roles = ['root','admin','moderator'];
    return roles.includes(user.role);
}