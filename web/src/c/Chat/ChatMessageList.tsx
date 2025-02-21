import { FC } from "react";
import { Chat } from "../types";
import { CircularProgress } from "@mui/joy";

export interface ChatMessageListProps {
    chat: Chat | null;
}

const ChatMessageList:FC<ChatMessageListProps> = ({chat}) => {

    if (!chat) {
        return (
            <CircularProgress size="sm"/>
        )
    }

    return (
        <div>{JSON.stringify(chat)}</div>
    )
}

export default ChatMessageList;