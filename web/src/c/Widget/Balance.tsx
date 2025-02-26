"use client";

import { getBalance } from "@/api/common";
import { css } from "@emotion/react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { toMoney } from "../formatter";

const Balance: FC = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    getBalance().then(setBalance);
  }, []);

  return (
    <div
      css={css`
        height: 42px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        color: #000;
        justify-content: center;
        padding: 0 5px 0 10px;
        background: #F0F4F8;
        font-size: 16px;
        font-weight: 100;
        font-family: "Courier New", Courier, monospace;
        strong {
            margin-top: 2px;
        }
        img {
          margin-left: 5px;
        }
      `}
    >
      <strong>{balance > 0 ? toMoney(balance) : 0}</strong>
      <Image
        alt="coins"
        width={16}
        height={16}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABVUlEQVR4nO1WQU7DMBA0ildQfoA48RDu5RnlSOkX+AS8Agl2Qx/Asb3xBFQOIBDXquz2YLSRGy7QJBtHlVBGsuTE6804Ox7buR5GhEd3sL7PzhjhhhHmQv6ZEZbaYn+uY+s8G2qsSwkmOGeCdyEIdZrGMsEoyceF/PgnuX8S8leC/nSV75+EB3eoTfv6rhgrYsr4cXsC6BdFMvSTENxeVbzGSO4v45xFewIUV2MhQBDSESBLCRIS4IYiTE4g6DbMsyEjXDPC7JdtONOxzTZMXwL8rxoIfzvcihHe6tbdpAFu6HAx+WdRb4IPRvgya0A6crjaGhCLw6GfRAIvy+ngONy6gVkDYlF3SSCBBqSlupngNQrVqgHoxOFqH0bS0uHCnTvS561/Cv3FzjTAVRcS6VgDVQty/SknbYwozVXL2614m7qbgAlGO7tub9DUB8qJPXo4G74BQpgHCXHbt1AAAAAASUVORK5CYII="
      />
    </div>
  );
};

export default Balance;
