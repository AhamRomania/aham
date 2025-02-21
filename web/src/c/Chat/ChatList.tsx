import Link from "next/link";
import { FC } from "react";
import { Chat } from "../types";
import { Button } from "@mui/joy";

export interface ChatListProps {
  items: Chat[] | undefined;
  current?: number;
}

const ChatList: FC<ChatListProps> = ({items, current}) => {
  return (
    <div>
      {items?.map((chat) => (
        <div key={chat.id} data-test={current}>
            <Link href={`/u/mesaje/${chat.id}`} prefetch={false}>
                <Button variant={chat.id === current ? 'solid' : 'outlined'}>
                  {chat.title}
                </Button>
            </Link>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
