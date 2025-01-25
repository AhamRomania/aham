"use client";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/c/Auth";
import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import getConfig, { Config } from "@/hooks/config";
import { css } from "@emotion/react";
import { Google, X, Facebook } from "@mui/icons-material";
import { Button, IconButton, Input, Stack } from "@mui/joy";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  
  const api = useApiFetch();
  
  const [config, setConfig] = useState<Config>({} as Config);

  useEffect(() => {
    getConfig().then(setConfig);
  }, [])

  useEffect(() => {
    if (config && window && document) {
      const script = document.createElement("script");
      const body = document.getElementsByTagName("body")[0];
      script.src = "//apis.google.com/js/api:client.js";
      body.appendChild(script);
      console.log(config)
      script.addEventListener("load", () => {
        gapi.load("auth2", function (auth2: unknown) {
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          auth2 = gapi.auth2.init({
            client_id: config.GOOGLE_CLIENT_ID,
            cookiepolicy: "single_host_origin",
          });

          const element = document.getElementById("connect_with_google");

          auth2.attachClickHandler(
            element,
            {},
            function (googleUser: unknown) {
              console.log(googleUser.getBasicProfile());
            },
            function (error: unknown) {
              alert(JSON.stringify(error, undefined, 2));
            }
          );
        });
      });
    }
  }, [config]);

  return (
    <>
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
          <h1>CONECTARE</h1>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData).entries());

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
              display: flex;
              justify-content: center;
              gap: 10px;
            `}
          >
            <div>
              <Tip title="Conectare cu Google">
                <IconButton
                  id="connect_with_google"
                  variant="outlined"
                  size="lg"
                >
                  <Google />
                </IconButton>
              </Tip>
            </div>

            <div>
              <Tip title="Conectare cu Facebook">
                <IconButton variant="outlined" size="lg">
                  <Facebook />
                </IconButton>
              </Tip>
            </div>

            <div>
              <Tip title="Conectare cu X">
                <IconButton variant="outlined" size="lg">
                  <X />
                </IconButton>
              </Tip>
            </div>
          </div>
        </div>

        <OrSection>sau</OrSection>

        <Link href="/cont">
          <Button
            style={{ width: "100%" }}
            size="lg"
            type="submit"
            variant="outlined"
          >
            Crează cont nou
          </Button>
        </Link>
        <div
          id="g_id_onload"
          data-client_id="YOUR_GOOGLE_CLIENT_ID"
          data-login_uri="https://aham.ro/cont"
          data-auto_prompt="true"
        ></div>
      </div>
    </>
  );
}
