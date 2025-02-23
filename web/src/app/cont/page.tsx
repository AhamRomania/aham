"use client";

import getApiFetch from "@/api/api";
import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import { CreateUserRequest, CreateUserResponse } from "@/c/types";
import { css } from "@emotion/react";
import Cookies from "js-cookie";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog
} from "@mui/joy";

import RegisterForm from "@/c/Form/Register";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const api = getApiFetch();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formDialogMessage, setFormDialogMessage] = useState(false);
  const [saving, setSaving] = useState(false);
  return (
    <div
      css={css`
        width: 323px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-item: center;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-bottom: 50px;
          h1 {
            margin-top: 20px;
          }
        `}
      >
        <Link href="/">
          <Logo bg="#9C27B0" color="#FFF" size={42} padding={21} />
        </Link>
        <h1>CONT NOU</h1>
      </div>

      <RegisterForm key="registerForm" saving={saving} onFormSubmit={(formJson: CreateUserRequest) => {
        setSaving(true);

        const referrer = Cookies.get('referrer');

        if (referrer != '') {
            formJson.referrer = referrer;
        }

        api<CreateUserResponse>("/users", {
          method: "POST",
          body: JSON.stringify({
            ...formJson,
          })
        }).then((response) => {
          setSaving(false);
          if (!response) {
            setFormDialogMessage(response);
            setFormDialogOpen(true);
          } else {
            window.location.href = `/cont/activeaza?name=${response.given_name}&id=${response.id}`;
          }
        }).catch(
          () => {
            setSaving(false);
          }
        );
      } } />

      <Modal open={formDialogOpen} onClose={() => setFormDialogOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Eroare creare cont
          </DialogTitle>
          <Divider />
          <DialogContent>
            {formDialogMessage}
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => setFormDialogOpen(false)}>
              OK
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      <OrSection>sau</OrSection>

      <Link href="/login">
        <Button
          style={{ width: "100%" }}
          size="lg"
          type="submit"
          variant="outlined"
        >
          Login
        </Button>
      </Link>

    </div>
  );
}
