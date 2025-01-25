"use client";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/c/Auth";
import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import Tip from "@/c/tooltip";
import useApiFetch from "@/hooks/api";
import getConfig, { Config } from "@/hooks/config";
import { css } from "@emotion/react";
import { Google, Facebook } from "@mui/icons-material";
import { Button, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Input, Modal, ModalDialog, Stack } from "@mui/joy";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export default function Page() {
  const api = useApiFetch();

  const [config, setConfig] = useState<Config>({} as Config);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');

  useEffect(() => {
    getConfig().then(setConfig);
  }, []);

  useEffect(() => {
    if (config && window && document) {
      const script = document.createElement("script");
      const body = document.getElementsByTagName("body")[0];
      script.src = "https://connect.facebook.net/ro_RO/all.js";
      body.appendChild(script);
      script.addEventListener("load", () => {
        FB.init({
          appId: "1772505873603982",
          oauth: true,
          status: true, // check login status
          cookie: true, // enable cookies to allow the server to access the session
          xfbml: true, // parse XFBML
        });
      });
    }
  });

  const loginWithFacebook = () => {
    FB.login(
      function (response) {
        if (response.authResponse) {
          const access_token = response.authResponse.accessToken; //get access token
          const user_id = response.authResponse.userID; //get FB UID
          api('/auth/facebook',{
            method:'POST',
            body: JSON.stringify({
              access_token,
              user_id,
            })
          }).then(() => {
            setDialogOpen(true)
            setDialogMessage('Eroare la conectarea cu Facebook.')
          })
        } else {
          setDialogOpen(true)
          setDialogMessage('Eroare la conectarea cu Facebook.')
        }
      },
      {
        scope: "public_profile,email",
      }
    );
  };

  useEffect(() => {
    if (config && window && document) {
      const script = document.createElement("script");
      const body = document.getElementsByTagName("body")[0];
      script.src = "//apis.google.com/js/api:client.js";
      body.appendChild(script);

      script.addEventListener("load", () => {
        gapi.load("auth2", function (auth2: unknown) {
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          auth2 = gapi.auth2.init({
            client_id: config.GOOGLE_CLIENT_ID,
            //cookiepolicy: "single_host_origin",
          });

          const element = document.getElementById("connect_with_google");

          auth2.attachClickHandler(
            element,
            {},
            function (googleUser: unknown) {
              console.log(googleUser.getBasicProfile());
            },
            function (error: unknown) {
              setDialogOpen(true)
              setDialogMessage('Eroare la conectarea cu Google. Detalii: ' + error.error)
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
            const formJson = Object.fromEntries(formData.entries());

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
                <IconButton
                  onClick={() => loginWithFacebook()}
                  id="connect_with_facebook"
                  variant="outlined"
                  size="lg"
                >
                  <Facebook />
                </IconButton>
              </Tip>
            </div>
          </div>
        </div>

        <OrSection>sau</OrSection>

        <Link href="/u/anunturi/creaza">
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
          data-client_id={config.GOOGLE_CLIENT_ID}
          data-login_uri="https://aham.ro/u/anunturi/creaza"
          data-auto_prompt="true"
        ></div>
      </div>

      <Modal open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Conectare cu terțe servicii
          </DialogTitle>
          <Divider />
          <DialogContent>
            {dialogMessage}
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => setDialogOpen(false)}>
              OK
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

    </>
  );
}
