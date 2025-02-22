"use client";
import getApiFetch from "@/api/api";
import { getChats } from "@/api/chat";
import { css } from "@emotion/react";
import { CircularProgress } from "@mui/joy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useContext, useEffect, useReducer, useState } from "react";
import { AccountLayoutContext } from "../Layout/account";
import { Ad, User, Chat as Vo } from "../types";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatMessageList from "./ChatMessageList";
import { getUser } from "../Auth";

export interface ChatProps {
  selected?: number;
}

const Chat: FC<ChatProps> = ({ selected }) => {
  const router = useRouter();
  const api = getApiFetch();
  const [user, setUser] = useState<User|null>(null);
  const [chats, setChats] = useState<Vo[] | null>(null);
  const [chat, setChat] = useState<Vo | null>(null);
  const [adURL, setAdURL] = useState("");
  const { setPath } = useContext(AccountLayoutContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  useEffect(() => {
    if (!selected && chats && chats.length) {
      router.push(`/u/mesaje/${chats[0].id}`);
    }
  }, [chats]);

  useEffect(() => {
    if (chat && chat?.reference) {
      api<Ad>(`/ads/${chat?.reference}`).then((ad) => {
        setAdURL("/" + ad.href);
      });
    }
  }, [chat]);

  useEffect(() => {
    setPath(
      <>
        <span>Mesaje</span>
        {chat ? (
          adURL ? (
            <Link target="_blank" prefetch={false} href={adURL}>
              {chat.title}
            </Link>
          ) : (
            <span>{chat.title}</span>
          )
        ) : (
          typeof(chat) === 'undefined' ? <CircularProgress size="sm" /> : ''
        )}
      </>
    );
  }, [chat, adURL]);

  useEffect(() => {
    getChats().then(setChats);
  }, []);

  useEffect(() => {
    if (chats && selected) {
      setChat(chats.find((i) => i.id === selected) || null);
    }
  }, [chats, selected]);

  const fetchMessages = () => {
    if (chat) {
      setChat({ ...chat, id: chat.id! });
      forceUpdate();
    }
  };

  const onMessageCreated = () => {
    fetchMessages();
  };

  const onChatListChange = () => {
    getChats().then(setChats);
  }

  return (
    <div
      css={css`
        display: flex;
        height: 100%;
        flex: 1;
        aside {
          min-width: 300px;
          border-right: 1px solid #ededed;
        }
      `}
    >
      <aside>
        <ChatList user={user} onChange={onChatListChange} items={chats || []} current={selected} />
      </aside>
      <div
        css={css`
          display: flex;
          height: 100%;
          width: 100%;
          flex-direction: column;
        `}
      >
        <ChatMessageList chat={chat} />
        {chat && <ChatInput onMessageCreated={onMessageCreated} chat={chat} />}
      </div>
    </div>
  );
};

export default Chat;
