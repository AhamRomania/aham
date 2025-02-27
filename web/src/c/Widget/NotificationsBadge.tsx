"use client";

import { css } from "@emotion/react";
import { Notifications } from "@mui/icons-material";
import { FC, useEffect, useRef, useState } from "react";
import NotificationsDialog from "../Dialog/Notifications";
import { CircularProgress } from "@mui/joy";
import { getNotifications, getNotificationsCount } from "@/api/common";
import { Notification } from "../types";

const NotificationsBadge: FC = () => {
  const [count,setCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>();
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const triggerRef = useRef<HTMLDivElement|null>(null);
  useEffect(() => {
    setFetching(true)
    getNotifications(0,10).then(setNotifications);
    getNotificationsCount().then(
        (c) => {
            setFetching(false);
            setCount(c);
        }
    );
  }, [open]);
  const expand = () => {
    setOpen(true);
  }
  return (
    <div
      ref={triggerRef}
      onClick={() => expand()}
      css={css`
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 5px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f4f8;
            color: #fff;
            position: relative;
            &:hover {
                background:#d3d3d3;
            }
      `}
    >
      <div
        css={css`
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            display: flex;
            align-items: center;
            justify-content: center;
        `}
      >
        {fetching ? <CircularProgress thickness={2} size="sm"/> : <Notifications htmlColor="#000"/>}
      </div>
      {count>0&&<div
        css={css`
            position: absolute;
            right: 0px;
            top: 0px;
            width: 20px;
            height: 20px;
            background: #f44336;
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        `}
      >
        {count}
      </div>}
      <NotificationsDialog items={notifications || []} triggerRef={triggerRef} open={open} onClose={() => setOpen(true)}/>
    </div>
  );
};

export default NotificationsBadge;
