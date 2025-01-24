"use client";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/c/Auth";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import { css } from "@emotion/react";
import { Apple, Google, X, Facebook } from "@mui/icons-material";
import { Button, IconButton, Input, Stack } from "@mui/joy";
import Cookies from "js-cookie";

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

      <div
        css={css`
          display: flex;
          justify-content: center;
          margin-top: 20px;
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
          <Tip title="Connectare cu Apple">
            <IconButton variant="outlined" size="lg">
              <Apple />
            </IconButton>
          </Tip>
          <Tip title="Conectare cu Google">
            <IconButton variant="outlined" size="lg">
              <Google />
            </IconButton>
          </Tip>
          <Tip title="Conectare cu Facebook">
            <IconButton variant="outlined" size="lg">
              <Facebook />
            </IconButton>
          </Tip>
          <Tip title="Conectare cu X">
            <IconButton variant="outlined" size="lg">
              <X />
            </IconButton>
          </Tip>
        </div>
      </div>
    </div>
  );
}
