"use client";

import { css } from "@emotion/react";
import { Modal } from "@mui/joy";
import { FC, useEffect, useRef } from "react";
import AccountMenu from "../Widget/AccountMenu";

export interface UserMenuDialogProps {
  open: boolean;
  onClose: () => void;
}

const UserMenuDialog: FC<UserMenuDialogProps> = ({ open, onClose }) => {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
      <Modal hideBackdrop open={open} onClose={() => onClose()}>
        <div ref={divRef}>
          <div
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
            css={css`
              position: fixed;
              top: 80px;
              right: 15px;
              max-height: 500px;
              width: 80%;
              max-width: 300px;
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              background: var(--main-color);
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
              z-index: 100;
              overflow-y: scroll;
              border: 5px solid #fff;
            `}
          >
            <AccountMenu />
          </div>
        </div>
      </Modal>
  );
};

export default UserMenuDialog;
