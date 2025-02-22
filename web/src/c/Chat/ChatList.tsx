import Link from "next/link";
import { FC } from "react";
import { Chat } from "../types";
import { Button, List, ListItem } from "@mui/joy";
import { css } from "@emotion/react";

export interface ChatListProps {
  items: Chat[] | undefined;
  current?: number;
}

const ChatList: FC<ChatListProps> = ({items, current}) => {
  return (
    <div
      css={css`
        display: flex;  
        flex-direction: column;
      `}
    >
      <div
        data-test="chat-list-header"
        css={css`
          height: 50px;
          border-bottom: 1px solid #ededed;
        `}
      >
        Test
      </div>
      <div
        data-test="chat-list-items"
        css={css`
          overflow: hidden;  
        `}
      >
        <List>
          {items?.map((chat) => (
            <ListItem key={chat.id} data-test={current}>
                <Link href={`/u/mesaje/${chat.id}`} prefetch={false}>
                    {chat.title}
                </Link>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ChatList;
