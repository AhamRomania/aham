"use client";

import { css } from "@emotion/react";
import { Notifications } from "@mui/icons-material";
import { FC } from "react";

const NotificationsBadge: FC = () => {
  return (
    <div
      css={css`
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F0F4F8;
        color: #fff;
        position: relative;
      `}
    >
      <div
        css={css`
          position: absolute;
          right: 2px;
          top: 2px;
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
        10
      </div>
      <Notifications htmlColor="#000" />
    </div>
  );
};

export default NotificationsBadge;
