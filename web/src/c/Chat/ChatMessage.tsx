import { FC } from "react";
import { Message } from "../types";
import { css } from "@emotion/react";
import emoji from "emoji-dictionary";
import DOMPurify from 'dompurify';
import getDomain, { Domain } from "../domain";

export interface ChatMessageProps {
  message: Message;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className="message"
      css={css`
        font-size: 15px;
      `}
    >
      <p dangerouslySetInnerHTML={{ __html: convertMessage(message.message) }} />
    </div>
  );
};

const convertMessage = (message: string) => {
  const urlRegex = /https?:\/\/[^\s]+/g; // Regex to detect URLs
  const emojiRegex = /(:[\w+-]+:)/g; // Regex to detect emoji shortcodes (e.g., :smile:)

  // Step 1: Replace URLs with anchor tags
  let htmlMessage = message.replace(urlRegex, (url) => {
    return `<a href="${getDomain(Domain.Url,`?external=${url}`)}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  // Step 2: Replace emoji shortcodes with actual emoji characters
  htmlMessage = htmlMessage.replace(emojiRegex, (match) => {
    const emojiChar = emoji.getUnicode(match); // Convert shortcode to emoji
    return emojiChar ? emojiChar : match; // Fallback to the shortcode if emoji is not found
  });

  return DOMPurify.sanitize(htmlMessage);
};

export default ChatMessage;
