"use client";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/c/Auth";
import CitySelect from "@/c/Form/CitySelect";
import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import { css } from "@emotion/react";
import { Apple, Google, X, Facebook } from "@mui/icons-material";
import { Autocomplete, AutocompleteOption, Button, CircularProgress, IconButton, Input, Option, Select, Stack } from "@mui/joy";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const api = useApiFetch();
  const [counties, setCounties] = useState([]);
  const [open, setOpen] = useState(false);
  const loading = open && counties.length === 0;

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
          h1 { margin-top: 20px; }
        `}
      >
        <Link href="/">
          <Logo bg="#9C27B0" color="#FFF" size={42} padding={18} />
        </Link>
        <h1>CONT NOU</h1>
      </div>

      <form
        autoComplete="none"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());

          api<{ token: string }>("/auth", {
            method: "POST",
            body: JSON.stringify(formJson),
          }).then((data) => {
            Cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.token, {
              expires: 30,
              //sameSite: "strict",
              //secure: true,
              //domain: "localhost",
            });

            window.location.href = "/anunt";
          });
        }}
      >
        <Stack spacing={1}>
          <Input
            name="email"
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
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            endDecorator={
                loading ? (
                <CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
                ) : null
            }
            options={counties}
            groupBy={o => o.county_name}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
                <AutocompleteOption {...props} key={option.id}>
                {option.name}
                </AutocompleteOption>
            )}
            ></Autocomplete>
          <Button size="lg" type="submit">
            Intră
          </Button>
        </Stack>
      </form>

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
