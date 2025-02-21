"use client";
import { getChat, getChats } from "@/api/chat";
import { css } from "@emotion/react";
import { CircularProgress } from "@mui/joy";
import { FC, useContext, useEffect, useState } from "react";
import { AccountLayoutContext } from "../Layout/account";
import { Ad, Chat as Vo } from "../types";
import ChatList from "./ChatList";
import ChatMessageList from "./ChatMessageList";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LinkSharp, Preview } from "@mui/icons-material";
import getApiFetch from "@/api/api";

export interface ChatProps {
  selected?: number;
}

const Chat: FC<ChatProps> = ({ selected }) => {
  const router = useRouter();
  const api = getApiFetch();
  const [chats, setChats] = useState<Vo[]>();
  const [chat, setChat] = useState<Vo | null>(null);
  const [adURL, setAdURL] = useState('');
  const { setPath } = useContext(AccountLayoutContext);

  useEffect(() => {
    if (!selected && chats) {
      router.push(`/u/mesaje/${chats[0].id}`);
    }
  }, [chats]);

  useEffect(() => {
      api<Ad>(`/ads/${chat?.reference}`).then(
        (ad) => {
          setAdURL('/'+ad.href);
        }
      )
  }, [chat]);

  useEffect(() => {
    setPath(
      <>
        <span>Mesaje</span>
        {chat ? (adURL?<Link target="_blank" prefetch={false} href={adURL}>{chat.title}</Link>:<span>{chat.title}</span>) : <CircularProgress size="sm" />}
      </>
    );
  }, [chat,adURL]);

  useEffect(() => {
    getChats().then(setChats);
  }, []);

  useEffect(() => {
    if (chats && selected) {
      setChat(chats.find((i) => i.id === selected)!);
    }
  }, [chats, selected]);

  return (
    <div
      css={css`
        display: flex;
        height: 100%;
        flex: 1;
        aside {
          min-width: 300px;
          border-right: 1px solid #ddd;
        }
      `}
    >
      <aside>
        <ChatList items={chats} current={selected} />
      </aside>
      <ChatMessageList chat={chat} />
    </div>
  );
};

export default Chat;
