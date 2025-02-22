import { getChatMessages } from "@/api/chat";
import { css } from "@emotion/react";
import { CircularProgress } from "@mui/joy";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import UserAvatar from "../avatar";
import Tip from "../tooltip";
import { Chat, Message } from "../types";
import ChatMessage from "./ChatMessage";

export interface ChatMessageListProps {
    chat: Chat | null;
}

const ChatMessageList:FC<ChatMessageListProps> = ({chat}) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>();

    useEffect(() => {
        if (chat) {
            getChatMessages(chat.id).then(setMessages);
        }
    }, [chat]);

    useEffect(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight; // Scroll to top
        }
    }, [messages]);

    if (typeof(chat) == 'undefined') {
        return (
            <div
                ref={containerRef}
                css={css`
                    flex: 1;
                    overflow-y: auto;
                    display:flex;
                    justify-content: center;
                    align-items: center;
                `}
            >
                <CircularProgress size="sm"/>
            </div>
        )
    }

    if (chat == null) {
        return (
            <div
                ref={containerRef}
                css={css`
                    flex: 1;
                    overflow-y: auto;
                    display:flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    color: #999;
                `}
            >
                Aici vezi mesajele primite
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            css={css`
                flex: 1;
                overflow-y: auto;
            `}
        >
            <ul
                css={css`
                    padding: 40px;
                    flex: 1;
                    list-style-type:none;
                `}
            >
                {messages?.map((item, index) => (
                    <li
                        key={index}
                        className={index === 3 ? 'right' : 'left'}
                        css={css`
                            display: flex;
                            margin-bottom: 10px;
                            .message {
                                padding: 12px;
                                margin-bottom: 10px;
                                border-radius: 8px;
                                border: 1px solid #eaeaea;
                                margin-top: -2px;
                                max-width: 500px;
                            }

                            &.right {
                                flex-direction: row-reverse;
                            }

                            &.right .message {
                                margin-right: 10px;
                            }

                            &.left .message {
                                margin-left: 10px;
                            }
                        `}
                    >
                        <Tip title={item.from.given_name}>
                            <Link href={`/u/` + item.id} target="_blank" prefetch={false}>
                                <UserAvatar/>
                            </Link>
                        </Tip>
                        <ChatMessage message={item}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ChatMessageList;