"use client";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/c/Auth";
import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import { css } from "@emotion/react";
import { Apple, Google, X, Facebook } from "@mui/icons-material";
import { Button, IconButton, Input, Stack } from "@mui/joy";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Page() {
  const api = useApiFetch();

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
          <Logo bg="#9C27B0" color="#FFF" size={42} padding={21} />
        </Link>
        <h1>CONECTARE</h1>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          
          api<{token: string}>("/auth", {
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
          <Input name="email" type="text" placeholder="Email" size="lg" required />
          <Input
            name="password"
            type="password"
            placeholder="Parolă"
            size="lg"
            required
          />
          <Button size="lg" type="submit">
            Intră
          </Button>
        </Stack>
      </form>

      <OrSection>sau cu</OrSection>

      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <div
          css={css`
            width: 200px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 10px;
          `}
        >
          
            <IconButton disabled variant="outlined" size="lg">
              <Tip title="Connectare cu Apple">
                <Apple />
              </Tip>
            </IconButton>
          
          
            <IconButton variant="outlined" size="lg">
              <Tip title="Conectare cu Google">
                <Google />
              </Tip>
            </IconButton>
          
            <IconButton disabled variant="outlined" size="lg">
              <Tip title="Conectare cu Facebook">
                <Facebook />
              </Tip>
            </IconButton>
          
            <IconButton disabled variant="outlined" size="lg">
              <Tip title="Conectare cu X">
                <X />
              </Tip>
            </IconButton>
        </div>
      </div>

      <OrSection>sau</OrSection>

      <Link href="/cont">
        <Button style={{width: '100%'}} size="lg" type="submit" variant="outlined">
          Crează cont nou
        </Button>
      </Link>

    </div>
  );
}
