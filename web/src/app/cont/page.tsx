"use client";

import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import useApiFetch from "@/hooks/api";
import { css } from "@emotion/react";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import {
    Autocomplete,
    Button,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Input,
    Modal,
    ModalDialog,
    Stack
} from "@mui/joy";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const api = useApiFetch();
  const [counties, setCounties] = useState([]);
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(0);
  const loading = open && counties.length === 0;

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formDialogMessage, setFormDialogMessage] = useState(false);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    api("/cities").then(setCounties);

    return () => {
      active = false;
    };
  }, [loading]);

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
          <Logo bg="#9C27B0" color="#FFF" size={42} padding={18} />
        </Link>
        <h1>CONT NOU</h1>
      </div>

      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          formJson.city = city.id;
          api<{ token: string }>("/users", {
            method: "POST",
            body: JSON.stringify(formJson),
          }).then((data) => {
            window.location.href = `/cont/succes?id=${data.id}&name=${data.given_name}`;
          }).catch(e => {
            setFormDialogOpen(true)
            setFormDialogMessage(e);
          });
        }}
      >
        <Stack spacing={1}>
          <Input
            name="email"
            autoComplete="off"
            type="text"
            placeholder="Email"
            size="lg"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Parolă"
            size="lg"
            required
          />
          <Input
            name="given_name"
            type="text"
            placeholder="Prenume"
            size="lg"
            required
          />
          <Input
            name="family_name"
            type="text"
            placeholder="Nume"
            size="lg"
            required
          />
          <Input
            name="phone"
            type="text"
            placeholder="Număr de telefon"
            size="lg"
            required
          />
          <Autocomplete
            placeholder="Localitate"
            name="city"
            required
            size="lg"
            onChange={(event, value) => {
              setCity(value);
            }}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            endDecorator={
              loading ? (
                <CircularProgress
                  size="sm"
                  sx={{ bgcolor: "background.surface" }}
                />
              ) : null
            }
            options={counties}
            groupBy={(o) => o.county_name}
            getOptionLabel={(option) => option.name}
            getOptionKey={(o) => o.id}
          ></Autocomplete>
          <Button size="lg" type="submit">
            Crează
          </Button>
        </Stack>
      </form>

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
