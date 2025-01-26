"use client";

import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import useApiFetch from "@/hooks/api";
import { css } from "@emotion/react";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import {
    Autocomplete,
    Button,
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
import { IMaskInput } from "react-imask";

export default function Page() {
  const api = useApiFetch();
  const [counties, setCounties] = useState([]);
  const [city, setCity] = useState(0);
  const [phone,setPhone] = useState('(100) 000-000')
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formDialogMessage, setFormDialogMessage] = useState(false);

  useEffect(() => {
    api("/cities").then(setCounties);
  }, [api]);

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

      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          formJson.city = city.id;
          formJson.phone = phone;
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
            size="lg"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            slotProps={{ input: { component: ()=>(
              <IMaskInput
                mask="+4\0 000 000 000"
                definitions={{}}
                placeholder="Număr de telefon"
                overwrite="shift"
                css={css`
                  outline: none;
                  background: transparent;
                  border: none;
                  font-size: 19px;
                  &::placeholder {
                    color: #7A7F82;
                  }
                `}
              />
            ) } }}
          />
          <Autocomplete
            placeholder="Localitate"
            name="city"
            required
            size="lg"
            onChange={(event, value) => {
              setCity(value);
            }}
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
