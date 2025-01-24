"use client";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/c/Auth";
import Tip from "@/c/tooltip";
import { css } from "@emotion/react";
import { Apple, Google, X, Facebook } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import Cookies from "js-cookie";

export default function Page() {
  const onLogin = () => {
    const userElement = document.getElementById("user");
    const passElement = document.getElementById("pass");

    if (!userElement || !passElement) {
      return;
    }

    const user = (userElement as HTMLInputElement).value;
    const pass = (passElement as HTMLInputElement).value;

    fetch("https://api.aham.ro/v1/auth", {
      method: "POST",
      body: JSON.stringify({ email: user, password: pass }),
    }).then((resp) => {
      if (resp.status != 200) {
        return;
      }

      resp.json().then((data) => {
        Cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.token, {
          expires: 30,
          sameSite: "strict",
          secure: true,
          domain: "aham.ro",
        });

        window.location.href = "/anunt";
      });
    });
  };

  return (
    <>
      <div style={{ margin: "0 auto", width: 1024 }}>
        <input id="user" type="text" placeholder="User" />
        <input id="pass" type="password" placeholder="Pass" />
        <button onClick={() => onLogin()}>Login</button>
      </div>

      <div css={css`width: 200px;display: grid;grid-template-columns: 1fr 1fr 1fr 1fr;gap: 10px;`}>
        <Tip title="Connectare cu Apple">
          <IconButton variant="solid">
            <Apple />
          </IconButton>
        </Tip>
        <Tip title="Conectare cu Google">
          <IconButton variant="solid">
            <Google />
          </IconButton>
        </Tip>
        <Tip title="Conectare cu Facebook">
          <IconButton variant="solid">
            <Facebook />
          </IconButton>
        </Tip>
        <Tip title="Conectare cu X">
          <IconButton variant="solid">
            <X />
          </IconButton>
        </Tip>
      </div>
    </>
  );
}
