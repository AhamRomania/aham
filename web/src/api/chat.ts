import { Chat } from "@/c/types";
import getApiFetch from "./api";

export async function getChats(): Promise<Chat[]> {
    return await getApiFetch()<Chat[]>(`/chat`);
}

export async function getChat(id: number): Promise<Chat> {
    return await getApiFetch()<Chat>(`/chat/${id}`);
}
