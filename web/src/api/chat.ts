import { Chat, Message } from "@/c/types";
import getApiFetch from "./api";

export async function getChats(): Promise<Chat[]> {
    return await getApiFetch()<Chat[]>(`/chat`);
}

export async function getChatMessages(id: number): Promise<Message[]> {
    return await getApiFetch()<Message[]>(`/chat/${id}`);
}
