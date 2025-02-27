import { css } from "@emotion/react";
import { Divider, List, ListItem, ListItemButton, Modal, ModalDialog } from "@mui/joy";
import { FC, RefObject, useEffect, useReducer, useRef, useState } from "react";
import { Notification } from "../types";
import Link from "next/link";
import { markAsSeen } from "@/api/common";
import { Launch, Visibility } from "@mui/icons-material";

export interface NotificationsDialogProps {
  triggerRef: RefObject<HTMLElement | null>;
  open: boolean;
  items?: Notification[];
  onClose:()=>void;
}

const NotificationsDialog: FC<NotificationsDialogProps> = ({
  triggerRef,
  items,
  open,
  onClose,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    if (triggerRef && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
  }, [triggerRef]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const select = (n: Notification) => {
    markAsSeen(n).then(() => {
        n.seen = new Date();
        if (n.href) {
            window.location.href = n.href;
        }
        forceUpdate();
    })
  }
  return (
    <Modal open={open} hideBackdrop>
      <div ref={divRef}>
        <ModalDialog
          layout={`fullscreen`}
          css={css`
                display: ${rect ? "block" : "none"}
                position: absolute;
                right: 20px;
                top: 100px;
                left: auto;
                min-width: 300px;
                max-width: 300px;
                min-height: 400px;
                max-height: 400px;
                overflow-y: auto;
                padding: 10px 10px;
                @media (max-width: 768px) {
                    top: 80px;
                }
                .item {
                    border-bottom: 1px solid #eee;

                    &:last-child {
                        border-bottom: none;
                    }

                    a {
                        text-decoration: none;
                    }

                    &.unseen {
                        color: #000;
                    }

                    &.seen {
                        color: #999;
                        text-decoration: none;
                    }
                }
            `}
        >
            <List>
            {items?.map((item) => (
                <ListItemButton onClick={() => select(item)} key={item.id} className={item.seen ? 'item seen' : 'item unseen'}>
                    {item.title}
                    {item.href && <Launch fontSize="small" htmlColor="#DDD"/>}
                </ListItemButton>
            ))}
            </List>
        </ModalDialog>
      </div>
    </Modal>
  );
};

export default NotificationsDialog;
