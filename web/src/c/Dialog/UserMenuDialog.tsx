"use client";

import { css } from "@emotion/react";
import { Modal } from "@mui/joy";
import { FC } from "react";
import AccountMenu from "../Widget/AccountMenu";

export interface UserMenuDialogProps {
  open: boolean;
  onClose: () => void;
}

const UserMenuDialog: FC<UserMenuDialogProps> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={() => onClose()}>
      <>
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
      </>
    </Modal>
  );
};

export default UserMenuDialog;
