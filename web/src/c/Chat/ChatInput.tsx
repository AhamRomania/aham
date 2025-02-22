import { css } from "@emotion/react";
import { Send } from "@mui/icons-material";
import { Button, Input } from "@mui/joy";
import { FC, useState } from "react";
import { Chat } from "../types";
import getApiFetch from "@/api/api";

export interface ChatInputProps {
  chat: Chat | null;
  onMessageCreated: (value: string) => void;
}

const ChatInput: FC<ChatInputProps> = ({ chat, onMessageCreated }) => {
  const api = getApiFetch();
  const [value, setValue] = useState<string>("");
  const handleSubmit = () => {
    if (chat) {
      api(`/chat/${chat.id}`, {
        method: "POST",
        body: JSON.stringify({ message: value }),
      })
        .then(() => {
            onMessageCreated(value);
            setValue("");
        })
        .catch(() => {
          alert("Nu am putut trimite mesajul.");
          setValue("");
        });
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      css={css`
        height: 70px;
        display: flex;
        padding: 5px;
        gap: 5px;
        width: 100%;
        border-top: 1px solid #ededed;
        .MuiTextarea-textarea {
          flex: 1;
        }
      `}
    >
      <Input
        onKeyDown={handleKeyDown}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        css={css`
          flex: 1;
        `}
      />
      <Button onClick={handleSubmit}>
        <Send />
      </Button>
    </div>
  );
};

export default ChatInput;
