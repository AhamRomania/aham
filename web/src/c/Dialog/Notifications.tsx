import { markAsSeen } from "@/api/common";
import { css } from "@emotion/react";
import { Launch } from "@mui/icons-material";
import { List, ListItemButton, Modal, ModalDialog } from "@mui/joy";
import { FC, RefObject, useEffect, useReducer, useState } from "react";
import { Notification } from "../types";

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
  const [rect, setRect] = useState<DOMRect>();
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    if (triggerRef && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
  }, [triggerRef]);
  
  const select = (n: Notification, e:MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsSeen(n).then(() => {
        n.seen = new Date();
        if (n.href) {
            onClose();
            window.location.href = n.href;
        }
        forceUpdate();
    })
  }
  return (
    <Modal open={open} hideBackdrop>
      <div>
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
                height: auto;
                bottom: auto;
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
                <ListItemButton onMouseDown={(e: any) => select(item,e)} key={item.id} className={item.seen ? 'item seen' : 'item unseen'}>
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
