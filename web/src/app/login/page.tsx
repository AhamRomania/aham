"use client";

import getApiFetch from "@/api/api";
import { setAccessToken } from "@/c/Auth";
import getConfig, { Config } from "@/c/config";
import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import Tip from "@/c/tooltip";
import { AuthInfo } from "@/c/types";
import { css } from "@emotion/react";
import { Facebook, Google } from "@mui/icons-material";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Input, Modal, ModalDialog, Stack } from "@mui/joy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


declare const FB: any;

declare const gapi: any;

export default function Page() {
  
  const router = useRouter();
  const api = getApiFetch();

  const [loggingIn, setLoggingIn] = useState(false);
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
      
      function (response: any) {
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

  const setupGoogleLoginButton = () => {
    if (config && config.GOOGLE_CLIENT_ID && window && document) {
      
      const script = document.createElement("script");
      const body = document.getElementsByTagName("body")[0];
      script.src = "https://apis.google.com/js/api:client.js";

      script.addEventListener("load", () => {
        
        gapi.load("auth2", function (auth2: any) {
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          auth2 = gapi.auth2.init({
            client_id: config.GOOGLE_CLIENT_ID,
            //cookiepolicy: "single_host_origin",
          });

          const element = document.getElementById("connect_with_google");

          auth2.attachClickHandler(
            element,
            {},
            
            function (googleUser: any) {
              console.log(googleUser.getBasicProfile());
            },
            
            function (error: any) {
              setDialogOpen(true)
              setDialogMessage('Eroare la conectarea cu Google. Detalii: ' + error.error)
            }
          );
        });
      });

      body.appendChild(script);

    }
  }

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
            setLoggingIn(true);
            api<AuthInfo>("/auth", {
              method: "POST",
              body: JSON.stringify(formJson),
            }).then((data:AuthInfo) => {
              setAccessToken(data)
              setLoggingIn(false);
              const query = new URLSearchParams(window.location.search);
              if (query.get('then')) {
                router.push(query.get('then') as string);
              } else {
                router.push(`/u/anunturi/creaza`);
              }
              router.refresh();
            }).catch(() => {
              setLoggingIn(false);
              alert('Nu m-am putut loga');
            });
          }}
        >
          <Stack spacing={1}>
            <Input
              data-test="login-email-input"
              name="email"
              type="text"
              placeholder="Email"
              size="lg"
              required
            />
            <Input
              data-test="login-password-input"
              name="password"
              type="password"
              placeholder="Parolă"
              size="lg"
              required
            />
            <Button size="lg" type="submit" data-test="login-submit">
              {loggingIn ? <CircularProgress size="sm"/> : 'Intră'}
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
                  onMouseOver={() => setupGoogleLoginButton()}
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
